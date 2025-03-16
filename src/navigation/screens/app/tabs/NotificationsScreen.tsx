import React, { useState, useEffect } from "react";
import { KContainer, KSpacer } from "../../../../components";
import { View } from "react-native-ui-lib";
import { ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import KNotification from "../../../../components/KNotification";
import { Colors, Text } from "react-native-ui-lib";
import { useDatabase } from "../../../../hooks";
import { useAuth } from "../../../../hooks";
import { auth } from "../../../../constants";

type Notification = {
  title: string;
  body: string;
  timestamp: number;
  type: string;
  content: any;
  receiverID: string;
};
// TODO: Fix ScrollView(can't scroll in the middle due to KContainer -> TouchableWithoutFeedback)

export const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const {
    getNotifications,
    sendAddedToRoomNotification,
    sendPaymentNotification,
  } = useDatabase();
  const uid = auth.currentUser?.uid;

  const fetchNotifications = async () => {
    if (uid) {
      const userNotifications = await getNotifications(uid);
      setNotifications(userNotifications);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [uid]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const testNotification = async () => {
    const currentUser = auth.currentUser;
    if (currentUser?.uid) {
      await sendPaymentNotification(currentUser.uid, currentUser.uid, 200);

      const updatedNotifications = await getNotifications(currentUser.uid);
      setNotifications(updatedNotifications);
    }
  };

  const getImageForNotificationType = (type: string) => {
    const images = {
      roomInvite: require("../../../../../assets/user-plus-icon.png"),
      giveMoney: require("../../../../../assets/dollar-check-icon.png"),
    };
    return images[type] || require("../../../../../assets/user-line-icon.png");
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `1 minute ago`;

    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} Minutes Ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} Hours Ago`;

    const days = Math.floor(hours / 24);
    return `${days} Days Ago`;
  };

  return (
    <KContainer hasNavbar={true} extraBottom={80}>
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={true}
        bounces={true}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: Colors.grey,
                marginTop: 10,
                paddingRight: 10,
              }}
            />
            <Text
              bodyXL
              bold
              darkNavy
              style={{
                paddingTop: 10,
                textAlign: "center",
                paddingHorizontal: 10,
              }}
            >
              Notifications
            </Text>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: Colors.grey,
                marginTop: 10,
              }}
            />
          </View>
          <KSpacer h={20} />
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <React.Fragment key={index}>
                <KNotification
                  title={notification.title}
                  description={notification.description || notification.body}
                  time={formatTime(notification.timestamp ?? new Date())}
                  image={getImageForNotificationType(notification.type)}
                />
                {index < notifications.length - 1 && <KSpacer h={15} />}
              </React.Fragment>
            ))
          ) : (
            <Text bodyL center>
              No notifications yet.
            </Text>
          )}
        </View>
      </ScrollView>
      <KSpacer h={60} />
    </KContainer>
  );
};
