import {Text, View} from "react-native-ui-lib";
import {StyleSheet, TouchableOpacity} from "react-native";
import {useDatabase} from "../hooks";
import {useEffect, useState} from "react";
import {Colors} from "../constants";

interface KProductProps {
    userId: string;
    roomId: string;
    item: any;
    distribution: any[];
}

export const KProduct = ({
                             userId,
                             roomId,
                             item,
                             distribution
                         }: KProductProps) => {
    const [members, setMembers] = useState([]);
    const {handleDistribution, getUser, handleRemoveItem} = useDatabase();

    useEffect(() => {
        const updateMembers = async () => {
            if (!distribution || !item) return;

            try {
                const ids = distribution
                    .map(user => {
                        const userKey = Object.keys(user)[0];
                        const userItems = user[userKey];

                        // Skip if the user items array is empty or just contains "IGNORE"
                        if (!userItems || userItems.length === 0 ||
                            (userItems.length === 1 && userItems[0] === "IGNORE")) {
                            return null;
                        }

                        // Check if this user has this specific item
                        const hasItem = userItems.some(it =>
                            it && typeof it === 'object' && it.id === item.id
                        );

                        return hasItem ? userKey : null;
                    })
                    .filter(id => id !== null);

                const memberNames = await Promise.all(
                    ids.map(async id => id && getUser({id}).then(r => r.name))
                );

                setMembers(memberNames);
            } catch (error) {
                console.error("Error updating members:", error);
            }
        };

        updateMembers();
    }, [distribution, item, roomId]);

    const handleAddMe = () => {
        if (members.includes(userId)) {

        } else {
            handleDistribution({roomId, id: userId, item});
        }
    };

    return (
        <View>
            <View
                row
                style={{justifyContent: "space-between", alignItems: "center"}}
            >
                <View row style={{alignItems: "center"}} gap-20>
                    <Text bodyL color={"#919191"}>
                        {item.quantity} x
                    </Text>
                    <Text bodyL>{item.name}</Text>
                </View>
                <Text bodyL bold>
                    ${item.price}
                </Text>
            </View>
            <View margin-10 row gap-10 style={{flexWrap: "wrap"}}>
                {
                    members.map((member, index) => (
                        <TouchableOpacity onPress={() => handleRemoveItem({roomId, id: userId, item})}>
                            <View
                                key={`member-${index}`}
                                style={styles.profilePic}
                                source={{
                                    uri: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
                                }}
                            >
                                <Text white bold>{member[0]}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                }
                {members.length < item.quantity && (
                    <TouchableOpacity
                        onPress={handleAddMe}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: "white",
                            borderWidth: 2,
                            borderColor: Colors.lightBlue,
                            borderStyle: "dashed",
                        }}
                    >
                        <Text style={{fontSize: 28, color: Colors.lightBlue}} center>
                            +
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.lightBlue,
        alignItems: "center",
        justifyContent: "center"
    },
});