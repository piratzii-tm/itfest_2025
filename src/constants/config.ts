import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { environment } from "./environment";


const app = initializeApp(environment.firebaseConfig);

export const auth =  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});