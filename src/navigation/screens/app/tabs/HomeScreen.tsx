import React, { useState } from "react";
import { KContainer, KPermission } from "../../../../components";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  Modal,
} from "react-native";
import { Text } from "react-native-ui-lib";
import { Colors, Typographies } from "../../../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPenToSquare,
  faCheck,
  faTimes,
  faPlus,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { launchImageLibrary } from "react-native-image-picker";
import { useCamera } from "../../../../hooks";
import {
  CameraView,
  useCameraPermissions,
  Camera,
  CameraType,
} from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tempAvatar =
  "https://icons.iconarchive.com/icons/diversity-avatars/avatars/256/batman-icon.png";
// TODO: Fix the camera view -> make the rear camera, not back

export const HomeScreen = () => {
  const [username, setUsername] = useState("batman");
  const { showActionSheetWithOptions } = useActionSheet();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(username);
  const [avatarUri, setAvatarUri] = useState(tempAvatar);
  const borderAnim = new Animated.Value(1);
  const [cameraType, setCameraType] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraVisible, setCameraVisible] = useState(false);
  const { bottom } = useSafeAreaInsets();

  const { setCameraRef, takePhoto, photo } = useCamera();

  React.useEffect(() => {
    if (photo) {
      setAvatarUri(photo);
      setCameraVisible(false);
    }
  }, [photo]);

  const handleEditPress = () => {
    setIsEditing(true);
    setInputValue(username);
    Animated.timing(borderAnim, {
      toValue: 2,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const handleConfirm = () => {
    setUsername(inputValue);
    setIsEditing(false);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const chooseFromLibrary = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 0.8,
      });

      if (result.assets && result.assets[0]?.uri) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Image library error:", error);
    }
  };

  const handleCamera = async () => {
    if (!permission?.granted) {
      requestPermission();
      return;
    }
    setCameraVisible(true);
  };

  const handleAvatarPress = () => {
    showActionSheetWithOptions(
      {
        options: ["Take Photo", "Choose from Library", "Cancel"],
        cancelButtonIndex: 2,
        userInterfaceStyle: "light",
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          await handleCamera();
        } else if (buttonIndex === 1) {
          chooseFromLibrary();
        }
      },
    );
  };

  const handleCancel = () => {
    setInputValue(username);
    setIsEditing(false);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  if (permission && !permission.granted && permission.canAskAgain) {
    return <KPermission requestPermission={requestPermission} />;
  }

  return (
    <KContainer>
      <View style={styles.headerCard}>
        <TouchableOpacity
          style={styles.buttonAvatar}
          onPress={handleAvatarPress}
        >
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          <View style={styles.avatarOverlay}>
            <FontAwesomeIcon icon={faPlus} size={16} color={Colors.white} />
          </View>
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Hello,</Text>
          <Animated.View
            style={[
              styles.nameEditContainer,
              isEditing && styles.nameEditContainerActive,
              {
                borderWidth: borderAnim.interpolate({
                  inputRange: [1, 2],
                  outputRange: [1.5, 2.5],
                }),
              },
            ]}
          >
            <TextInput
              style={styles.userNameInput}
              value={inputValue}
              onChangeText={setInputValue}
              editable={isEditing}
              selectTextOnFocus={isEditing}
              placeholder="Enter your name"
              placeholderTextColor={Colors.grey}
            />
            {isEditing ? (
              <View style={styles.editButtonsContainer}>
                <TouchableOpacity
                  style={styles.editActionButton}
                  onPress={handleConfirm}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    size={18}
                    color={Colors.darkBlue}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editActionButton}
                  onPress={handleCancel}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    size={18}
                    color={Colors.darkGray}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.editIcon}
                onPress={handleEditPress}
              >
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  size={18}
                  color={Colors.darkGray}
                />
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </View>

      <Modal visible={cameraVisible} animationType="slide">
        <CameraView
          style={{
            flex: 1,
            justifyContent: "center",
            paddingBottom: bottom + 90,
          }}
          ref={(ref) => setCameraRef(ref)}
          type={cameraType}
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
              <FontAwesomeIcon icon={faCamera} size={24} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setCameraVisible(false)}
            >
              <FontAwesomeIcon icon={faTimes} size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </Modal>
    </KContainer>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: Colors.darkGray,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonAvatar: {
    position: "relative",
    width: 70,
    height: 70,
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: Colors.lightBlue100,
  },
  avatarOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.darkBlue,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  textContainer: {
    marginLeft: 15,
    flexDirection: "column",
    flex: 1,
  },
  welcomeText: {
    ...Typographies.bodyL,
    color: Colors.darkGray,
  },
  nameEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    backgroundColor: Colors.white80,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: Colors.lightBlue100,
  },
  nameEditContainerActive: {
    borderColor: Colors.darkBlue,
    backgroundColor: Colors.white,
  },
  userNameInput: {
    ...Typographies.bodyXL,
    ...Typographies.medium,
    flex: 1,
    color: Colors.black,
    paddingVertical: 8,
  },
  editIcon: {
    padding: 12,
  },
  editButtonsContainer: {
    flexDirection: "row",
  },
  editActionButton: {
    padding: 10,
    marginLeft: 5,
    borderRadius: 8,
    backgroundColor: Colors.white80,
  },
  cameraControls: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  cameraButton: {
    backgroundColor: Colors.darkBlue,
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  cancelButton: {
    backgroundColor: Colors.darkGray,
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
});
