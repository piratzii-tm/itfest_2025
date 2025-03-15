import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ScanScreen } from "./ScanScreen";
import { NotificationsScreen } from "./NotificationsScreen";
import { KTabBar } from "../../../../components";
import { HomeScreen } from "./HomeScreen";

const Tab = createBottomTabNavigator();

export const Tabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <KTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name={"HomeScreen"} component={HomeScreen} />
      <Tab.Screen name={"ScanScreen"} component={ScanScreen} />
      <Tab.Screen
        name={"NotificationsScreen"}
        component={NotificationsScreen}
      />
    </Tab.Navigator>
  );
};
