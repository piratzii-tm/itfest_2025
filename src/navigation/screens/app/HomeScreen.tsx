import {KContainer} from "../../../components";
import {View} from "react-native-ui-lib";
import {Button} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";

export type StackParamList = {
    HomeScreen: undefined;
    RoomScreen: undefined;
};

export const HomeScreen = () => {
    const navigation = useNavigation<StackNavigationProp<StackParamList, 'HomeScreen'>>();

    return <KContainer>
        <View>
            <Button title={"Go to room"} onPress={()=>navigation.navigate("RoomScreen")}/>
        </View>
    </KContainer>
}