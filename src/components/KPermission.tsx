import {Text, View} from "react-native-ui-lib";
import {TouchableOpacity} from "react-native";

export const KPermission = ({requestPermission}: {requestPermission: () => any}) => (
    <View padding-20 style={{ flex: 1, justifyContent: "center" }}>
        <Text style={{ textAlign: "center", color: "#fff" }}>
            Ready to <Text sushi>scan receipts</Text>?
            Just need your <Text royalBlue>camera permission</Text>!
        </Text>
        <TouchableOpacity
            style={{
                height: 50,
                width: 100,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
            }}
            onPress={requestPermission}
        >
            <Text>Grant Access</Text>
        </TouchableOpacity>
    </View>
)