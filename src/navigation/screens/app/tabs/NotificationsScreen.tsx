import React, {useState, useEffect} from "react";
import {KContainer, KSpacer} from "../../../../components";
import {View} from "react-native-ui-lib";
import {ScrollView, TouchableOpacity, RefreshControl} from "react-native";
import {KNotification} from "../../../../components/KNotification";
import { Text} from "react-native-ui-lib";
import {useDatabase} from "../../../../hooks";
import {auth, database, Colors} from "../../../../constants";
import {ref, push} from "firebase/database";
import {useNavigation} from "@react-navigation/native";
import moment from "moment";

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
    const [refreshing, setRefreshing] = useState(false);
    const {
        getNotifications,
        addFriends
    } = useDatabase();
    const uid = auth.currentUser?.uid;
    const {getUser} = useDatabase();
    const {navigate} = useNavigation();

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
        <KContainer hasNavbar={true}>
            <ScrollView
                style={{flex: 1, width: "100%"}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
                showsVerticalScrollIndicator={false}
                alwaysBounceVertical={true}
                bounces={true}
            >
                <View style={{flex: 1, alignItems: "center"}}>
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
                                backgroundColor: Colors.lightBlue,
                                marginTop: 10,
                                paddingRight: 10,
                            }}
                        />
                        <Text
                            bodyXL
                            bold
                            darkBlue
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
                                backgroundColor: Colors.lightBlue,
                                marginTop: 10,
                            }}
                        />
                    </View>
                    <KSpacer h={20}/>
                    {notifications.length > 0 ? (
                        notifications.sort((t1, t2) => {
                            let p1 = t1.timestamp ?? (new Date()).setDate((new Date()).getDate() - 5)
                            let p2 = t2.timestamp ?? (new Date()).setDate((new Date()).getDate() - 5)
                            return moment(p1).isBefore(p2) ? 1 : -1
                        }).map((notification, index) => {
                            console.log(notification);
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={async () => {
                                        if (notification.title === "New friend invite" && uid) {
                                            getUser({id: uid}).then(userInfo => getUser({
                                                id: notification.receiverID || notification.data.inviteId,
                                            }).then(friendInfo => addFriends({
                                                id: userInfo.id, owner: friendInfo.id
                                            }).then(()=>alert("Happy new friends!"))))
                                        } else if ((notification.data || notification.content).roomId) {
                                            navigate("RoomScreen", {
                                                room: (notification.data || notification.content)
                                                    .roomId,
                                            });
                                        } else {
                                            alert("Room not available");
                                        }
                                    }}
                                >
                                    <KNotification
                                        title={notification.title}
                                        description={notification.description || notification.body}
                                        time={formatTime(notification.timestamp ?? (new Date()).setDate((new Date()).getDate() - 5))}
                                        image={getImageForNotificationType(notification.type)}
                                    />
                                    {index < notifications.length - 1 && <KSpacer h={15}/>}
                                </TouchableOpacity>
                            );
                        })
                    ) : (
                        <Text bodyL center>
                            No notifications yet.
                        </Text>
                    )}
                </View>
            </ScrollView>
            <KSpacer h={60}/>
        </KContainer>
    );
};
