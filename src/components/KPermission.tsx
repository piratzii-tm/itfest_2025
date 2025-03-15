import {Text, View} from "react-native-ui-lib";
import {TouchableOpacity} from "react-native";
import {KContainer} from "./KContainer";
import {KSpacer} from "./KSpacer";

export const KPermission = ({requestPermission}: {requestPermission: () => any}) => (
    <KContainer>
        <Text center medium heading>
            Ready to <Text bold>scan receipts</Text>?
            Just need your <Text bold>camera permission</Text>!
        </Text>
        <KSpacer/>
        <TouchableOpacity
            style={{
                justifyContent: "center",
                alignItems: "center",
            }}
            onPress={requestPermission}
        >
            <Text center regular heading>Grant Access</Text>
        </TouchableOpacity>
    </KContainer>
)