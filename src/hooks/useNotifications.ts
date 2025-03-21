import {
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
} from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

type RoomNotificationData = {
  roomId: string;
  inviterId: string;
  inviterName: string;
};

type PaymentNotificationData = {
  amount: number;
  inviterId: string;
  inviterName: string;
};

export type FriendRequestNotificationData = {
  inviterId: string;
  inviterName: string;
};

export class NotificationType {
  static roomInvite = "roomInvite";
  static giveMoney = "giveMoney";
  static newFriend = "newFriend";
}

export const useNotifications = () => {
  const buildNotification = ({
    type,
    data,
  }: {
    type: String;
    data:
      | RoomNotificationData
      | PaymentNotificationData
      | FriendRequestNotificationData;
  }) => {
    if (type === NotificationType.roomInvite)
      return {
        title: "Room invitation",
        body: `Hello there, you've been invited to a split by ${data.inviterName}`,
        data,
      };
    if (type === NotificationType.giveMoney)
      return {
        title: "Debts are no good",
        body: `Hello there, you still need to pay ${data.inviterName} their ${data?.amount ?? 12} RON.`,
        data,
      };
    if (type === NotificationType.newFriend)
      return {
        title: "New friend invite",
        body: `Hello there, you've have a new friend invitation from ${data.inviterName}`,
        data,
      };
  };

  const requestUserPermission = async () => {
    if (!Device.isDevice) {
      console.warn("Must use physical device for push notifications.");
      return false;
    }

    const { status: existingStatus } = await getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === "granted";
  };

  const getExpoPushToken = async () => {
    if (await requestUserPermission()) {
      const { data: token } = await getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId, // Needed for EAS builds
      }).catch(console.log);
      console.log("Expo Push Token:", token);
      return token;
    }
  };

  const sendPushNotification = async ({
    expoPushToken,
    data,
    type,
  }: {
    expoPushToken: string;
    data:
      | RoomNotificationData
      | PaymentNotificationData
      | FriendRequestNotificationData
      | any;
    type: String;
  }) => {
    const builtData = buildNotification({ data, type });

    const message = {
      to: expoPushToken,
      sound: "default",
      priority: "high",
      ...builtData,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((response) => response.json())
      .then((data) => console.log("Push Notification Sent:", data))
      .catch((error) => console.error("Error sending notification:", error));
  };

  return { requestUserPermission, getExpoPushToken, sendPushNotification };
};
