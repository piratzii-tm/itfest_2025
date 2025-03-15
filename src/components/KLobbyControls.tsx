import { Colors, Text, View } from "react-native-ui-lib";
import { TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type StackParamList = {
  HomeScreen: undefined;
  RoomScreen: undefined;
};

export const KLobbyControls = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackParamList, "RoomScreen">>();

  return (
    <View
      paddingH-10
      paddingV-5
      row
      style={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          backgroundColor: "white",
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
        }}
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          size={20}
          color={Colors.lightBlue}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "white",
          width: 60,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 14,
        }}
      >
        <Text color={Colors.lightBlue} bold bodyM>
          Edit
        </Text>
      </TouchableOpacity>
    </View>
  );
};
