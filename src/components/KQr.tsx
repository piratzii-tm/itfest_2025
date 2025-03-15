import React from "react";
import { Colors, Text } from "react-native-ui-lib";
import { Image, TouchableOpacity, View } from "react-native";

export const KQr = () => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.white90,
        height: "40%",
        width: "100%",
        borderWidth: 0.1,
        borderRadius: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
          padding: 12,
          height: "100%",
        }}
      >
        <Image
          source={{
            uri: "https://play-lh.googleusercontent.com/lomBq_jOClZ5skh0ELcMx4HMHAMW802kp9Z02_A84JevajkqD87P48--is1rEVPfzGVf",
          }}
          style={{
            width: "50%",
            height: "100%",
            borderRadius: 10,
            marginRight: 12,
            borderWidth: 20,
            borderColor: Colors.lightBlue100,
          }}
        />
        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
          <Text bodyL semiBold style={{ flexShrink: 1 }}>
            Scan the QR Code to share room link with your friends.
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
