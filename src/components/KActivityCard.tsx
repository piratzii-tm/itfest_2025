import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Colors, Typographies } from "../constants";

interface Participant {
  avatar: string;
  name?: string;
}

interface KActivityCardProps {
  adminName: string;
  participants: Participant[];
  onPress?: () => void; // Added onPress handler
}

const KActivityCard: React.FC<KActivityCardProps> = ({
  adminName,
  participants,
  onPress,
}) => {
  const totalParticipants = participants.length;
  const displayedParticipants = participants.slice(0, 4);
  const remainingParticipantsCount =
    totalParticipants > 4 ? totalParticipants - 4 : 0;

  // Animation values for glowing effect
  const glowAnimation = useRef(new Animated.Value(0)).current;

  // Create pulsating animation
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

  // Dynamic glow properties
  const animatedShadowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.9],
  });

  const animatedShadowRadius = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 15],
  });

  const animatedBorderColor = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.lightBlue100, Colors.white],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.touchableContainer}
    >
      <Animated.View
        style={[
          styles.card,
          {
            shadowOpacity: animatedShadowOpacity,
            shadowRadius: animatedShadowRadius,
            borderColor: animatedBorderColor,
          },
        ]}
      >
        <Text style={styles.adminName}>{adminName}'s room</Text>
        <View style={styles.participantsRow}>
          {displayedParticipants.map((item, index) => (
            <View key={index} style={styles.participantContainer}>
              <Animated.View
                style={[
                  styles.avatarContainer,
                  {
                    shadowOpacity: animatedShadowOpacity,
                  },
                ]}
              >
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
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
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.lightBlue100,

    // Enhanced shadow for glow effect
    shadowColor: Colors.lightBlue100,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
  },
  adminName: {
    ...Typographies.bodyL,
    color: Colors.white,
    marginBottom: 15,
  },
  participantsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  participantContainer: {
    alignItems: "center",
    marginRight: 15,
  },
  avatarContainer: {
    position: "relative",
    width: 50,
    height: 50,

    // Glow effect for avatars
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

    // Glow effect for "more" indicator
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
