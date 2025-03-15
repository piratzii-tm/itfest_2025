import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RegisterScreen } from "./screens/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../constants";
import { RoomScreen } from "./screens/app";
import { Tabs } from "./screens/app/Tabs";

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={"RegisterScreen"} component={RegisterScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={"Tabs"} component={Tabs} />
    <Stack.Screen name={"RoomScreen"} component={RoomScreen} />
  </Stack.Navigator>
);

export const Navigation = () => {
  const [isLogged, setIsLogged] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user.providerData)
                setIsLogged(true);
            } else {
                setIsLogged(false);
            }
        });
    }, []);

  return (
    <NavigationContainer>
      {isLogged ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
