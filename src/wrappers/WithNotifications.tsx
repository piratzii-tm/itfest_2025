import {useContext, useEffect, useState} from 'react';
import * as Notifications from 'expo-notifications';
import {useNotifications} from '../hooks/useNotifications';
import {useDatabase} from "../hooks";
import {AuthContext} from "../store";

export const WithNotifications = ({children}) => {
    const {requestUserPermission, getExpoPushToken} = useNotifications();
    const {registerPushToken} = useDatabase()
    const {uid} = useContext(AuthContext)


    useEffect(() => {
        const setupNotifications = async () => {
            const hasPermission = await requestUserPermission();
            if (hasPermission) {
                const token = await getExpoPushToken();
                if(uid.length !== 0){
                    await registerPushToken({id: uid, pushToken: token})
                }
            }
        };

        setupNotifications();
    }, [uid]);

    useEffect(() => {
        // Handle notifications when received while app is in the foreground
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            console.log('Foreground notification received:', notification);
        });

        // Handle when user interacts with a notification
        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('User interacted with notification:', response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, []);

    return children;
};
