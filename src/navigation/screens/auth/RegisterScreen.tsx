import React, { useState, useRef } from 'react';
import { Text } from "react-native-ui-lib";
import { KContainer } from "../../../components";
import { useAuth } from "../../../hooks";
import { TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { environment } from "../../../constants";

export const RegisterScreen = () => {
    const recaptchaVerifier = useRef(null);
    const { signIn, confirm } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState("+40753055749");
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
            const result = await confirm(verificationCode);
            console.log("Authentication successful:", result.user);
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

            <Text bold center marginB-20 text40>Phone Authentication</Text>

            {!verificationSent ? (
                <View>
                    <Text marginB-10>Enter your phone number:</Text>
                    <TextInput
                        style={{
                            backgroundColor: "#f2f2f2",
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 20,
                        }}
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                    />

                    <TouchableOpacity
                        onPress={handleSendCode}
                        disabled={loading || !phoneNumber}
                        style={{
                            backgroundColor: loading || !phoneNumber ? "#cccccc" : "#2196F3",
                            padding: 15,
                            borderRadius: 8,
                            alignItems: "center",
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text white>Send Verification Code</Text>
                        )}
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <Text marginB-10>Enter verification code:</Text>
                    <TextInput
                        style={{
                            backgroundColor: "#f2f2f2",
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 20,
                        }}
                        placeholder="Verification code"
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        keyboardType="number-pad"
                    />

                    <TouchableOpacity
                        onPress={handleConfirmCode}
                        disabled={loading || !verificationCode}
                        style={{
                            backgroundColor: loading || !verificationCode ? "#cccccc" : "#2196F3",
                            padding: 15,
                            borderRadius: 8,
                            alignItems: "center",
                            marginBottom: 10,
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text white>Verify</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setVerificationSent(false)}
                        style={{
                            padding: 15,
                            borderRadius: 8,
                            alignItems: "center",
                        }}
                    >
                        <Text blue30>Back to Phone Number</Text>
                    </TouchableOpacity>
                </View>
            )}
        </KContainer>
    );
};