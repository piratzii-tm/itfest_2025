import React, { useContext, useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native-ui-lib";
import {
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions, Share,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { KContainer } from "../../../components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faQrcode,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { useDatabase } from "../../../hooks";
import { AuthContext } from "../../../store";
import { Colors } from "../../../constants";
import { useNavigation } from "@react-navigation/native";
import { ScannerContext } from "../../../store/scanner";

export const AddFriendsScreen = () => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [friends, setFriends] = useState([]);

  const { bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { getFriends, createRoom } = useDatabase();
  const { uid } = useContext(AuthContext);
  const { scannedObject } = useContext(ScannerContext);
  const { goBack, navigate } = useNavigation();

  useEffect(() => {
    getFriends({ id: uid }).then((response) => {
      if (response) {
        setFriends(response.filter((res) => res));
      }
      console.log(response);
    });
  }, [uid]);

  const toggleSelection = (friend) => {
    if (selectedFriends.some((f) => f.id === friend.id)) {
      setSelectedFriends(selectedFriends.filter((f) => f.id !== friend.id));
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const deleteAll = () => setSelectedFriends([]);

  const filteredFriends = useMemo(
    () =>
      friends.filter((friend) =>
        friend.name.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [friends],
  );

  const handleCreateRoom = () => {
    createRoom({
      owner: uid,
      ids: selectedFriends.map((friend) => friend.id).concat([uid]),
      bill: scannedObject,
      tokens: selectedFriends.map((friend) => friend.pushTokens),
    }).then((room)=>navigate("RoomScreen", {fromFlow: true, room}));
  };


  return (
    <KContainer>
      <View row spread width={width} paddingH-10 centerV>
        <TouchableOpacity
          onPress={goBack}
          style={{
            backgroundColor: "white",
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
          }}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={20}
            color={Colors.lightBlue}
          />
        </TouchableOpacity>
        <Text bodyXL center semiBold>
          Who’s Joining The Split
        </Text>

      </View>
      <View style={{ padding: 10 }}>
        <FlatList
          horizontal
          data={selectedFriends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.avatar, { backgroundColor: "#3F51B5" }]}>
              <Text style={styles.avatarText}>{item.name[0]}</Text>
            </View>
          )}
          contentContainerStyle={{ minHeight: 40, gap: 10 }}
          style={{
            flexShrink: 1,
          }}
        />
      </View>

      {friends.length > 0 ? (
        <>
          <TextInput
            style={styles.searchBar}
            placeholder="Search friends to split the bill..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <FlatList
            data={filteredFriends}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.friendItem}
                onPress={() => toggleSelection(item)}
              >
                <View style={[styles.avatar, { backgroundColor: "#3F51B5" }]}>
                  <Text style={styles.avatarText}>{item.name[0]}</Text>
                </View>
                <Text style={styles.friendName}>{item.name}</Text>
                <Icon
                  name={
                    selectedFriends.some((f) => f.id === item.id)
                      ? "check-circle"
                      : "radio-button-unchecked"
                  }
                  size={24}
                  color={
                    selectedFriends.some((f) => f.id === item.id)
                      ? "#3F51B5"
                      : "#BDBDBD"
                  }
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 10,
            }}
          />
        </>
      ) : (
        <View flex center>
          <Text bodyL semiBold center style={{ paddingHorizontal: 20 }}>
            Add your friends by sharing this room or creating a QR.
          </Text>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          paddingBottom: bottom,
        }}
      >
        <TouchableOpacity style={styles.deleteButton} onPress={deleteAll}>
          <Text style={styles.buttonText}>Delete All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#3F51B5",
            padding: 10,
            borderRadius: 10,
            flex: 1,
            alignItems: "center",
            marginLeft: 5,
          }}
          onPress={handleCreateRoom}
        >
          <Text style={styles.buttonText}>{selectedFriends.length === 0 ? "Skip" : "Add Friends"}</Text>
        </TouchableOpacity>
      </View>
    </KContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  avatarText: { color: "#fff", fontWeight: "bold" },
  searchBar: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  friendName: { flex: 1, marginLeft: 10, fontSize: 16 },
  deleteButton: {
    backgroundColor: "#FF5252",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
