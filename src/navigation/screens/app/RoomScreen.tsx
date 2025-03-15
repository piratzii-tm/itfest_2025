import { KContainer } from "../../../components";
import { Colors, View, Text } from "react-native-ui-lib";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "./HomeScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Svg, { Path } from "react-native-svg";
import { useState } from "react";
import { KLobbyControls } from "../../../components/KLobbyControls";
import { KEdgeSvg } from "../../../components/KEdgeSvg";
import { KSittingInfo } from "../../../components/KSittingInfo";
import { KProduct } from "../../../components/KProduct";

export const RoomScreen = () => {
  const [restaurantName, setRestaurantName] = useState("Gourment Coffe");
  const [date, setDate] = useState("Sept 4, 2024");
  const [hour, setHour] = useState("8:00");

  return (
    <KContainer>
      <KLobbyControls />
      <View marginH-10>
        <KEdgeSvg />
        <View
          style={{
            backgroundColor: "#fff",
            marginTop: -15,
            alignItems: "center",
          }}
        >
          <KSittingInfo
            restaurantName={restaurantName}
            date={date}
            hour={hour}
          />
          <View paddingH-15 paddingV-10 width={"100%"} gap-10>
            <KProduct
              productName={"Coffe"}
              productPrice={5}
              productQuantity={2}
            />
          </View>
        </View>
      </View>
    </KContainer>
  );
};
