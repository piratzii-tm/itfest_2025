import { KContainer } from "../../../components";
import { View, Text } from "react-native-ui-lib";
import { KEdgeSvg } from "../../../components/KEdgeSvg";
import { KSittingInfo } from "../../../components/KSittingInfo";
import { ScrollView, TouchableOpacity } from "react-native";
import { Colors } from "../../../constants";
import { useNavigation } from "@react-navigation/native";

const MOCK_DATA = [
  {
    id: 0,
    name: "Cristi",
    items: [
      { id: 0, name: "Paste carbonara", quantity: 1, price: 38.0 },
      { id: 1, name: "Green Apple", quantity: 1, price: 18.0 },
      { id: 2, name: "Vodka", quantity: 1, price: 25.0 },
    ],
  },
  {
    id: 1,
    name: "Iulian",
    items: [
      { id: 0, name: "Pizza diavola", quantity: 1, price: 35.0 },
      { id: 1, name: "Pina Colada", quantity: 1, price: 28.0 },
      { id: 2, name: "Apa", quantity: 2, price: 12.0 },
      { id: 3, name: "Sos rosii", quantity: 1, price: 4.0 },
    ],
  },
  {
    id: 2,
    name: "Vladislav",
    items: [
      { id: 0, name: "Burger Vita Black Angus", quantity: 1, price: 42.0 },
      { id: 1, name: "Apa", quantity: 2, price: 12.0 },
      { id: 2, name: "Sos rose", quantity: 1, price: 5.0 },
    ],
  },
  {
    id: 3,
    name: "Andreea",
    items: [
      { id: 0, name: "Salata Ceaser", quantity: 1, price: 33.0 },
      { id: 1, name: "Hugo", quantity: 1, price: 28.0 },
    ],
  },
];

export const RecapScreen = () => {
  const { reset } = useNavigation();
  const navigation = useNavigation();

  const calcualteTotal = (items: any) =>
    items.reduce((a: any, b: any) => a + b.price * b.quantity, 0);

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
            restaurantName={"Store Name"}
            date={new Date().toString()}
            hour={"4:20 AM"}
          />
          <View style={{ width: "100%", paddingHorizontal: 20 }}>
            {MOCK_DATA.map((friend) => (
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
                      RON {calcualteTotal(friend.items)}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "center" }}>
                  {friend.items.map((item: any) => (
                    <View
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
                  ))}
                </View>
              </View>
            )) || <Text>No scanned items found.</Text>}
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
            {MOCK_DATA.reduce(
              (a: any, b: any) =>
                a +
                b.items.reduce((a: any, b: any) => a + b.price * b.quantity, 0),
              0,
            )}{" "}
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
            navigation.navigate("HomeScreen");
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
