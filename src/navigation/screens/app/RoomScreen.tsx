import { KContainer, KSpacer } from "../../../components";
import { View, Text } from "react-native-ui-lib";
import { KLobbyControls } from "../../../components/KLobbyControls";
import { KEdgeSvg } from "../../../components/KEdgeSvg";
import { KSittingInfo } from "../../../components/KSittingInfo";
import { KProduct } from "../../../components/KProduct";
import { useContext, useEffect, useMemo, useState } from "react";
import { Item } from "../../../constants/types";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors, database } from "../../../constants";
import { useDatabase } from "../../../hooks";
import { AuthContext } from "../../../store";
import { onValue, ref, off, set } from "firebase/database";
import absoluteFill = StyleSheet.absoluteFill;
import moment from "moment";

export const RoomScreen = () => {
  const [scannedObject, setScannedObject] = useState(null);
  const [room, setRoom] = useState(null);
  const { params } = useRoute();
  const { reset, navigate } = useNavigation();
  const { getRoom, addRoomToUser, addFriends } = useDatabase();
  const { uid } = useContext(AuthContext);

  //@ts-ignore
  const fromFlow = params?.fromFlow;
  //@ts-ignore
  const roomId = params?.room || params?.id;
  //@ts-ignore
  const isDeep = params?.id;

  useEffect(() => {
    const roomRef = ref(database, "rooms/" + roomId);

    const unsubscribe = onValue(
      roomRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const roomData = snapshot.val();

          // Force complete state replacement to trigger re-renders
          setRoom(roomData);
          setScannedObject(roomData.bill);

          if (
            (roomData?.owner ?? "") !== uid &&
            !roomData.membersIds.includes(uid)
          ) {
            addRoomToUser({ id: uid, room: roomId }).catch((error) =>
              console.error("Error adding user to room:", error),
            );
            addFriends({ id: uid, owner: roomData.owner });
          }
        } else {
          console.log("Room not found");
        }
      },
      (error) => {
        console.error("Error listening to room updates:", error);
      },
    );

    // Clean up the listener when component unmounts
    return () => off(roomRef);
  }, [roomId, uid]);

  // Remove useMemo to ensure updates when room changes
  const renderProducts = () => {
    if (!scannedObject?.items || !room)
      return <Text>No scanned items found.</Text>;

    return scannedObject.items.map((item, index) => (
      <KProduct
        key={`${item.id || index}-${JSON.stringify(room.membersDistribution)}`}
        item={item}
        userId={uid}
        roomId={roomId}
        distribution={room.membersDistribution}
      />
    ));
  };

  return (
    <KContainer>
      <KLobbyControls
        isFromFlow={fromFlow}
        roomId={roomId}
        isDeep={isDeep}
        isOwner={(room?.owner ?? "") === uid}
      />
      {scannedObject ? (
        <View marginH-10>
          <KEdgeSvg />
          <View
            style={{
              backgroundColor: "#fff",
              marginTop: -15,
              alignItems: "center",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            <KSittingInfo
              restaurantName={room?.bill.store || "Store Name"}
              date={moment(room?.date).format("MMM Do YY") || "Unknown Date"}
              hour={room?.hour || "4:20 AM"}
            />
            <View paddingH-15 paddingV-10 width={"100%"} gap-10>
              {renderProducts()}
            </View>
          </View>
        </View>
      ) : (
        <ActivityIndicator />
      )}
      {(room?.owner ?? "") === uid && (
        <View marginH-10>
          <KSpacer />
          <TouchableOpacity
            style={{
              backgroundColor: Colors.lightBlue,
              width: "100%",
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 12,
              alignSelf: "center",
            }}
            onPress={() => {
              navigate("RecapScreen", { roomId: roomId });
            }}
          >
            <Text bodyL white bold>
              Continue to recap
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {fromFlow && (
        <>
          <View center marginT-10 row gap-3>
            <Text style={{ fontSize: 14 }}>Don't want to finish now?</Text>
            <TouchableOpacity
              onPress={() => {
                reset({
                  index: 0,
                  routes: [{ name: "Tabs" }],
                });
              }}
            >
              <Text color={Colors.lightBlue}>Go to homepage</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </KContainer>
  );
};
