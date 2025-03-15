import {KContainer} from "../../../../components";
import {Button, View} from "react-native";
import {useNotifications} from "../../../../hooks/useNotifications";

export const HomeScreen = () => {

    const {sendPushNotification} = useNotifications()

    return (
        <KContainer>
            <Button title={"Test notification"} onPress={()=>sendPushNotification("ExponentPushToken[RDf2mrNujO6Jw84lTlS2Li]")}/>
        </KContainer>
    );
}