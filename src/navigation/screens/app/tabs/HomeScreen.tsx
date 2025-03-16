import React, {useCallback, useContext, useEffect, useState} from "react";
import {KContainer, KPermission, KSpacer} from "../../../../components";
import {StyleSheet, TouchableOpacity, Modal, FlatList, useWindowDimensions} from "react-native";
import {auth, Colors, Typographies} from "../../../../constants";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faTimes, faCamera, faCameraRotate} from "@fortawesome/free-solid-svg-icons";
import {useActionSheet} from "@expo/react-native-action-sheet";
import * as ImagePicker from 'expo-image-picker';
import {useCamera, useDatabase} from "../../../../hooks";
import {CameraType, CameraView, useCameraPermissions} from "expo-camera";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import KProfileHeader from "../../../../components/KProfileHeader";
import KActivityCard from "../../../../components/KActivityCard";
import {Text, View} from "react-native-ui-lib";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {set, ref as dbRef, onValue, off} from "firebase/database";
import {storage, database} from "../../../../constants";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {AuthContext} from "../../../../store";
import {KQr} from "../../../../components/KQr";
import {KJoinedRoom} from "../../../../components/KJoinedRoom";
import {ScrollView} from 'react-native';

export const HomeScreen = () => {
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraVisible, setCameraVisible] = useState(false);
    const [facing, setFacing] = useState<CameraType>('back');

    const {showActionSheetWithOptions} = useActionSheet();
    const {bottom} = useSafeAreaInsets();

    const {setCameraRef, takePhoto, photo, setPhoto} = useCamera();
    const {getActiveRooms, getUser, getNonActiveRooms} = useDatabase()
    const {uid} = useContext(AuthContext)
    const [rooms, setRooms] = useState([])
    const [passedRoom, setPassedRooms] = useState([])
    const {navigate} = useNavigation()
    const [user, setUser] = useState(null)
    const {width} = useWindowDimensions()

    useEffect(() => {
        if (photo) {
            setCameraVisible(false);
        }
    }, [photo]);


    useEffect(() => {
        const userRef = dbRef(database, `users/${uid}`);
        const roomsRef = dbRef(database, `rooms`);

        // Listen for changes in user data
        const unsubscribeUser = onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                setUser(snapshot.val());
            }
        });

        // Listen for changes in active and non-active rooms
        const unsubscribeRooms = onValue(roomsRef, (snapshot) => {
            if (snapshot.exists()) {
                const allRooms = snapshot.val();
                const userRooms = Object.values(allRooms).filter((room: any) =>
                    room.membersIds.includes(uid)
                );

                // **Ensuring no duplicates**
                const activeRooms = [...new Map(userRooms
                    .filter((room: any) => room.active)
                    .map((room: any) => [room.id, room])) // Use Map to remove duplicates
                    .values()];

                const nonActiveRooms = [...new Map(userRooms
                    .filter((room: any) => !room.active)
                    .map((room: any) => [room.id, room])) // Use Map to remove duplicates
                    .values()];

                setRooms(activeRooms);
                setPassedRooms(nonActiveRooms);
            } else {
                setRooms([]); // Reset to avoid accumulation
                setPassedRooms([]);
            }
        });

        return () => {
            off(userRef);
            off(roomsRef);
        };
    }, [uid]);



    const chooseFromLibrary = async () => {
        try {
            setIsImageLoading(true);

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
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

    const toggleCameraFacing = () => {
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
            <KSpacer h={30}/>
            <Text bodyXL bold style={{paddingHorizontal: 10}}>
                Active Room:
            </Text>
            <Text bodyM light grey style={{paddingHorizontal: 10}}>
                This room is the current opened room that you've joined or created.
            </Text>
            <View>
                <FlatList horizontal data={rooms} renderItem={({item}) => {
                    const participants = Array.from(Object.values(item.didMembersJoined)).map((a) => {
                        const mem = Object.keys(a as any)[0]
                        if (item.membersIds.includes(mem)) {
                            if (a[mem])
                                return mem
                        }
                    }).filter(a => a)

                    return <KActivityCard owner={item.owner} onPress={() => navigate("RoomScreen", {room: item.id})}
                                          title={item.bill.store}
                                          participants={participants}/>
                }
                }
                contentContainerStyle={{paddingVertical:10}}
                />
            </View>
            <Text bodyXL bold style={{paddingHorizontal: 10}}>
                Join Room:
            </Text>
            <Text bodyM light grey style={{paddingHorizontal: 10}}>
                Share good times with friends by joining a room
            </Text>
            <KSpacer/>
            <View width={width} center>
                <KQr/>
            </View>
            {
                passedRoom.length > 0 &&
                <>
                    <KSpacer h={20}/>
                    <Text bodyXL bold style={{paddingHorizontal: 10}}>Joined Rooms:</Text>
                    <Text bodyM light grey style={{paddingHorizontal: 10}}>
                        Look over your passed splits
                    </Text>
                    <KSpacer/>
                    <View>
                        <ScrollView horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={{paddingHorizontal: 10, flexGrow: 1}}>
                            {
                                passedRoom.map(room =>
                                    <TouchableOpacity onPress={()=>navigate("RecapScreen",{roomId: room.id, fromHome: true})} style={{flexDirection: 'row', gap: 8, marginRight:10}}>
                                        <KJoinedRoom
                                            image={"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                                            roomName={room.bill.store}/>
                                    </TouchableOpacity>)
                            }
                        </ScrollView>
                    </View>

                </>
            }
            <KSpacer h={100}/>

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
                            <FontAwesomeIcon icon={faCamera} size={24} color={Colors.white}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setCameraVisible(false)}
                        >
                            <FontAwesomeIcon icon={faTimes} size={24} color={Colors.white}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flipCamera} onPress={toggleCameraFacing}>
                            <FontAwesomeIcon icon={faCameraRotate} size={32} color={Colors.white}/>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </Modal>
            <KSpacer h={20}/>
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
        marginLeft: 20,
    }
});
