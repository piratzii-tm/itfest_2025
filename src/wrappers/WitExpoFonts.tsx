import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {ReactNode, useEffect} from "react";

SplashScreen.preventAutoHideAsync();

export const WithExpoFonts = ({children}: { children: ReactNode }) => {

    const [loaded, error] = useFonts({
        "DMSans-Thin": require("../../assets/fonts/DMSans-Thin.ttf"),
        "DMSans-Regular": require("../../assets/fonts/DMSans-Regular.ttf"),
        "DMSans-Medium": require("../../assets/fonts/DMSans-Medium.ttf"),
        "DMSans-Bold": require("../../assets/fonts/DMSans-Bold.ttf"),
        "DMSans-SemiBold": require("../../assets/fonts/DMSans-SemiBold.ttf"),
        "DMSans-ExtraLight": require("../../assets/fonts/DMSans-ExtraLight.ttf"),
        "DMSans-ExtraBold": require("../../assets/fonts/DMSans-ExtraBold.ttf"),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return children;
};

