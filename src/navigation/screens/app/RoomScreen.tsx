import {KContainer, KSpacer} from "../../../components";
import {View, Text} from "react-native-ui-lib";
import {KLobbyControls} from "../../../components/KLobbyControls";
import {KEdgeSvg} from "../../../components/KEdgeSvg";
import {KSittingInfo} from "../../../components/KSittingInfo";
import {KProduct} from "../../../components/KProduct";
import {useContext, useEffect, useMemo, useState} from "react";
import {ScannerContext} from "../../../store/scanner";
import {Item} from "../../../constants/types";
import {useNavigation, useRoute} from "@react-navigation/native";
import {ActivityIndicator, Share, TouchableOpacity} from "react-native";
import {Colors, database} from "../../../constants";
import {useDatabase} from "../../../hooks";
import {faQrcode, faShareNodes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {AuthContext} from "../../../store";
import {onValue, ref, off, set} from "firebase/database";

export const RoomScreen = () => {
    const [scannedObject, setScannedObject] = useState(null);
    const [room, setRoom] = useState(null);
    const {params} = useRoute();
    const {reset} = useNavigation()
    const {getRoom, addRoomToUser, addFriends} = useDatabase()
    const {uid} = useContext(AuthContext)

    //@ts-ignore
    const fromFlow = params?.fromFlow
    //@ts-ignore
    const roomId = params?.room || params?.id
    //@ts-ignore
    const isDeep = params?.id

    useEffect(() => {
        const roomRef = ref(database, "rooms/" + roomId);

        const unsubscribe = onValue(roomRef, (snapshot) => {
            if (snapshot.exists()) {
                const roomData = snapshot.val();

                // Force complete state replacement to trigger re-renders
                setRoom(roomData);
                setScannedObject(roomData.bill);

                if ((roomData?.owner ?? "") !== uid) {
                    addRoomToUser({id: uid, room: roomId})
                        .catch(error => console.error("Error adding user to room:", error));
                    addFriends({id: uid, owner: roomData.owner})
                }
            } else {
                console.log("Room not found");
            }
        }, (error) => {
            console.error("Error listening to room updates:", error);
        });

        // Clean up the listener when component unmounts
        return () => off(roomRef);
    }, [roomId, uid]);

    // Remove useMemo to ensure updates when room changes
    const renderProducts = () => {
        if (!scannedObject?.items || !room) return <Text>No scanned items found.</Text>;

        return scannedObject.items.map((item, index) => (
            <KProduct
                key={`${item.id || index}-${JSON.stringify(room.membersDistribution)}`}
                item={item}
                userId={uid}
                roomId={roomId}
                distribution={room.membersDistribution}
            />
        ));
    };

    return (
        <KContainer>
            <KLobbyControls
                isFromFlow={fromFlow}
                roomId={roomId}
                isDeep={isDeep}
                isOwner={(room?.owner ?? "") === uid}
            />
            {scannedObject ?
                <View marginH-10>
                    <KEdgeSvg/>
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
                            {renderProducts()}
                        </View>
                    </View>
                </View>
                : <ActivityIndicator/>}
            {
                fromFlow && <>
                    <KSpacer/>
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.lightBlue,
                            width: "90%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            alignSelf: "center",
                        }}
                        onPress={() => reset({
                            index: 0,
                            routes: [
                                {name: 'Tabs'},
                            ],
                        })}
                    >
                        <Text bodyL white bold>
                            Finish
                        </Text>
                    </TouchableOpacity>
                </>
            }
        </KContainer>
    );
};