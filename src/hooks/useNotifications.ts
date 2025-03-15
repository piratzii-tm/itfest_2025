import {
    getExpoPushTokenAsync,
    getPermissionsAsync,
    requestPermissionsAsync
} from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export const useNotifications = () => {
    const requestUserPermission = async () => {
        if (!Device.isDevice) {
            console.warn("Must use physical device for push notifications.");
            return false;
        }

        const {status: existingStatus} = await getPermissionsAsync();


        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const {status} = await requestPermissionsAsync();
            finalStatus = status;
        }

        return finalStatus === 'granted';
    };

    const getExpoPushToken = async () => {
        if (await requestUserPermission()) {
            const {data: token} = await getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId, // Needed for EAS builds
            }).catch(console.log);
            console.log("Expo Push Token:", token);
            return token;
        }
    };

    const sendPushNotification = async (expoPushToken) => {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: 'Hello!',
            body: 'This is a test notification',
            data: {extraData: 'Some extra data'},
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        })
            .then(response => response.json())
            .then(data => console.log('Push Notification Sent:', data))
            .catch(error => console.error('Error sending notification:', error));
    };

    return {requestUserPermission, getExpoPushToken, sendPushNotification};
};
