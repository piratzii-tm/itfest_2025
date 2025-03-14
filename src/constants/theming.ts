import {
    Colors as RNUILibColors,
    Typography as RNUILibTypographies,
} from "react-native-ui-lib";

export const Colors = {
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",
};

export const Typographies = {
    light:{
        fontFamily: "DMSans-Light",
    },
    extraThin: {
        fontFamily: "DMSans-ExtraThin",
    },
    thin: {
        fontFamily: "DMSans-Thin",
    },
    regular: {
        fontFamily: "DMSans-Regular",
    },
    medium: {
        fontFamily: "DMSans-Medium",
    },
    semiBold: {
        fontFamily: "DMSans-SemiBold",
    },
    bold: {
        fontFamily: "DMSans-Bold",
    },
    extraBold: {
        fontFamily: "DMSans-ExtraBold",
    },

};

export const configTheme = () => {
    RNUILibColors.loadColors(Colors);
    RNUILibTypographies.loadTypographies(Typographies);
};