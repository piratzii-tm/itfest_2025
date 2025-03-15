import { Text, View } from "react-native-ui-lib";

interface KSittingInfoProps {
  restaurantName: string;
  date: string;
  hour: string;
}

export const KSittingInfo = ({
  restaurantName,
  date,
  hour,
}: KSittingInfoProps) => {
  return (
    <View paddingV-15 center>
      <Text heading bold>
        {restaurantName}
      </Text>
      <Text marginT-5 body color={"#919191"}>
        {date} - {hour}
      </Text>
    </View>
  );
};
