import React, {useState, useEffect, useRef} from "react";
import { Text} from "react-native-ui-lib";
import {
    Image,
    TouchableOpacity,
    useWindowDimensions,
    View,
    Modal,
    Button,
    StyleSheet, Linking,
} from "react-native";
import {Camera, CameraView} from "expo-camera";
import {useNavigation} from "@react-navigation/native";
import {Colors} from "../constants";

export const KQr = () => {
    const {width} = useWindowDimensions();
    const [scannerVisible, setScannerVisible] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const cameraRef = useRef(null);
    const {reset} = useNavigation()

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    const handleBarCodeScanned = (data) => {
        setScannerVisible(false)
        Linking.openURL(data.data).catch(err => console.error("Failed to open URL:", err))
    }

    return (
        <>
            <TouchableOpacity
                onPress={() => setScannerVisible(true)}
                style={{
                    backgroundColor: Colors.white90,
                    width: width - 20,
                    borderWidth: 0.1,
                    borderRadius: 10,
                    maxHeight: (width - 20) * 0.5,
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
                            width: "40%",
                            height: "100%",
                            borderRadius: 10,
                            marginRight: 12,
                            borderWidth: 15,
                            borderColor: Colors.lightBlue100,
                        }}
                    />
                    <View style={{flex: 1, flexDirection: "row", flexWrap: "wrap"}}>
                        <Text bodyL semiBold style={{flexShrink: 1}}>
                            Scan the QR Code to join a room with your friends.
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* QR Scanner Modal */}
            <Modal visible={scannerVisible} animationType="slide">
                <View style={styles.container}>
                    {hasPermission === null ? (
                        <Text>Requesting Camera Permission...</Text>
                    ) : hasPermission === false ? (
                        <Text>No access to camera</Text>
                    ) : (
                        <CameraView
                            ref={cameraRef}
                            style={StyleSheet.absoluteFillObject}
                            focusable
                            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                            barCodeScannerSettings={{
                                barCodeTypes: ["qr", 'org.iso.QRCode'],
                            }}
                        />
                    )}

                    {scanned && (
                        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)}/>
                    )}

                    <TouchableOpacity
                        onPress={() => setScannerVisible(false)}
                        style={styles.closeButton}
                    >
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    closeButton: {
        position: "absolute",
        top: 50,
        right: 20,
        backgroundColor: Colors.lightBlue,
        padding: 10,
        borderRadius: 5,
    },
    closeText: {
        color: "white",
        fontWeight: "bold",
    },
});
