import { database, firestore } from "../constants";
import { ref, set, get } from "firebase/database";
import { addDoc, collection } from "firebase/firestore";
import { NotificationType, useNotifications } from "./useNotifications";
import { red } from "react-native-reanimated/lib/typescript/Colors";

const Path = {
  users: "users/",
  rooms: "rooms/",
  notifications: "notifications/",
};

export const useDatabase = () => {
  const { sendPushNotification } = useNotifications();

  const initUser = ({
    id,
    name,
    phone,
  }: {
    id: string;
    name: string;
    phone: string;
  }) => {
    const userRef = ref(database, Path.users + id);
    set(userRef, { id, name, phone, friends: ["IGNORE"] })
      .then(() => console.log("User data added successfully!"))
      .catch((error) => console.log("Error adding data: ", error));
  };

  const registerPushToken = async ({
    id,
    pushToken,
  }: {
    id: string;
    pushToken: string;
  }) => {
    const userRef = ref(database, Path.users + id);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const existingTokens = userData.pushTokens || [];

      // Avoid duplicate tokens
      if (!existingTokens.includes(pushToken)) {
        await set(userRef, {
          ...userData,
          pushTokens: [...existingTokens, pushToken],
        });
      }
    } else {
      console.log("User not found");
    }
  };

  const handleNewNotification = async ({
    id,
    data,
  }: {
    id: string;
    data: any;
  }) => {
    const userRef = ref(database, Path.users + id);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const existingTokens = userData.notifications || [];

      await set(userRef, {
        ...userData,
        notifications: [...existingTokens, data],
      });
    } else {
      console.log("User not found");
    }
  };

  const getFriends = async ({ id }: { id: string }) => {
    const userRef = ref(database, Path.users + id);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const friends = snapshot.val().friends;

      return Promise.all(
        friends.map(async (friendId: string) => {
          const friendRef = ref(database, Path.users + friendId);
          const friendSnapshot = await get(friendRef);
          if (friendSnapshot.exists()) {
            return {
              id: friendSnapshot.val().id,
              name: friendSnapshot.val().name,
              pushTokens: friendSnapshot.val().pushTokens,
            };
          }
        }),
      );
    }

    return;
  };

  const getUser = async ({ id }: { id: string }) => {
    const userRef = ref(database, Path.users + id);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  };

  const createRoom = async ({
    owner,
    ids,
    bill,
    tokens,
  }: {
    owner: string;
    ids: string[];
    bill: any;
    tokens: [string[]];
  }) => {
    try {
      const roomRefFirestore = await addDoc(collection(firestore, "rooms"), {});

      const roomId = roomRefFirestore.id;

      const roomRef = ref(database, Path.rooms + roomId);

      set(roomRef, {
        id: roomId,
        owner,
        membersIds: ids,
        bill,
        membersDistribution: ids.map((id) => ({ [id]: ["IGNORE"] })),
        didMembersJoined: ids.map((id) => ({ [id]: id === owner })),
        createdAt: new Date(),
        active: true,
      }).then(async () => {
        const userRef = ref(database, Path.users + owner);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const val = snapshot.val();

          tokens.forEach((pushTokens) => {
            pushTokens.forEach((token) =>
              sendPushNotification({
                expoPushToken: token,
                data: {
                  roomId,
                  inviterId: owner,
                  inviterName: val.name,
                },
                type: NotificationType.roomInvite,
              }),
            );
          });

          const userRooms = val.rooms || [];
          await set(userRef, {
            ...val,
            rooms: [...userRooms, roomId],
          });
        }
      });

      return roomId;
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const getRoom = async ({ id }: { id: string }) => {
    const roomRef = ref(database, Path.rooms + id);
    const snapshot = await get(roomRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  };

  const getActiveRooms = async ({ id }: { id: string }) => {
    const user = await getUser({ id });

    if (user) {
      const roomsId = user.rooms;
      const rooms = await Promise.all(
        roomsId.map(async (roomId: string) => {
          return await getRoom({ id: roomId });
        }),
      );
      return rooms.filter((room) => room.active);
    }
  };

  const addRoomToUser = async ({ id, room }: { id: string; room: string }) => {
    const user = await getUser({ id });
    const roomObj = await getRoom({ id: room });
    const userRooms = user.rooms || [];
    if (!userRooms.includes(room)) {
      const userRef = ref(database, Path.users + id);
      await set(userRef, { ...user, rooms: [...userRooms, room] });
      const roomRef = ref(database, Path.rooms + room);
      await set(roomRef, {
        ...roomObj,
        didMembersJoined: [...roomObj.didMembersJoined, { [id]: true }],
      });
    }
  };

  const sendPaymentNotification = async (
    receiverId: string,
    senderId: string,
    amount: number,
  ) => {
    const sender = await getUser({ id: senderId });
    const receiver = await getUser({ id: receiverId });

    if (!sender || !receiver) {
      console.log("Sender or receiver not found");
      return false;
    }

    const notificationContent = {
      amount: amount,
      inviterId: senderId,
      inviterName: sender.name,
    };

    const notificationData = {
      receiverID: receiverId,
      title: "Debts are no good",
      body:
        `Hello there, you still need to pay ${sender.name} their` +
        ` ${amount} RON.`,
      type: NotificationType.giveMoney,
      timestamp: Date.now(),
      content: notificationContent,
    };

    await handleNewNotification({
      id: receiverId,
      data: notificationData,
    });

    if (receiver.pushTokens?.length) {
      receiver.pushTokens.forEach((token: string) => {
        sendPushNotification({
          expoPushToken: token,
          data: notificationContent,
          type: NotificationType.giveMoney,
        });
      });
      return true;
    }

    return false;
  };

  const sendAddedToRoomNotification = async (
    receiverId: string,
    senderId: string,
    roomID: string,
  ) => {
    const sender = await getUser({ id: senderId });
    const receiver = await getUser({ id: receiverId });

    if (!sender || !receiver) {
      console.log("Sender or receiver not found");
      return false;
    }

    const notificationContent = {
      inviterId: senderId,
      inviterName: sender.name,
      roomID: roomID,
    };

    const notificationData = {
      receiverID: receiverId,
      title: "You've been added to a room",
      body: `Hello there, ${sender.name} has added you to a new room`,
      type: NotificationType.roomInvite,
      timestamp: Date.now(),
      content: notificationContent,
    };

    await handleNewNotification({
      id: receiverId,
      data: notificationData,
    });

    if (receiver.pushTokens?.length) {
      receiver.pushTokens.forEach((token: string) => {
        sendPushNotification({
          expoPushToken: token,
          data: notificationContent,
          type: NotificationType.roomInvite,
        });
      });
      return true;
    }

    return false;
  };

  const getNotifications = async (userId: string) => {
    const user = await getUser({ id: userId });
    if (user && user.notifications) {
      return user.notifications.sort(
        (a: any, b: any) => b.timestamp - a.timestamp,
      );
    }
    return [];
  };

  return {
    initUser,
    registerPushToken,
    handleNewNotification,
    getFriends,
    createRoom,
    getUser,
    getActiveRooms,
    getRoom,
    addRoomToUser,
    sendPaymentNotification,
    sendAddedToRoomNotification,
    getNotifications,
  };
};
