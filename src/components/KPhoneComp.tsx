import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { auth, Colors, database } from "../constants";
import { Text } from "react-native-ui-lib";
import { useWindowDimensions } from "react-native";
import { get, ref } from "firebase/database";
import { useNotifications } from "../hooks/useNotifications";
import { useDatabase } from "../hooks";

export const KPhoneComp = () => {
  const [phone, setPhone] = useState("");
  const { width } = useWindowDimensions();
  const { sendPushNotification } = useNotifications();
  const { getUser } = useDatabase();

  const isValidRomanianPhone = (number: string) => {
    const romanianPhoneRegex = /^(?:\+40|0)(2\d{8}|3\d{8}|7\d{8})$/;
    return romanianPhoneRegex.test(number);
  };

  const isAlreadyFriend = async (friendId: string) => {
    const userId = auth.currentUser?.uid;

    if (userId) {
      const userRef = ref(database, `users/${userId}/friends`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const friends = snapshot.val();
        if (friends) {
          for (const id of friends) {
            if (id === friendId) {
              alert("User already a friend");
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const isNumberInDb = async () => {
    const dbRef = ref(database, "users");

    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const users = snapshot.val();
        const user: any = Object.values(users).find(
          (user: any) => user.phone === phone,
        );

        const isFriend = await isAlreadyFriend(user.id);
        if (isFriend) {
          return;
        }

        if (user) {
          return Object.values(user.pushTokens);
        }
      }
    } catch (error) {
      console.error("Error checking phone number:", error);
    }

    return [];
  };

  const handleAddFriend = async () => {
    if (!isValidRomanianPhone(phone) || phone.length !== 12) {
      alert("Invalid Romanian phone number! Please enter a valid one.");
      return;
    }

    const friendTokens: any[] = await isNumberInDb();
    if (friendTokens.length === 0) {
      alert("User does not exist in the database!");
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const userInfo = await getUser({ id: user.uid });
      for (const token of friendTokens) {
        await sendPushNotification({
          expoPushToken: token,
          data: { inviteId: user.uid, inviterName: userInfo.name },
          type: "newFriend",
        });
      }
      alert(`Success: Friend with number ${phone} added!`);
    }
    setPhone("");
  };

  return (
    <View
      style={{
        padding: 20,
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        alignSelf: "center",
        width: width - 20,
      }}
    >
      <View style={{ width: "100%" }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "left",
          }}
          lightBlue
        >
          Add New Friend
        </Text>
      </View>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          width: "100%",
          textAlign: "center",
          marginBottom: 10,
        }}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity
        onPress={handleAddFriend}
        disabled={!phone}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: phone ? Colors.lightBlue : Colors.lightGrey2,
          padding: 12,
          borderRadius: 10,
          width: "100%",
          justifyContent: "center",
        }}
      >
        <FontAwesomeIcon
          icon={faUserPlus}
          size={20}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text semiBold bodyL white>
          Send request
        </Text>
      </TouchableOpacity>
    </View>
  );
};
