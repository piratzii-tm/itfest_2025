import { useContext, useEffect  } from "react";
import * as Notifications from "expo-notifications";
import { useNotifications } from "../hooks/useNotifications";
import { useDatabase } from "../hooks";
import { AuthContext } from "../store";
import Toast from "react-native-toast-message";

export const WithNotifications = ({ children }) => {
  const { requestUserPermission, getExpoPushToken } = useNotifications();
  const { registerPushToken, handleNewNotification } = useDatabase();
  const { uid } = useContext(AuthContext);

  const showToast = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    Toast.show({
      type: "success",
      text1: title,
      text2: description,
    });
  };

  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await requestUserPermission();
      if (hasPermission) {
        const token = await getExpoPushToken();
        if (uid.length !== 0) {
          await registerPushToken({ id: uid, pushToken: token });
        }
      }
    };

    setupNotifications();
  }, [uid]);

  useEffect(() => {
    // Handle notifications when received while app is in the foreground
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(
          "Foreground notification received:",
          notification.request.content,
        );
        const { title, body: description, data } = notification.request.content;
        if (title && description) {
          showToast({
            description,
            title,
          });
          handleNewNotification({
            id: uid,
            data: {
              title,
              description,
              data,
            },
          });
        }
      },
    );

    // Handle when user interacts with a notification
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "User interacted with notification:",
          response.notification.request.content,
        );
        const {
          title,
          body: description,
          data,
        } = response.notification.request.content;
        // TODO If got roomId go to the room page
        // TODO Else go to notifications page
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [showToast, uid]);

  return children;
};
