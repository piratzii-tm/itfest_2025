import {database, firestore} from "../constants";
import {ref, set, get} from "firebase/database";
import {addDoc, collection} from "firebase/firestore";
import {NotificationType, useNotifications} from "./useNotifications";
import {red} from "react-native-reanimated/lib/typescript/Colors";

const Path = {
    users: "users/",
    rooms: "rooms/",
};

export const useDatabase = () => {
    const {sendPushNotification} = useNotifications();

    const initUser = ({
                          id,
                          name,
                          phone,
                      }: {
        id: string;
        name: string;
        phone;
    }) => {
        const userRef = ref(database, Path.users + id);
        set(userRef, {id, name, phone, friends: ["IGNORE"]})
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

    const getFriends = async ({id}: { id: string }) => {
        const userRef = ref(database, Path.users + id);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const friends = snapshot.val().friends;

            return Promise.all(
                friends.map(async (friendId) => {
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

            console.log("Room created successfully!");
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
    }

    const getActiveRooms = async ({id}: { id: string }) => {
        const user = await getUser({id})

        if (user) {
            const roomsId = user.rooms;
            const rooms = await Promise.all(
                roomsId.map(async (roomId) => {
                    return await getRoom({id: roomId})
                })
            )
            return rooms.filter(room => room.active)
        }

    }

    const addRoomToUser = async ({id, room}: { id: string, room: string }) => {
        const user = await getUser({id})
        const roomObj = await getRoom({id: room})
        const userRooms = user.rooms || []
        if (!userRooms.includes(room)) {
            const userRef = ref(database, Path.users + id);
            await set(userRef, {...user, rooms: [...userRooms, room]})
            const roomRef = ref(database, Path.rooms + room)
            await set(roomRef, {...roomObj, didMembersJoined: [...roomObj.didMembersJoined, {[id]: true}]})
        }
    }

    return {
        initUser,
        registerPushToken,
        handleNewNotification,
        getFriends,
        createRoom,
        getUser,
        getActiveRooms,
        getRoom,
        addRoomToUser
    };
};
