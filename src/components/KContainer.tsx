import {ReactNode} from "react";
import {View} from "react-native-ui-lib";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export const KContainer = ({children}: { children: ReactNode }) => {

    const {top} = useSafeAreaInsets()

    return <View flex style={{
        paddingTop: top
    }}>
        {children}
    </View>
}