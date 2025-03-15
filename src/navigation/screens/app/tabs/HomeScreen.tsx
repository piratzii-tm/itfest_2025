import React, {useCallback, useContext, useEffect, useState} from "react";
import {KContainer, KPermission, KSpacer} from "../../../../components";
import {StyleSheet, TouchableOpacity, Modal, FlatList} from "react-native";
import {Colors, Typographies} from "../../../../constants";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faTimes, faCamera} from "@fortawesome/free-solid-svg-icons";
import {useActionSheet} from "@expo/react-native-action-sheet";
import * as ImagePicker from "react-native-image-picker";
import {useCamera, useDatabase} from "../../../../hooks";
import {CameraView, useCameraPermissions} from "expo-camera";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import KProfileHeader from "../../../../components/KProfileHeader";
import KActivityCard from "../../../../components/KActivityCard";
import {Text, View} from "react-native-ui-lib";
import {AuthContext} from "../../../../store";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import { KQr } from "../../../../components/KQr";

const tempAvatar =
    "https://icons.iconarchive.com/icons/diversity-avatars/avatars/256/batman-icon.png";
// TODO: Fix the camera view -> make the rear camera, not back
// TODO: Make "Choose from Library" work

export const HomeScreen = () => {
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [cameraType, setCameraType] = useState("back");
    const [username, setUsername] = useState("batman");

    const [avatarUri, setAvatarUri] = useState(tempAvatar);
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraVisible, setCameraVisible] = useState(false);

    const {showActionSheetWithOptions} = useActionSheet();
    const {bottom} = useSafeAreaInsets();

    const {setCameraRef, takePhoto, photo} = useCamera();
    const {getActiveRooms, getUser} = useDatabase()
    const {uid} = useContext(AuthContext)
    const [rooms, setRooms] = useState([])
    const {navigate} = useNavigation()
    const [user, setUser] = useState(null)

    useEffect(() => {
        if (photo) {
            setAvatarUri(photo);
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
            const result = await ImagePicker.launchImageLibrary({
                mediaType: "photo",
                quality: 0.6,
                includeBase64: false,
                selectionLimit: 1,
            });

            if (result.assets && result.assets[0]?.uri) {
                setAvatarUri(result.assets[0].uri);
            }
        } catch (error) {
            console.log("Image library error:", error);
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
                username={user?.name??""}
                avatarUri={avatarUri}
                onUsernameChange={setUsername}
                onAvatarPress={handleAvatarPress}
            />
            <KSpacer h={30}/>
            <Text bodyXL bold style={{paddingHorizontal: 10}}>
                Active Room:
            </Text>
            <Text bodyM light grey style={{paddingHorizontal: 10}}>
                This room is the current opened room that you've joined or created.
            </Text>
            <KSpacer h={5}/>
            <View>
                <FlatList horizontal data={rooms} renderItem={({item}) =>
                    <KActivityCard owner={item.owner} onPress={() => navigate("RoomScreen", {room: item.id})} title={item.bill.store}
                                   participants={Array.from(Object.values(item.didMembersJoined).filter(a => Object.values(a)[0] as boolean))}/>
                }/>
            </View>
            <KSpacer h={10}/>
            <Text bodyXL bold style={{paddingHorizontal: 10}}>
                Join Room:
            </Text>
            <Text bodyM light grey style={{paddingHorizontal: 10}}>
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
      <KSpacer h={10} />
      <View style={{ flex: 1, padding: 10 }}>
        <KQr />
      </View>
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
        shadowOffset: {width: 0, height: 6},
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
