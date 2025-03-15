import React from "react";
import {View, Image, ImageSourcePropType, useWindowDimensions} from "react-native";
import { Colors, Text } from "react-native-ui-lib";

interface KNotificationProps {
    title?: string;
    description?: string;
    time?: string;
    image?: ImageSourcePropType;
}

function KNotification({ title, description, time, image }: KNotificationProps) {
    const {width}= useWindowDimensions();

    return (
        <View style={{width, alignItems:"center"}}>
            <View style={{
                backgroundColor: Colors.white,
                borderColor:Colors.grey,
                padding: 12,
                borderRadius: 10,
                width: width * 0.95,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
            }}>
                {image && (
                    <Image
                        source={{ uri: "https://play-lh.googleusercontent.com/Ife0Lgs7ZBZTu5He68SLlYF-HuCgXp661SQuRMV5P-h3NlYygGTgFCOiLgcZjFfjqFrj" }}
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: 100,
                            marginRight: 12,
                        }}
                    />
                )}

                {}
                <View style={{ flex: 1}}>
                    <View style={{flexDirection:"column", gap:1}}>
                    <Text darkBlue bold body>
                        {title || "Notification"}
                    </Text>
                    <View>
                        {description && (
                            <Text darkNavy bodyM marginT-4>
                                {description}
                            </Text>
                        )}
                    </View>
                    </View>
                    <View style={{marginTop:8}}>
                        {time && (
                            <Text grey style={{ fontSize: 13, marginTop: 6 }}>
                                {time}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}

export default KNotification;

