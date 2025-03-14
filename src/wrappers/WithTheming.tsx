import {ReactNode, useEffect} from "react";
import {configTheme} from "../constants";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export const WithTheming = ({children}:{children: ReactNode}) => {
    configTheme()

    return <GestureHandlerRootView style={{flex: 1}}>
        {children}
    </GestureHandlerRootView>
}