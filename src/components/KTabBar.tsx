import React, { useEffect } from "react";
import { Pressable, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native-ui-lib";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { KTabBarIcon } from "./KTabBarIcon";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const KTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const tabWidth = 80;
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(state.index * tabWidth, {
      duration: 300,
    });
  }, [state.index, tabWidth, translateX]);

  return (
    <View width={width} center>
      <View
        row
        style={{
          position: "absolute",
          bottom: Math.max(bottom + 10, 10),
          borderRadius: 90,
          gap: 20,
          // backgroundColor: colors.tundora,
        }}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              height: 60,
              width: 60,
              // backgroundColor: colors.nevada,
              borderRadius: 90,
              // borderColor: colors.tundora,
              borderWidth: 3,
            },
            useAnimatedStyle(() => ({
              transform: [{ translateX: translateX.value }],
            })),
          ]}
        />
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={{
                borderRadius: 90,
                height: 60,
                width: 60,
              }}
            >
              <View
                flex
                center
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 90,
                  // backgroundColor: colors.transparent,
                }}
              >
                <KTabBarIcon
                  label={options.tabBarLabel ?? options.title ?? route.name}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
