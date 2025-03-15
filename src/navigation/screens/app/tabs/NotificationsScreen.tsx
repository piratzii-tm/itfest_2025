import React, { useState, useEffect } from "react";
import { KContainer, KSpacer } from "../../../../components";
import { View } from "react-native-ui-lib";
import { ScrollView } from "react-native";
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

export const NotificationsScreen: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { getNotifications } = useDatabase();
    const uid = auth.currentUser?.uid;

    useEffect(() => {
        const fetchNotifications = async () => {
            if (uid) {
                const userNotifications = await getNotifications(uid);
                setNotifications(userNotifications);
            }
        };

        fetchNotifications();
    }, [uid]);

    const getImageForNotificationType = (type: string) => {
        // Define default images for each notification type
        switch (type) {
            case 'roomInvite':
                return { uri: "https://play-lh.googleusercontent.com/Ife0Lgs7ZBZTu5He68SLlYF-HuCgXp661SQuRMV5P-h3NlYygGTgFCOiLgcZjFfjqFrj" };
            case 'giveMoney':
                return { uri: "https://cdn-icons-png.flaticon.com/512/69/69881.png" };
            default:
                return { uri: "https://openclipart.org/image/800px/271120" };
        }
    };

    const formatTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;

        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes} Minutes Ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} Hours Ago`;

        const days = Math.floor(hours / 24);
        return `${days} Days Ago`;
    };

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

                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <React.Fragment key={index}>
                                <KNotification
                                    title={notification.title}
                                    description={notification.body}
                                    time={formatTime(notification.timestamp)}
                                    image={getImageForNotificationType(notification.type)}
                                />
                                {index < notifications.length - 1 && <KSpacer h={6} w={30} />}
                            </React.Fragment>
                        ))
                    ) : (
                        <Text bodyM center>No notifications yet</Text>
                    )}
                </View>
            </ScrollView>
        </KContainer>
    );
};