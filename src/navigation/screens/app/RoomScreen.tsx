import { KContainer } from "../../../components";
import { View, Text, Button } from "react-native-ui-lib";
import { useNavigation } from "@react-navigation/native";

export const RoomScreen = () => {
  const { navigate } = useNavigation();

  return (
    <KContainer>
      <View>
        <Text>Room</Text>
        <Button
          label={"Continue to invites"}
          onPress={() => navigate("AddFriendsScreen")}
        />
      </View>
    </KContainer>
  );
};
