import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
} from "react-native";
import { Text } from "react-native-ui-lib";
import { auth, Colors, database, Typographies } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPenToSquare,
  faCheck,
  faTimes,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useCamera, useDatabase } from "../hooks";
import { AuthContext } from "../store";
import { ref, update } from "firebase/database";

interface KProfileHeaderProps {
  onAvatarPress?: () => void;
}

const KProfileHeader = ({ onAvatarPress }: KProfileHeaderProps) => {
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(username);
  const borderAnim = new Animated.Value(1);
  const { getUser } = useDatabase();
  const { uid } = useContext(AuthContext);
  const { photo } = useCamera();

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!uid) return;

      try {
        const user = await getUser({ id: uid });

        if (user?.name) {
          setUsername(user.name);
          setInputValue(user.name);
        } else {
          console.log("User name is missing, setting default.");
          setUsername("Guest");
          setInputValue("Guest");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [uid]);

  const handleEditPress = () => {
    setIsEditing(true);
    setInputValue(username);
    Animated.timing(borderAnim, {
      toValue: 2,
      duration: 500,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleConfirm = async (newName: string) => {
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is logged in.");
      return;
    }

    const userRef = ref(database, `users/${user.uid}`);

    try {
      await update(userRef, { name: newName });
      setUsername(newName);
      setIsEditing(false);
      console.log("Name updated successfully!");
    } catch (error) {
      console.error("Error updating name:", error);
    }
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleCancel = () => {
    setInputValue(username);
    setIsEditing(false);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.headerCard}>
      <TouchableOpacity
        style={styles.buttonAvatar}
        onPress={() => {
          if (onAvatarPress) onAvatarPress();
        }}
        activeOpacity={0.7}
      >
        <Image source={{ uri: photo }} style={styles.avatarImage} />
        <View style={styles.avatarOverlay}>
          <FontAwesomeIcon icon={faPlus} size={16} color={Colors.white} />
        </View>
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.welcomeText} >Welcome back,</Text>
        <Animated.View
          style={[
            styles.nameEditContainer,
            isEditing && styles.nameEditContainerActive,
            {
              borderWidth: borderAnim.interpolate({
                inputRange: [1, 2],
                outputRange: [1.5, 2.5],
              }),
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            style={styles.userNameInput}
            value={inputValue}
            onChangeText={setInputValue}
            editable={isEditing}
            selectTextOnFocus={isEditing}
            placeholder="Enter your name"
            placeholderTextColor={Colors.grey}
          />
          {isEditing ? (
            <View style={styles.editButtonsContainer}>
              <TouchableOpacity
                style={styles.editActionButton}
                onPress={() => handleConfirm(inputValue)}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  size={18}
                  color={Colors.darkBlue}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editActionButton}
                onPress={handleCancel}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  size={18}
                  color={Colors.darkBlue}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.editIcon} onPress={handleEditPress}>
              <FontAwesomeIcon
                icon={faPenToSquare}
                size={18}
                color={Colors.darkerBlue}
              />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginHorizontal: 10,
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: Colors.darkGray,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonAvatar: {
    position: "relative",
    width: 70,
    height: 70,
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: Colors.lightBlue100,
  },
  avatarOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.darkBlue,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  textContainer: {
    marginLeft: 15,
    flexDirection: "column",
    flex: 1,
  },
  welcomeText: {
    ...Typographies.bodyL,
    color: Colors.lightBlue100,
  },
  nameEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    backgroundColor: Colors.white90,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: Colors.lightBlue100,
  },
  nameEditContainerActive: {
    borderColor: Colors.darkBlue,
    backgroundColor: Colors.white,
  },
  userNameInput: {
    ...Typographies.bodyXL,
    ...Typographies.medium,
    flex: 1,
    color: Colors.darkerBlue,
    paddingVertical: 8,
  },
  editIcon: {
    padding: 12,
  },
  editButtonsContainer: {
    flexDirection: "row",
  },
  editActionButton: {
    padding: 10,
    marginLeft: 5,
    borderRadius: 8,
    backgroundColor: Colors.white90,
  },
});

export default KProfileHeader;
