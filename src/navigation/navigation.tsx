import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RegisterScreen } from "./screens/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { auth } from "../constants";
import { AddFriendsScreen, RoomScreen, Tabs } from "./screens/app";
import { AuthContext } from "../store";
import { WithNotifications } from "../wrappers";
import { SelectFriends } from "./screens/app/SelectFriends";
import { EditScreen } from "./screens/app/EditScreen";

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={"RegisterScreen"} component={RegisterScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={"Tabs"} component={Tabs} />
    <Stack.Screen name={"EditScreen"} component={EditScreen} />
    <Stack.Screen name={"SelectFriends"} component={SelectFriends} />
    <Stack.Screen name={"RoomScreen"} component={RoomScreen} />
    <Stack.Screen name={"AddFriendsScreen"} component={AddFriendsScreen} />
  </Stack.Navigator>
);

export const Navigation = () => {
  const [isLogged, setIsLogged] = useState(true);
  const { setUid } = useContext(AuthContext);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    });
  }, []);

  return (
    <WithNotifications>
      <NavigationContainer>
        {isLogged ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </WithNotifications>
  );
};
