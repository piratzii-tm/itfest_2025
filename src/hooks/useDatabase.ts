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

      data = {
        timestamp: Date.now(),
        ...data,
      };

      await set(userRef, {
        ...userData,
        notifications: [...existingTokens, data],
      });
    } else {
      console.log("User not found");
    }
  };

    const getFriends = async ({id}: { id: string }) => {
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

    const getUser = async ({id}: { id: string }) => {
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
                membersDistribution: ids.map((id) => ({[id]: ["IGNORE"]})),
                didMembersJoined: ids.map((id) => ({[id]: id === owner})),
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

    const getRoom = async ({id}: { id: string }) => {
        const roomRef = ref(database, Path.rooms + id);
        const snapshot = await get(roomRef);

        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    };

    const getActiveRooms = async ({id}: { id: string }) => {
        const user = await getUser({id});

        if (user) {
            const roomsId = user.rooms;
            const rooms = await Promise.all(
                roomsId.map(async (roomId: string) => {
                    return await getRoom({id: roomId});
                }),
            );
            return rooms.filter((room) => room.active);
        }
    };

    const getNonActiveRooms = async ({id}: { id: string }) => {
        const user = await getUser({id});

        if (user) {
            const roomsId = user.rooms;
            const rooms = await Promise.all(
                roomsId.map(async (roomId: string) => {
                    return await getRoom({id: roomId});
                }),
            );
            return rooms.filter((room) => !room.active);
        }
    };

    const addRoomToUser = async ({id, room}: { id: string; room: string }) => {
        const user = await getUser({id});
        const roomObj = await getRoom({id: room});
        const userRooms = user.rooms || [];
        if (!userRooms.includes(room)) {
            const userRef = ref(database, Path.users + id);
            await set(userRef, {...user, rooms: [...userRooms, room]});
            const roomRef = ref(database, Path.rooms + room);
            await set(roomRef, {
                ...roomObj,
                didMembersJoined: [...roomObj.didMembersJoined, {[id]: true}],
            });
        }
    };

    const addFriends = async ({id, owner}) => {
        const user = await getUser({id})
        const ownerUser = await getUser({id: owner})

        let userFriend = user.friends || []
        let ownerFriend = ownerUser.friends || []

        if (!userFriend.includes(ownerUser.id)) {
            userFriend.push(ownerUser.id)
            return;
        }

        if (!ownerFriend.includes(user.id)) {
            ownerFriend.push(user.id)
        }

        const userRef = ref(database, Path.users + id);
        const ownerRef = ref(database, Path.users + owner);

        await set(userRef, {...user, friends: userFriend})
        await set(ownerRef, {...ownerUser, friends: ownerFriend})


    }

    const handleDistribution = async ({id, roomId, item}: { id: string, roomId: string, item: any }) => {
        // First, get the current room data
        let room = await getRoom({id: roomId});

        // Get all member distributions
        let membersDistribution = room.membersDistribution;

        // Find the specific member's distribution
        let memberDistribution = membersDistribution.find(
            distribution => Object.keys(distribution)[0] === id
        );

        // If member distribution doesn't exist, create it
        if (!memberDistribution) {
            memberDistribution = { [id]: [] };
            membersDistribution.push(memberDistribution);
        }

        // Get user's items
        let userItems = memberDistribution[id];

        // Check if "IGNORE" placeholder exists and remove it
        if (userItems.includes("IGNORE")) {
            userItems = [];
        }

        // Check if the item already exists for the user
        const existingItemIndex = userItems.findIndex(it => it.id === item.id);

        if (existingItemIndex !== -1) {
            // Item exists, increase its quantity
            memberDistribution = {
                [id]: userItems.map(it =>
                    it.id === item.id
                        ? {...it, quantity: (it.quantity || 1) + 1}
                        : it
                )
            };
        } else {
            // Item doesn't exist, add it with quantity 1
            const newItem = {...item};
            newItem.quantity = 1;
            memberDistribution = {
                [id]: [...userItems, newItem]
            };
        }

        // Update the member's distribution in the full distribution array
        membersDistribution = membersDistribution.map(dist => {
            const userKey = Object.keys(dist)[0];
            if (userKey === id) {
                return memberDistribution;
            }
            return dist;
        });

    // Calculate new total price for the user
        const userTotal = memberDistribution[id].reduce((sum, currItem) => {
            return sum + (currItem.price * currItem.quantity);
        }, 0);

        // Update the total value in the room for the user
        if (!room.usersTotal) {
            room.usersTotal = {};
        }
        room.usersTotal[id] = {
            total: userTotal,
            paid: room.usersTotal[id]?.paid || 0,
            owned: room.usersTotal[id]?.owned || 0
        };

        // Update the room with the new distribution
        room.membersDistribution = membersDistribution;

        // Save the changes to Firebase
        const roomRef = ref(database, Path.rooms + roomId);
        await set(roomRef, room);

        console.log("Item added successfully");
    };

    const handleRemoveItem = async ({id, roomId, item}: { id: string, roomId: string, item: any }) => {
        // First, get the current room data
        let room = await getRoom({id: roomId});

        // Get all member distributions
        let membersDistribution = room.membersDistribution;

        // Find the specific member's distribution
        let memberDistribution = room.membersDistribution.find(
            distribution => Object.keys(distribution)[0] === id
        );

        // If member distribution doesn't exist or is empty, nothing to remove
        if (!memberDistribution || !memberDistribution[id]) {
            console.log("No items to remove for this user");
            return;
        }

        // Filter out "IGNORE" placeholder if it exists
        memberDistribution = {
            [id]: (memberDistribution[id].filter(d => d !== "IGNORE") || [])
        };

        // Find the item to remove
        const userItems = memberDistribution[id];
        const itemIndex = userItems.findIndex(it => it.id === item.id);

        // If item not found, nothing to remove
        if (itemIndex === -1) {
            console.log("Item not found in user's distribution");
            return;
        }

        // Check if the item has quantity > 1
        if (userItems[itemIndex].quantity && userItems[itemIndex].quantity > 1) {
            // Decrease quantity by 1
            memberDistribution = {
                [id]: userItems.map(it =>
                    it.id === item.id
                        ? {...it, quantity: it.quantity - 1}
                        : it
                )
            };
        } else {
            // Remove the item completely
            memberDistribution = {
                [id]: userItems.filter(it => it.id !== item.id)
            };

            // If the user has no items after removal, add back the "IGNORE" placeholder
            if (memberDistribution[id].length === 0) {
                memberDistribution = {
                    [id]: ["IGNORE"]
                };
            }
        }

        // Update the member's distribution in the full distribution array
        membersDistribution = membersDistribution.map(dist => {
            const userKey = Object.keys(dist)[0];
            if (userKey === id) {
                return memberDistribution;
            }
            return dist;
        });

    // Recalculate the user's total price
        const userTotal = memberDistribution[id]
            .filter(it => it !== "IGNORE") // Ignore placeholder
            .reduce((sum, currItem) => sum + (currItem.price * (currItem.quantity || 1)), 0);

        // Update the total value in the room for the user
        if (!room.usersTotal) {
            room.usersTotal = {};
        }
        room.usersTotal[id] = {
            total: userTotal,
            paid: room.usersTotal[id]?.paid || 0,
            owned: room.usersTotal[id]?.owned || 0
        };

        // Update the room with the new distribution
        room.membersDistribution = membersDistribution;

        // Save the changes to Firebase
        const roomRef = ref(database, Path.rooms + roomId);
        await set(roomRef, room);

        console.log("Item removed successfully");
    };

  const handleChangePaid = async ({id, roomId, amount}: { id: string, roomId: string, amount: number }) => {
        // Fetch room data
        let room = await getRoom({id: roomId});

        // Ensure usersTotal exists
        if (!room.usersTotal) {
            room.usersTotal = {};
        }

        // Get user's financial data or default values
        let userTotalData = room.usersTotal[id] || {total: 0, paid: 0, owned: 0};

        // Update paid amount
        userTotalData.paid = amount;

        // If paid exceeds total, adjust owned
        if (userTotalData.paid > userTotalData.total) {
            console.log(userTotalData.total - userTotalData.paid)
            userTotalData.owned = userTotalData.total - userTotalData.paid;
        }

        // Save updated data back to room
        room.usersTotal[id] = userTotalData;

        // Update Firebase
        const roomRef = ref(database, Path.rooms + roomId);
        await set(roomRef, room);

        console.log("Paid amount updated successfully");
    };

    const handleChangeOwned = async ({id, roomId, amount}: { id: string, roomId: string, amount: number }) => {
        // Fetch room data
        let room = await getRoom({id: roomId});

        // Ensure usersTotal exists
        if (!room.usersTotal) {
            room.usersTotal = {};
        }

        // Get user's financial data or default values
        let userTotalData = room.usersTotal[id] || {total: 0, paid: 0, owned: 0};

        // Ensure the deduction amount is valid
        if (amount > Math.abs(userTotalData.owned)) {
            console.log(amount, userTotalData.owned)
            alert("The amount to deduct is greater than the current owed value.");
            return;
        }

        // Deduct the amount from owned
        userTotalData.owned += amount;

        // Save updated data back to room
        room.usersTotal[id] = userTotalData;

        // Update Firebase
        const roomRef = ref(database, Path.rooms + roomId);
        await set(roomRef, room);

        console.log("Owned amount updated successfully");
    };

    const handleComplete = async ({id, roomId}: { id: string, roomId: string }) => {
        let room = await getRoom({id: roomId});

        if (!room.usersTotal) {
            room.usersTotal = {};
        }

        let userTotalData = room.usersTotal[id] || {total: 0, paid: 0, owned: 0};

        userTotalData.owned = 0;
        userTotalData.paid = userTotalData.total;

        room.usersTotal[id] = userTotalData;

        const roomRef = ref(database, Path.rooms + roomId);
        await set(roomRef, room);

        console.log("Owned amount updated successfully");
    };

    const sendPaymentNotification = async (
        receiverId: string,
        senderId: string,
        amount: number,
    ) => {
        const sender = await getUser({id: senderId});
        const receiver = await getUser({id: receiverId});

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
        const sender = await getUser({id: senderId});
        const receiver = await getUser({id: receiverId});

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
        const user = await getUser({id: userId});
        if (user && user.notifications) {
            return user.notifications.sort(
                (a: any, b: any) => b.timestamp - a.timestamp,
            );
        }
        return [];
    };

    const closeRoom = async ({id}: { id: number }) => {
        const roomRef = ref(database, Path.rooms + id)
        const snap = await get(roomRef)

        if (snap.exists()) {
            const value = snap.val()
            value.active = false
            set(roomRef, value)
        }
    }

    const getRoomTotal = async ({
                                    roomId,
                                }: {
        roomId: string;
    }): Promise<number> => {
        const room = await getRoom({ id: roomId });

        if (
            !room ||
            !room.membersDistribution ||
            !Array.isArray(room.membersDistribution)
        ) {
            return 0;
        }

        let total: number = 0;

        for (const memberObj of room.membersDistribution) {
            const userId = Object.keys(memberObj)[0];
            const memberItems = memberObj[userId];

            if (Array.isArray(memberItems) && memberItems[0] === "IGNORE") {
                continue;
            }

            // Calculate this member's total
            const memberTotal = memberItems.reduce(
                (sum, item) => sum + item.price * (item.quantity || 1),
                0,
            );

            total += memberTotal;
        }

        return total;
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
        handleDistribution,
        handleRemoveItem,
        addFriends, sendPaymentNotification,
        sendAddedToRoomNotification,
        getNotifications,
        getNonActiveRooms,
        handleChangePaid,
        handleChangeOwned,
        handleComplete,
        closeRoom,
        getRoomTotal,

    };
};
