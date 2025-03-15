import {ReactNode} from "react";
import {View} from "react-native-ui-lib";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ImageBackground, Keyboard, TouchableWithoutFeedback} from "react-native";

export const KContainer = ({children, hasNavbar = false}: { children: ReactNode, hasNavbar?: boolean }) => {

    const {top} = useSafeAreaInsets()

    return <ImageBackground
        source={require("../../assets/background.png")}
        style={{flex:1}}
    >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} style={{flex:1}}>
            <View flex style={{
                paddingTop: top,
                paddingBottom: hasNavbar ? 80 : 0
            }}>

                {children}
            </View>
        </TouchableWithoutFeedback>
    </ImageBackground>
}