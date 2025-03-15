import {
    Colors as RNUILibColors,
    Typography as RNUILibTypographies,
} from "react-native-ui-lib";

export const Colors = {
    white: "#FFFFFF",
    white80: "rgba(255,255,255,0.8)",
    black: "#000000",
    grey: "#808080",
    lightBlue: "#6E90F5",
    lightBlue100: "#5f7ed9",
    darkBlue: "#4169E1",
    darkerBlue: "#304582",
    transparent: "transparent",
    lightGrey:"#F0F0F0",
    darkNavy:"#1C1C3B"

};

export const Typographies = {
    heading: {
        fontSize: 32
    },
    body: {
        fontSize: 16
    },
    bodyL: {
        fontSize: 18,
    },
    bodyXL: {
        fontSize: 24,
    },
    bodyM: {
        fontSize: 14,
    },
    bodyS: {
        fontSize: 12,
    },
    small: {
        fontSize: 10,
    },
    light: {
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