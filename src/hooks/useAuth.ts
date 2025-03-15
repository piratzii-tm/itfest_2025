import { useContext } from "react";
import { AuthContext } from "../store";
import { auth } from "../constants";
import {
  signInWithPhoneNumber,
  signOut as signOutFirebase,
} from "firebase/auth";
import { useDatabase } from "./useDatabase";

export const useAuth = () => {
  const { confirmation, setConfirmation } = useContext(AuthContext);
  const { initUser } = useDatabase();

  const signOut = () => signOutFirebase(auth);
  const signIn = async (phoneNumber: string, recaptchaVerifier: any) => {
    try {
      // For React Native, we need the recaptchaVerifier from the component
      const response = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier,
      );
      console.log("Verification sent successfully");
      setConfirmation(response);
      return response;
    } catch (e) {
      console.error("Error sending verification:", e);
      throw e;
    }
  };
  // This will return a value of type UserCredentials
  const confirm = async (code: string, name: string): Promise<any | null> => {
    try {
      if (!confirmation) {
        throw new Error("No verification was sent");
      }
      confirmation.confirm(code).then((credentials) => {
        initUser({
          id: credentials.user.uid,
          name,
          phone: credentials.user.phoneNumber,
        });
      });
    } catch (e) {
      console.error("Error confirming code:", e);
      throw e;
    }
  };

  return {
    signIn,
    confirm,
    signOut,
  };
};
