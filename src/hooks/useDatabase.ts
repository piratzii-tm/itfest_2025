import {database} from "../constants";
import {ref, set} from "firebase/database";

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

    return {
        initUser
    }

}