import {KContainer, KSpacer} from "../../../components";
import {View, Text} from "react-native-ui-lib";
import {KLobbyControls} from "../../../components/KLobbyControls";
import {KEdgeSvg} from "../../../components/KEdgeSvg";
import {KSittingInfo} from "../../../components/KSittingInfo";
import {KProduct} from "../../../components/KProduct";
import {useContext, useEffect, useState} from "react";
import {ScannerContext} from "../../../store/scanner";
import {Item} from "../../../constants/types";
import {useNavigation, useRoute} from "@react-navigation/native";
import {ActivityIndicator, Share, TouchableOpacity} from "react-native";
import {Colors} from "../../../constants";
import {useDatabase} from "../../../hooks";
import {faQrcode, faShareNodes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {AuthContext} from "../../../store";

export const RoomScreen = () => {
    const [scannedObject, setScannedObject] = useState(null);
    const [room, setRoom] = useState(null);
    const {params} = useRoute();
    const {reset} = useNavigation()
    const {getRoom, addRoomToUser} = useDatabase()
    const {uid} = useContext(AuthContext)


    //@ts-ignore
    const fromFlow = params?.fromFlow
    //@ts-ignore
    const roomId = params?.room || params?.id
    const isDeep = params?.id

    useEffect(() => {
        getRoom({id: roomId}).then((roomF) => {
            setScannedObject(roomF.bill)
            setRoom(roomF)

            if ((roomF?.owner ?? "") !== uid) {
                addRoomToUser({id: uid, room: roomId})
            }
        })


    }, []);


    return (
        <KContainer>
            <KLobbyControls isFromFlow={fromFlow} roomId={roomId} isDeep={isDeep}
                            isOwner={(room?.owner ?? "") === uid}/>
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
                            {scannedObject?.items?.map((item: Item, index: number) => (
                                <KProduct
                                    key={index}
                                    productName={item.name}
                                    productPrice={item.price}
                                    productQuantity={item.quantity}
                                />
                            )) || <Text>No scanned items found.</Text>}
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
        </KContainer>)
}