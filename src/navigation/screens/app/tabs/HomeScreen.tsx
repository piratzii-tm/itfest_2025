import React, {useCallback,useContext, useEffect, useState} from "react";
import { KContainer, KPermission, KSpacer } from "../../../../components";
import { View, StyleSheet, TouchableOpacity, Modal,FlatList } from "react-native";
import {auth, Colors, Typographies} from "../../../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes, faCamera, faCameraRotate } from "@fortawesome/free-solid-svg-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from 'expo-image-picker';
import {useCamera, useDatabase} from "../../../../hooks";
import {CameraType, CameraView, useCameraPermissions} from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import KProfileHeader from "../../../../components/KProfileHeader";
import KActivityCard from "../../../../components/KActivityCard";
import { Text } from "react-native-ui-lib";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {set,  ref as dbRef} from "firebase/database";
import {storage, database} from "../../../../constants";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {AuthContext} from "../../../../store";

export const HomeScreen = () => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');

    const {showActionSheetWithOptions} = useActionSheet();
    const {bottom} = useSafeAreaInsets();

  const { setCameraRef, takePhoto, photo, setPhoto } = useCamera();
    const {getActiveRooms, getUser} = useDatabase()
    const {uid} = useContext(AuthContext)
    const [rooms, setRooms] = useState([])
    const {navigate} = useNavigation()
    const [user, setUser] = useState(null)

  useEffect(() => {
    if (photo) {
      setCameraVisible(false);
    }
  }, [photo]);

    useEffect(() => {
        getUser({id: uid}).then(setUser)
        getActiveRooms({id: uid}).then(setRooms)
    }, [uid]);

    useFocusEffect(
        useCallback(()=>{
            getUser({id: uid}).then(setUser)
            getActiveRooms({id: uid}).then(setRooms)
        },[])
    )

  const chooseFromLibrary = async () => {
    try {
      setIsImageLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:["images"],
        quality: 0.6,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.canceled || !result.assets || !result.assets[0]?.uri) {
        console.log("User canceled image selection");
        return;
      }

      const selectedImageUri = result.assets[0].uri;
      setPhoto(result.assets[0].uri);

      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.log("No user is logged in.");
        return;
      }

      const filename = `photos/${userId}.jpg`;
      const storageRef = ref(storage, filename);

      const response = await fetch(selectedImageUri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      const userPhotoRef = dbRef(database, `users/${userId}/photoURL`);
      await set(userPhotoRef, downloadURL);

      console.log("Photo uploaded successfully:", downloadURL);
    } catch (error) {
      console.error("Image library error:", error);
    } finally {
      setIsImageLoading(false);
    }
  };

    const handleCamera = async () => {
        if (!permission?.granted) {
            await requestPermission();
            return;
        }
        setCameraVisible(true);
    };

  const toggleCameraFacing = ()=> {
    setFacing(facing === 'back' ? 'front' : 'back');
  }

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
          await chooseFromLibrary();
        }
      },
    );
  };

    if (permission && !permission.granted && permission.canAskAgain) {
        return <KPermission requestPermission={requestPermission}/>;
    }


  return (
    <KContainer>
      <KProfileHeader
        onAvatarPress={handleAvatarPress}
      />
      <KSpacer h={30} />
      <Text bodyXL bold style={{ paddingHorizontal: 10 }}>
        Active Room:
      </Text>
      <Text bodyM light grey style={{ paddingHorizontal: 10 }}>
        This room is the current opened room that you've joined or created.
      </Text>
      <KSpacer h={5} />
        <View>
            <FlatList horizontal data={rooms} renderItem={({item}) =>
                <KActivityCard owner={item.owner} onPress={() => navigate("RoomScreen", {room: item.id})} title={item.bill.store}
                               participants={Array.from(Object.values(item.didMembersJoined).filter(a => Object.values(a)[0] as boolean))}/>
            }/>
        </View>
      <KSpacer h={10} />
      <Text bodyXL bold style={{ paddingHorizontal: 10 }}>
        Join Room:
      </Text>
      <Text bodyM light grey style={{ paddingHorizontal: 10 }}>
        Use one of the below options to join.
      </Text>

      {/* CAMERA MODAL*/}
      <Modal visible={cameraVisible} animationType="slide">
        <CameraView
          style={{
            flex: 1,
            justifyContent: "center",
            paddingBottom: bottom + 90,
          }}
          ref={(ref) => setCameraRef(ref)}
          facing={facing}
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
            <TouchableOpacity style={styles.flipCamera} onPress={toggleCameraFacing}>
              <FontAwesomeIcon icon={faCameraRotate} size={32} color={Colors.white} />
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
    backgroundColor: Colors.white90,
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
    backgroundColor: Colors.white90,
  },
  cameraControls: {
    position: "absolute",
    bottom: 50,
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
  flipCamera: {
    backgroundColor: Colors.darkBlue,
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginLeft:20,
  }
});
