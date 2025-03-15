import { KContainer } from "../../../../components";
import { Button, View } from "react-native";
import { Text } from "react-native-ui-lib";
import { useNavigation } from "@react-navigation/native";

export const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <KContainer>
      <View>
        <Button
          title={"rrom"}
          onPress={() => navigation.navigate("RoomScreen")}
        />
      </View>
    </KContainer>
  );
};
