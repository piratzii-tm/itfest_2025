import { Colors, Text, View } from "react-native-ui-lib";
import {
  Alert,
  Share,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faQrcode,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Modal from "react-native-modal";
import QRCode from "react-native-qrcode-svg";
import { useState } from "react";

type StackParamList = {
  HomeScreen: undefined;
  RoomScreen: undefined;
};

export const KLobbyControls = ({
  isFromFlow,
  roomId,
  isDeep,
  isOwner,
}: {
  isFromFlow: boolean;
  roomId: string;
  isDeep: boolean;
  isOwner: boolean;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackParamList, "RoomScreen">>();
  const { height, width } = useWindowDimensions();
  const [isVisible, setIsVisible] = useState(false);

  const onShare = async () => {
    try {
      const result = await Share.share({
        url: `exp://172.20.10.9:8081/--/room/${roomId}`,
        message: "Hello! You can handle your payment using this split \n\n",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <View
      paddingH-10
      paddingV-5
      row
      style={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <View width={"15%"}>
        {!isFromFlow && (
          <TouchableOpacity
            onPress={() => {
              if (isDeep) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Tabs" }],
                });
              } else {
                navigation.goBack();
              }
            }}
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
        )}
      </View>
      <View flexG center>
        <Text bodyXL bold>
          Current Bill
        </Text>
      </View>
      <View width={"15%"}>
        {isOwner && (
          <View row centerV gap-10>
            {/*{!isFromFlow  && <TouchableOpacity*/}
            {/*    style={{*/}
            {/*        backgroundColor: "white",*/}
            {/*        width: 60,*/}
            {/*        height: 40,*/}
            {/*        justifyContent: "center",*/}
            {/*        alignItems: "center",*/}
            {/*        borderRadius: 14,*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Text color={Colors.lightBlue} bold bodyM>*/}
            {/*        Edit*/}
            {/*    </Text>*/}
            {/*</TouchableOpacity>}*/}
            <TouchableOpacity onPress={onShare}>
              <FontAwesomeIcon icon={faShareNodes} size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsVisible(true)}>
              <FontAwesomeIcon icon={faQrcode} size={24} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Modal isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
        <View
          style={{
            height: height * 0.6,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <QRCode
            value={`exp://172.20.10.9:8081/--/room/${roomId}`}
            size={width * 0.8}
          />
        </View>
      </Modal>
    </View>
  );
};
