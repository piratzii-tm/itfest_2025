import { useContext } from "react";
import { AuthContext } from "../store";
import { auth } from "../constants";
import { signInWithPhoneNumber } from "firebase/auth";

export const useAuth = () => {
    const { confirmation, setConfirmation } = useContext(AuthContext);

    const signIn = async (phoneNumber: string, recaptchaVerifier: any) => {
        try {
            // For React Native, we need the recaptchaVerifier from the component
            const response = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
            console.log("Verification sent successfully");
            setConfirmation(response);
            return response;
        } catch (e) {
            console.error("Error sending verification:", e);
            throw e;
        }
    };

    // This will return a value of type UserCredentials
    const confirm = async (code: string): Promise<any | null> => {
        try {
            if (!confirmation) {
                throw new Error("No verification was sent");
            }
            return await confirmation.confirm(code);
        } catch (e) {
            console.error("Error confirming code:", e);
            throw e;
        }
    };

    return {
        signIn,
        confirm
    };
};