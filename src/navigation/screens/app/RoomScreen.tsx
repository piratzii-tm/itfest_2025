import { KContainer } from "../../../components";
import { Colors, View, Text } from "react-native-ui-lib";
import { KLobbyControls } from "../../../components/KLobbyControls";
import { KEdgeSvg } from "../../../components/KEdgeSvg";
import { KSittingInfo } from "../../../components/KSittingInfo";
import { KProduct } from "../../../components/KProduct";
import { useContext } from "react";
import { ScannerContext } from "../../../store/scanner";
import { Item } from "../../../constants/types";

export const RoomScreen = () => {
  const { scannedObject } = useContext(ScannerContext);

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
            restaurantName={scannedObject?.store || "Unknown Store"}
            date={scannedObject?.date || "Unknown Date"}
            hour={"11:00 AM"}
          />
          <View paddingH-15 paddingV-10 width={"100%"} gap-10>
            {scannedObject?.items?.map((item: Item, index: number) => (
              <KProduct
                key={index}
                productName={item.name}
                productPrice={item.price}
                productQuantity={item.quantity}
              />
            )) || <Text>No scanned items found.</Text>}
          </View>
        </View>
      </View>
    </KContainer>
  );
};
