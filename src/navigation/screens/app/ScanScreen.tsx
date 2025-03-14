import { KContainer } from "../../../components";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useCamera } from "../../../hooks";
import { KPermission } from "../../../components/KPermission";

export const ScanScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const {
    setCameraRef,
    isProcessing,
    error,
    takePhoto,
    sendImageToOpenAI,
    photo,
  } = useCamera();

  if (!permission) return <View />;
  if (!permission.granted) {
    return <KPermission requestPermission={requestPermission} />;
  }

  return (
    <KContainer>
      <Text bold center style={{ marginTop: 50, color: "#fff" }}>
        Receipt Scanner
      </Text>

      <CameraView
        style={{ flex: 1, justifyContent: "center", paddingBottom: 95 }}
        ref={(ref) => setCameraRef(ref)}
      >
        {isProcessing && (
          <View
            absF
            flex
            backgroundColor={Colors.codGray}
            style={{ opacity: 0.8 }}
            height={windowHeight}
            width={windowWidth}
            center
          >
            <Text white style={{ fontSize: 30 }}>
              Processing...
            </Text>
          </View>
        )}

        {error && (
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
        )}

        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            padding: 10,
          }}
        >
          {/* 📸 Take Photo Button */}
          <TouchableOpacity
            onPress={takePhoto}
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
                borderColor: Colors.codGray,
                borderWidth: 2,
              }}
            />
          </TouchableOpacity>

          {/* 🚀 Send to OpenAI Button */}
          {photo && (
            <TouchableOpacity
              onPress={sendImageToOpenAI}
              style={{
                marginTop: 20,
                padding: 10,
                backgroundColor: "blue",
                borderRadius: 10,
              }}
            >
              <Text white>Send to OpenAI</Text>
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </KContainer>
  );
};
