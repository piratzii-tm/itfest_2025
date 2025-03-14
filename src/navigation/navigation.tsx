import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";


const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

export const Navigation = () => <NavigationContainer>
    {/*TODO Add the screens and handle based on the auth*/}
    <Stack.Navigator>
        <Stack.Screen name={}/>
    </Stack.Navigator>
</NavigationContainer>