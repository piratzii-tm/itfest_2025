import React, { useState } from "react";
import { View, TextInput,TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import {Colors} from "../constants";
import { Text } from "react-native-ui-lib";
import { useWindowDimensions } from "react-native";

export const KPhoneComp = () =>  {
    const [phone, setPhone] = useState("");
    const { width } = useWindowDimensions();

    const handleAddFriend = () => {
        alert(`Success: Friend with number ${phone} added!`);
        setPhone("");
    };
    return (
        <View style={{ padding: 20, alignItems: "center", backgroundColor: "white", borderRadius: 15, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, alignSelf: "center",   width: width - 20}}>
            <TextInput
                style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, width: "100%", textAlign: "center", marginBottom: 10 }}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />
            <TouchableOpacity
                onPress={handleAddFriend}
                disabled={!phone}
                style={{ flexDirection: "row", alignItems: "center", backgroundColor: phone ? Colors.lightBlue : Colors.lightGrey2, padding: 12, borderRadius: 10, width: '100%', justifyContent:'center' }}
            >
                <FontAwesomeIcon icon={faUserPlus} size={20} color="white" style={{ marginRight: 8 }} />
                <Text semiBold bodyL white>Send request</Text>
            </TouchableOpacity>
        </View>
    );
}
