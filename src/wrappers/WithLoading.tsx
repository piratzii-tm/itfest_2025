import React, { ReactNode, useContext, useEffect } from "react";
import { Text, View } from "react-native-ui-lib";
import { ActivityIndicator, useWindowDimensions } from "react-native";
import { KSpacer } from "../components";
import { Colors } from "../constants";
import { RootContext } from "../store";

export const WithLoading = ({ children }: { children: ReactNode }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { processing } = useContext(RootContext);

  useEffect(() => {
    console.log(processing, "isProcessing");
  }, [processing]);

  const ProcessingView = () => (
    <View
      flex
      style={{
        backgroundColor: Colors.white80,
        position: "absolute",
        zIndex: 11,
      }}
      height={windowHeight}
      width={windowWidth}
      center
    >
      <ActivityIndicator size="large" />
      <KSpacer />
      <Text darkerBlue heading semiBold>
        Processing...
      </Text>
    </View>
  );

  return (
    <>
      {processing && <ProcessingView />}
      {children}
    </>
  );
};
