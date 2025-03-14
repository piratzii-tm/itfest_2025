import {useFonts} from "expo-font";
import {ReactNode} from "react";

export const WithExpoFonts = ({children}: { children: ReactNode }) => {
    const [doneLoading] = useFonts({
        "DMSans-Thin": require("../../assets/fonts/DMSans-Thin.ttf"),
        "DMSans-Regular": require("../../assets/fonts/DMSans-Regular.ttf"),
        "DMSans-Medium": require("../../assets/fonts/DMSans-Medium.ttf"),
        "DMSans-Bold": require("../../assets/fonts/DMSans-Bold.ttf"),
        "DMSans-ExtraLight": require("../../assets/fonts/DMSans-ExtraLight.ttf"),
        "DMSans-ExtraBold": require("../../assets/fonts/DMSans-ExtraBold.ttf"),
    });
    return doneLoading ? children : null;
};

