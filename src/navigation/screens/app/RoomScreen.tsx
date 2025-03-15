import { KContainer } from "../../../components";
import { Colors, View, Text } from "react-native-ui-lib";
import { useState } from "react";
import { KLobbyControls } from "../../../components/KLobbyControls";
import { KEdgeSvg } from "../../../components/KEdgeSvg";
import { KSittingInfo } from "../../../components/KSittingInfo";
import { KProduct } from "../../../components/KProduct";
import { Item } from "../../../constants/types";

export const RoomScreen = () => {
  // const { recipetData } = route.params;

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
          {/*<KSittingInfo*/}
          {/*  restaurantName={recipetData.store}*/}
          {/*  date={recipetData.date}*/}
          {/*  hour={new Date().toString()}*/}
          {/*/>*/}
          <View paddingH-15 paddingV-10 width={"100%"} gap-10>
            <KProduct
              productName={"Coffe"}
              productPrice={5}
              productQuantity={2}
            />
            {/*{recipetData.items.map((item: Item, index: number) => (*/}
            {/*  <KProduct*/}
            {/*    productName={item.name}*/}
            {/*    productPrice={item.price}*/}
            {/*    productQuantity={item.quantity}*/}
            {/*  />*/}
            {/*))}*/}
          </View>
        </View>
      </View>
    </KContainer>
  );
};
