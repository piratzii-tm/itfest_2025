import React, {useState, useRef} from 'react';
import {Text, View} from "react-native-ui-lib";
import {KContainer, KSpacer} from "../../../components";
import {useAuth} from "../../../hooks";
import {FirebaseRecaptchaVerifierModal} from "expo-firebase-recaptcha";
import {Colors, environment, Typographies} from "../../../constants";
import {ActivityIndicator, TouchableOpacity, TextInput, useWindowDimensions, Alert} from "react-native";

export const RegisterScreen = () => {
    const recaptchaVerifier = useRef(null);
    const {signIn, confirm} = useAuth();
    const {height, width} = useWindowDimensions()

    const [phoneNumber, setPhoneNumber] = useState("+40753055749");
    const [name, setName] = useState("Iulian")

    const [verificationCode, setVerificationCode] = useState("");
    const [verificationSent, setVerificationSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendCode = async () => {
        try {
            setLoading(true);
            if (!recaptchaVerifier.current) {
                throw new Error("reCAPTCHA Verifier is not initialized");
            }
            await signIn(phoneNumber, recaptchaVerifier.current);
            setVerificationSent(true);
            Alert.alert("Success", "Verification code sent!");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to send verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmCode = async () => {
        try {
            setLoading(true);
            const result = await confirm(verificationCode, name);
            Alert.alert("Success", "Phone authentication successful!");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Invalid verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KContainer>
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={environment.firebaseConfig}
                attemptInvisibleVerification={true}
            />
            <View flex bg-transparent bottom padding-10>
                <Text bold heading darkerBlue>🚀 Let's get right into it!</Text>
            </View>
            <View bottom bg-lightBlue100 height={height * 0.71} style={{
                borderTopRightRadius: 25,
                borderTopLeftRadius: 25,
            }}>
                <View paddingT-30 center bg-lightBlue height={height * 0.7} style={{
                    borderTopRightRadius: 30,
                    borderTopLeftRadius: 30,
                }}>
                    <View width={width * 0.9}>
                        <Text bodyXL semiBold>Your first name:</Text>
                    </View>
                    <KSpacer h={5}/>
                    <TextInput
                        style={{
                            borderRadius: 10,
                            backgroundColor: "white",
                            width: width * 0.9,
                            height: 40,
                            paddingHorizontal: 10,
                            ...Typographies.bodyM,
                            ...Typographies.medium
                        }}
                        value={name}
                        onChangeText={setName}
                        placeholder={"ex: John"}
                        editable={!verificationSent}
                    />
                    <KSpacer h={10}/>
                    <View width={width * 0.9}>
                        <Text bodyXL semiBold>Your phone:</Text>
                    </View>
                    <KSpacer h={5}/>
                    <TextInput
                        style={{
                            borderRadius: 10,
                            backgroundColor: "white",
                            width: width * 0.9,
                            height: 40,
                            paddingHorizontal: 10,
                            ...Typographies.bodyM,
                            ...Typographies.medium
                        }}
                        placeholder={"ex: +123456789"}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        editable={!verificationSent}
                    />
                    {
                        verificationSent && <>
                            <KSpacer h={10}/>
                            <View width={width * 0.9}>
                                <Text bodyXL semiBold>Received verification code:</Text>
                            </View>
                            <KSpacer h={5}/>
                            <TextInput
                                style={{
                                    borderRadius: 10,
                                    backgroundColor: "white",
                                    width: width * 0.9,
                                    height: 40,
                                    paddingHorizontal: 10,
                                    ...Typographies.bodyM,
                                    ...Typographies.medium
                                }}
                                placeholder={"ex: "}
                                value={verificationCode}
                                onChangeText={setVerificationCode}
                                keyboardType="number-pad"
                                editable={verificationSent}
                            />
                        </>
                    }
                    <KSpacer h={20}/>
                    {!verificationSent ? <TouchableOpacity
                            onPress={handleSendCode}
                            disabled={loading || !phoneNumber}
                            style={{
                                backgroundColor: loading || !phoneNumber ? "#cccccc" : Colors.darkBlue,
                                padding: 15,
                                borderRadius: 10,
                                alignItems: "center",
                                width: width * 0.6
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator color={Colors.darkBlue}/>
                            ) : (
                                <Text semiBold body white>Send Verification Code</Text>
                            )}
                        </TouchableOpacity> :
                        <TouchableOpacity
                            onPress={handleConfirmCode}
                            disabled={loading || !verificationCode}
                            style={{
                                backgroundColor: loading || !verificationCode ? "#cccccc" : Colors.darkBlue,
                                padding: 15,
                                borderRadius: 10,
                                alignItems: "center",
                                width: width * 0.6
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator color={Colors.darkBlue}/>
                            ) : (
                                <Text semiBold body white>Verify</Text>
                            )}
                        </TouchableOpacity>
                    }

                </View>
            </View>

        </KContainer>
    );
};