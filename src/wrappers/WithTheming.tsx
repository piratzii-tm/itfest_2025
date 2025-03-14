import {ReactNode, useEffect} from "react";
import {configTheme} from "../constants";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export const WithTheming = ({children}:{children: ReactNode}) => {
    useEffect(() => {
        configTheme()
    }, []);

    return <GestureHandlerRootView style={{flex: 1}}>
        {children}
    </GestureHandlerRootView>
}