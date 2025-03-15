import { KContainer } from "../../../components";
import { Colors, View, Text } from "react-native-ui-lib";
import { KLobbyControls } from "../../../components/KLobbyControls";
import { KEdgeSvg } from "../../../components/KEdgeSvg";
import { KSittingInfo } from "../../../components/KSittingInfo";
import { KProduct } from "../../../components/KProduct";

export const RoomScreen = () => {
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
            restaurantName={"Starbucks"}
            date={"Sept 4, 2024"}
            hour={"11:00 AM"}
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
