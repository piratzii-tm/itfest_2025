import { Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { Text, View } from "react-native-ui-lib";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useCamera } from "../../../../hooks";
import { KPermission, KSpacer } from "../../../../components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "../../../../constants";
import { ScannerContext } from "../../../../store/scanner";
import { useNavigation } from "@react-navigation/native";
import { RootContext } from "../../../../store";

export const ScanScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const {
    setCameraRef,
    error,
    takeRecipetPhoto,
    processImageContents,
    recipetPhoto,
  } = useCamera();
  const { scannedObject, setScannedObject } = useContext(ScannerContext);
  const { processing } = useContext(RootContext);
  const { navigate } = useNavigation();

  const [modalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (scannedObject && !processing && recipetPhoto) {
      navigate("EditScreen");
    }
  }, [scannedObject, processing, recipetPhoto]);

  if (!permission) return <View />;
  if (!permission.granted) {
    return <KPermission requestPermission={requestPermission} />;
  }

  const ErrorView = () => (
    <View
      style={{
        position: "absolute",
        top: 50,
        alignSelf: "center",
        backgroundColor: "red",
        padding: 10,
        borderRadius: 10,
      }}
    >
      <Text white>{error}</Text>
    </View>
  );

  return (
    <CameraView
      style={{ flex: 1, justifyContent: "center", paddingBottom: bottom + 90 }}
      ref={(ref) => setCameraRef(ref)}
    >
      {error && <ErrorView />}
      <View flex centerH bottom padding-10>
        <TouchableOpacity
          onPress={() => takeRecipetPhoto().then(() => setIsModalVisible(true))}
          style={{
            padding: 10,
            backgroundColor: Colors.white,
            height: 80,
            width: 80,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              padding: 10,
              backgroundColor: Colors.white,
              height: 65,
              width: 65,
              borderRadius: 999,
              borderColor: Colors.grey,
              borderWidth: 2,
            }}
          />
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        style={{ bottom: 10, justifyContent: "flex-end" }}
      >
        <View bg-white style={{ borderRadius: 20 }} padding-10>
          <Text bodyXL semiBold lightBlue style={{ paddingHorizontal: 10 }}>
            Image to be processed:
          </Text>
          <Text bodyS light grey style={{ paddingHorizontal: 10 }}>
            The image below will be used for your split. Please make sure that
            you captured the bill, if not, redo the image.
          </Text>
          <KSpacer h={15} />
          <Image
            source={{ uri: recipetPhoto }}
            height={windowHeight * 0.6}
            style={{
              borderRadius: 10,
            }}
          />
          <KSpacer h={30} />
          <TouchableOpacity
            onPress={() => setIsModalVisible(false)}
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor: Colors.lightBlue,
            }}
          >
            <Text white center bold bodyXL>
              Redo
            </Text>
          </TouchableOpacity>
          <KSpacer />
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(false);
              processImageContents().then((response) => {
                setScannedObject(response);
              });
            }}
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor: Colors.darkBlue,
            }}
          >
            <Text white center bold bodyXL>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </CameraView>
  );
};
