import React from "react";
import { KContainer, KSpacer } from "../../../../components";
import { View } from "react-native-ui-lib";
import { ScrollView } from "react-native";
import KNotification from "../../../../components/KNotification";
import { Colors, Text } from "react-native-ui-lib";

export const NotificationsScreen: React.FC = () => {
  return (
    <KContainer>
      <ScrollView>
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
              }}
            />
            <Text
              bodyL
              semiBold
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
          <KSpacer h={30} w={30} />
          <KNotification
            title="Room invitation"
            description="MikeB has invited you to join this room."
            time="1 Minutes Ago"
            image={{
              uri: "https://play-lh.googleusercontent.com/Ife0Lgs7ZBZTu5He68SLlYF-HuCgXp661SQuRMV5P-h3NlYygGTgFCOiLgcZjFfjqFrj",
            }}
          />
          <KSpacer h={6} w={30} />
          <KNotification
            title="Payment accepted"
            description="MikeB has accepted your payment."
            time="2 Minutes Ago"
            image={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToWaiwfzpqd-r-Hb77AnYpJcrzah8dQqfApg&s",
            }}
          />
          <KSpacer h={6} w={30} />
          <KNotification
            title="Reminder"
            description="Sarah should send you your payment."
            time="5 Minutes Ago"
            image={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToWaiwfzpqd-r-Hb77AnYpJcrzah8dQqfApg&s",
            }}
          />
          <KSpacer h={6} w={30} />
          <KNotification
            title="New friend"
            description="John has added you as a friend."
            time="50 Minutes Ago"
            image={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToWaiwfzpqd-r-Hb77AnYpJcrzah8dQqfApg&s",
            }}
          />
        </View>
      </ScrollView>
    </KContainer>
  );
};
