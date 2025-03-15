import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity, useWindowDimensions,
} from "react-native";
import { Text, View } from "react-native-ui-lib";
import { Colors, Typographies } from "../constants";
import { useDatabase } from "../hooks";
import { AuthContext } from "../store";
import {KSpacer} from "./KSpacer";
import {useNavigation} from "@react-navigation/native";

interface Participant {
  avatar?: string;
  name?: string;
}

interface KActivityCardProps {
  participants: Participant[];
  onPress?: () => void;
  title: string;
  owner: string;
}

const KActivityCard: React.FC<KActivityCardProps> = ({
  participants,
  onPress,
  title,
    owner
}) => {
  // Default avatar if missing
  const defaultAvatar =
    "https://icons.iconarchive.com/icons/diversity-avatars/avatars/256/batman-icon.png";

  const totalParticipants = participants?.length || 0;
  const displayedParticipants = participants?.slice(0, 4) || [];
  const remainingParticipantsCount =
    totalParticipants > 4 ? totalParticipants - 4 : 0;

  const glowAnimation = useRef(new Animated.Value(0)).current;

  const { getUser } = useDatabase();
  const [username, setUsername] = useState("");
  const {width} = useWindowDimensions()

  useEffect(() => {
    getUser({ id: owner }).then((user) => {
      setUsername(user.name);
    });
  }, []);

  useEffect(() => {
    const pulseGlow = () => {
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]).start(() => pulseGlow());
    };

    pulseGlow();

    return () => {
      glowAnimation.stopAnimation();
    };
  }, []);

  const animatedShadowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.9],
  });

  const animatedBorderColor = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.lightBlue100, Colors.white],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.touchableContainer, {width}]}
    >
      <Animated.View
        style={[
          styles.card,
          {
            shadowOpacity: animatedShadowOpacity,
            borderColor: animatedBorderColor,
          },
        ]}
      >
        <View row gap-4 centerV>
            <Text bodyL semiBold white>
                {username}'s room
            </Text>
            <Text bodyM regular white>
                @ {title}
            </Text>
        </View>
        <KSpacer/>
        <View style={styles.participantsRow}>
          {displayedParticipants.map((id)=>getUser({id})).map((item, index) => (
            <View key={index} style={styles.participantContainer}>
              <Animated.View
                style={[
                  styles.avatarContainer,
                  {
                    shadowOpacity: animatedShadowOpacity,
                  },
                ]}
              >
                <Image
                  source={{ uri: item.avatar || defaultAvatar }}
                  style={styles.avatar}
                  defaultSource={require("../../assets/batman_avatar.png")}
                />
                {index === 0 && (
                  <View style={styles.youIndicator}>
                    <Text style={styles.youIndicatorText}>You</Text>
                  </View>
                )}
              </Animated.View>
            </View>
          ))}

          {remainingParticipantsCount > 0 && (
            <View style={styles.participantContainer}>
              <Animated.View
                style={[
                  styles.moreParticipantsContainer,
                  {
                    shadowOpacity: animatedShadowOpacity,
                  },
                ]}
              >
                <Text style={styles.moreParticipantsText}>
                  +{remainingParticipantsCount}
                </Text>
              </Animated.View>
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    width: "100%",
  },
  card: {
    padding: 15,
    margin: 10,
    borderRadius: 20,
    backgroundColor: Colors.darkBlue,
    flexDirection: "column",
    alignItems: "flex-start",
    borderWidth: 2,
    borderColor: Colors.lightBlue100,

    shadowColor: Colors.lightBlue100,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
  },
  participantsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  participantContainer: {
    alignItems: "center",
    marginRight: 15,
    marginBottom: 10,
  },
  avatarContainer: {
    position: "relative",
    width: 50,
    height: 50,

    shadowColor: Colors.lightBlue100,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.lightBlue100,
    backgroundColor: Colors.grey, // Placeholder color
  },
  youIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  youIndicatorText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  moreParticipantsContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 25,

    shadowColor: Colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 8,
  },
  moreParticipantsText: {
    color: Colors.darkBlue,
    fontWeight: "bold",
  },
});

export default KActivityCard;
