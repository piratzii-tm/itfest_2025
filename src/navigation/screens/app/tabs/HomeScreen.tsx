import {KContainer} from "../../../../components";
import {Button} from "react-native";
import {NotificationType, useNotifications} from "../../../../hooks/useNotifications";

export const HomeScreen = () => {

    const {sendPushNotification} = useNotifications()

    return (
        <KContainer>
            <Button title={"Test notification"} onPress={()=>sendPushNotification({
                expoPushToken:"ExponentPushToken[RDf2mrNujO6Jw84lTlS2Li]",
                type: NotificationType.newFriend,
                data: {
                    inviterId:"1321",
                    inviterName:"Iulian",
                }
            })}/>
        </KContainer>
    );
}