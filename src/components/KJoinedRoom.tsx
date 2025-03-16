import React from "react";
import { Text } from "react-native-ui-lib";
import { View, Image } from "react-native";
import {Colors} from "../constants";

export const KJoinedRoom: React.FC<{ image: string; roomName: string }> = ({ image, roomName }) => {
    return (
        <View style={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            width: 120,
            height: 120,
        }}>
            <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%", borderRadius: 10}}
            />
            <View style={{backgroundColor:Colors.lightBlue, opacity:0.5, width:120, height:120, position:'absolute',borderRadius:10}}/>
            <View style={{position:'absolute', alignItems:'center',justifyContent:'center', width:120, height:120, borderRadius:10}}>
                <Text bodyXL semiBold style={{ color:"white"}}>{roomName}</Text>
            </View>
        </View>
    );
};