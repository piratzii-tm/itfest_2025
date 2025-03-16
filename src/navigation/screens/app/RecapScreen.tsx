import { KContainer } from "../../../components";
import { View, Text } from "react-native-ui-lib";
import { KEdgeSvg } from "../../../components/KEdgeSvg";
import { KSittingInfo } from "../../../components/KSittingInfo";
import { TouchableOpacity } from "react-native";
import {Colors, database} from "../../../constants";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ref, onValue, get } from "firebase/database";

export const RecapScreen = ({ route }) => {
  const { roomId } = route.params; // Assuming you pass roomId as a parameter
  const { reset } = useNavigation();
  const [roomData, setRoomData] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get room data from realtime database
    const roomRef = ref(database, `rooms/${roomId}`);

    const unsubscribe = onValue(roomRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRoomData(data);

        // Check if membersDistribution exists
        if (data.membersDistribution && Array.isArray(data.membersDistribution)) {
          // Process the array of membersDistribution objects
          const userPromises = data.membersDistribution.flatMap(async (memberObj) => {
            // Each object has a single key (userId) with an array value
            const userId = Object.keys(memberObj)[0];
            const memberValue = memberObj[userId];

            console.log(memberValue)

            if (Array.isArray(memberValue) && memberValue[0] === "IGNORE") {
              return [];
            }

            const userRef = ref(database, `users/${userId}`);
            const userSnapshot = await get(userRef);
            const userData = userSnapshot.exists() ? userSnapshot.val() : { name: "Unknown User" };


            return [{
              id: userId,
              name: userData.name || "Unknown User",
              items: memberValue,
            }];
          });

          // Resolve all user promises and flatten the array
          const resolvedUsersArrays = await Promise.all(userPromises);
          const resolvedUsers = resolvedUsersArrays.flat();
          setUserData(resolvedUsers);
        }

        setLoading(false);
      } else {
        console.log("Room not found");
        setLoading(false);
      }
    }, (error) => {
      console.error("Error fetching room data:", error);
      setLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, [roomId]);

  const calculateTotal = (items) =>
      items.reduce((a, b) => a + b.price * b.quantity, 0);

  if (loading) {
    return (
        <KContainer>
          <View flex center>
            <Text bodyL>Loading...</Text>
          </View>
        </KContainer>
    );
  }

  return (
      <KContainer>
        <View marginH-10>
          <KEdgeSvg />
          <View
              style={{
                backgroundColor: "#fff",
                marginTop: -15,
                alignItems: "center",
                paddingBottom: 20,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
          >
            <KSittingInfo
                restaurantName={roomData?.restaurantName || "Store Name"}
                date={roomData?.date || new Date().toString()}
                hour={roomData?.hour || "4:20 AM"}
            />
            <View style={{ width: "100%", paddingHorizontal: 20 }}>
              {userData.length > 0 ? (
                  userData.map((friend) => (
                      <View
                          key={friend.id}
                          style={{
                            maxHeight: "65%",
                            marginVertical: 5,
                          }}
                      >
                        <View row width={"100%"}>
                          <View width={"70%"}>
                            <Text bodyXL bold>
                              {friend.name}
                            </Text>
                          </View>
                          <View flexG>
                            <Text bodyXL bold>
                              RON {calculateTotal(friend.items)}
                            </Text>
                          </View>
                        </View>
                        <View style={{ alignItems: "center" }}>
                          {friend.items.length > 0 ? (
                              friend.items.map((item) => (
                                  <View
                                      key={item.id}
                                      width={"80%"}
                                      style={{ justifyContent: "center", marginVertical: 1 }}
                                  >
                                    <View
                                        row
                                        style={{
                                          justifyContent: "space-between",
                                          width: "100%",
                                        }}
                                    >
                                      <View width={"80%"}>
                                        <Text bodyL>
                                          {item.quantity} x {item.name}:
                                        </Text>
                                      </View>
                                      <View flexG>
                                        <Text bodyL>RON {item.price}</Text>
                                      </View>
                                    </View>
                                  </View>
                              ))
                          ) : (
                              <Text bodyL>No items found for this user.</Text>
                          )}
                        </View>
                      </View>
                  ))
              ) : (
                  <Text>No users found.</Text>
              )}
            </View>
          </View>
          <View
              backgroundColor={Colors.lightBlue}
              marginV-10
              paddingV-12
              center
              style={{ borderRadius: 10 }}
              width={"100%"}
          >
            <Text bodyL bold white>
              Total:{" "}
              {userData.reduce(
                  (totalSum, user) => totalSum + calculateTotal(user.items),
                  0
              ).toFixed(2)}{" "}
              RON
            </Text>
          </View>
          <TouchableOpacity
              style={{
                borderRadius: 10,
                backgroundColor: "#fff",
                alignItems: "center",
                paddingVertical: 12,
              }}
              onPress={() => {
                reset({
                  index: 0,
                  routes: [{ name: "Tabs" }],
                });
              }}
          >
            <Text bodyL bold color={Colors.lightBlue}>
              End Room
            </Text>
          </TouchableOpacity>
        </View>
      </KContainer>
  );
};