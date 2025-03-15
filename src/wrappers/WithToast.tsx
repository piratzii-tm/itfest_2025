import Toast from "react-native-toast-message";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export const WithToast = ({children}:{children}) => {

    const {top} = useSafeAreaInsets()

    return <>
        {children}
        <Toast topOffset={top}/>
    </>
}