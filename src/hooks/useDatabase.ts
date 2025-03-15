import {database} from "../constants";
import {ref, set, get, update} from "firebase/database";

const Path = {
    users: "users/",
    rooms: "rooms/"
}

export const useDatabase = () => {

    const initUser = ({id, name, phone}: { id: string, name: string, phone }) => {
        const userRef = ref(database, Path.users + id);
        set(userRef, {id, name, phone, friends: ["IGNORE"]}).then(
            () => console.log('User data added successfully!')
        ).catch(
            (error) => console.log('Error adding data: ', error)
        )
    }

    const registerPushToken = async ({id, pushToken}: { id: string, pushToken: string }) => {
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
    }

    const handleNewNotification = async ({id, data}: { id: string, data: any }) => {
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
    }

    return {
        initUser,
        registerPushToken,
        handleNewNotification
    }

}