import {KContainer, KSpacer} from "../../../components";
import {View, Text} from "react-native-ui-lib";
import {KEdgeSvg} from "../../../components/KEdgeSvg";
import {KSittingInfo} from "../../../components/KSittingInfo";
import {TextInput, TouchableOpacity, useWindowDimensions} from "react-native";
import {Colors, database} from "../../../constants";
import {useNavigation} from "@react-navigation/native";
import {useContext, useEffect, useState} from "react";
import {ref, onValue, get} from "firebase/database";
import {AuthContext} from "../../../store";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft, faGears} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Modal from "react-native-modal";
import {useDatabase} from "../../../hooks";
import {NotificationType, useNotifications} from "../../../hooks/useNotifications";

export const RecapScreen = ({route}) => {
    const {roomId, fromHome} = route.params;
    const {reset} = useNavigation();
    const [roomData, setRoomData] = useState(null);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const {uid} = useContext(AuthContext);
    const [selectedFriend, setSelectedFriend] = useState<any | null>(null)
    const [ownedEdit, setOwnedEdit] = useState<number>(0)
    const [paidEdit, setPaidEdit] = useState<number>(0)
    const [total, setTotal] = useState<number>(0)
    const [alreadyPaid, setAlreadyPaid] = useState<number>(0)

    const navigation = useNavigation();

    const {handleChangePaid, handleChangeOwned, handleComplete, getUser} = useDatabase()
    const {sendPushNotification} = useNotifications()

    useEffect(() => {
        // Get room data from realtime database
        const roomRef = ref(database, `rooms/${roomId}`);

        const unsubscribe = onValue(
            roomRef,
            async (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setRoomData(data);

                    // Check if membersDistribution exists
                    if (data.membersDistribution && Array.isArray(data.membersDistribution)) {
                        const userPromises = data.membersDistribution.flatMap(async (memberObj) => {
                                const userId = Object.keys(memberObj)[0];
                                const memberValue = memberObj[userId];

                                console.log(memberValue);

                                if (Array.isArray(memberValue) && memberValue[0] === "IGNORE") {
                                    return [];
                                }

                                const userRef = ref(database, `users/${userId}`);
                                const userSnapshot = await get(userRef);
                                const userData = userSnapshot.exists()
                                    ? userSnapshot.val()
                                    : {name: "Unknown User"};

                                // Get paid & owned values from usersTotal
                                const userTotal = data.usersTotal?.[userId] || {paid: 0, owned: 0};

                                return [{
                                    id: userId,
                                    name: userData.name || "Unknown User",
                                    items: memberValue,
                                    paid: userTotal.paid,
                                    owned: userTotal.owned
                                },
                                ];
                            },
                        );

                        const resolvedUsersArrays = await Promise.all(userPromises);
                        const resolvedUsers = resolvedUsersArrays.flat();
                        setUserData(resolvedUsers);
                    }

                    setLoading(false);
                } else {
                    console.log("Room not found");
                    setLoading(false);
                }
            },
            (error) => {
                console.error("Error fetching room data:", error);
                setLoading(false);
            },
        );

        return () => unsubscribe();
    }, [roomId]);

    console.log(roomId)

    const calculateTotal = (items) =>
        items.reduce((a, b) => a + b.price * b.quantity, 0);

    if (loading) {
        return (
            <KContainer>
                <View flex center>
                    <Text bodyL>Loading...</Text>
                </View>
            </KContainer>
        );
    }

    return (
        <KContainer>
            <View marginH-10>
                <View width={"100%"} center row>
                    <View width={"15%"}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack();
                            }}
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
                    </View>
                    <View flexG center>
                        <Text bodyXL bold>
                            Recap
                        </Text>
                    </View>
                    <View width={"15%"}/>
                </View>
                <KEdgeSvg/>
                <View
                    style={{
                        backgroundColor: "#fff",
                        marginTop: -15,
                        alignItems: "center",
                        paddingBottom: 20,
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                    }}
                >
                    <KSittingInfo
                        restaurantName={roomData?.bill.store || "Store Name"}
                        date={moment(roomData?.date).format("MMM Do YY") || "Unknown Date"}
                        hour={roomData?.hour || "4:20 AM"}
                    />
                    <View style={{width: "100%", paddingHorizontal: 20}}>
                        {userData.length > 0 ? (
                            userData.map((friend) => (
                                <TouchableOpacity
                                    disabled={(friend.id === roomData.owner)}
                                    key={friend.id}
                                    style={{
                                        maxHeight: "65%",
                                        marginVertical: 5,
                                        gap: 10,
                                    }}
                                    onPress={() => {
                                        setSelectedFriend(friend)
                                        setIsVisible(true)
                                        setTotal(calculateTotal(friend.items))
                                        setAlreadyPaid(friend.paid)
                                    }}
                                >
                                    <View row width={"100%"}>
                                        <View width={"70%"} row gap-10>
                                            <Text bodyXL bold>
                                                {friend.name}
                                            </Text>
                                            {
                                                (friend.id !== roomData.owner) && <View>
                                                    <FontAwesomeIcon
                                                        icon={faGears}
                                                        size={30}
                                                        color={Colors.lightBlue}
                                                    />
                                                </View>
                                            }
                                        </View>
                                        <View flexG>
                                            <Text bodyXL bold>
                                                RON {calculateTotal(friend.items)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{alignItems: "center"}}>
                                        {friend.items.length > 0 ? (
                                            friend.items.map((item) => (
                                                <View
                                                    key={item.id}
                                                    width={"80%"}
                                                    style={{
                                                        justifyContent: "center",
                                                        marginVertical: 1,
                                                    }}
                                                > <View
                                                    row
                                                    style={{
                                                        justifyContent: "space-between",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <View width={"80%"}>
                                                        <Text bodyL>
                                                            {item.quantity} x {item.name}:
                                                        </Text>
                                                    </View>
                                                    <View flexG>
                                                        <Text bodyL>RON {item.price}</Text>
                                                    </View>
                                                </View>
                                                </View>
                                            ))
                                        ) : (
                                            <Text bodyL>No items found for this user.</Text>
                                        )}
                                    </View>
                                    {
                                        (friend?.id !== roomData.owner) && <>
                                            <KSpacer/>
                                            <View marginV-5 row spread>
                                                <Text bodyL semiBold>
                                                    Paid: <Text regular
                                                                color={"#A0C878"}>RON {friend.paid.toFixed(2)}</Text>
                                                </Text>
                                                <Text bodyL semiBold>
                                                    Owned: <Text regular
                                                                 color={"#BF3131"}>RON {friend.owned.toFixed(2)}</Text>
                                                </Text>
                                            </View></>
                                    }

                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text>No users found.</Text>
                        )}
                    </View>
                </View>
                <View
                    backgroundColor={Colors.lightBlue}
                    marginV-10
                    paddingV-12
                    center
                    style={{borderRadius: 10}}
                    width={"100%"}
                >
                    <Text bodyL bold white>
                        Total:{" "}
                        {userData
                            .reduce(
                                (totalSum, user) => totalSum + calculateTotal(user.items),
                                0,
                            )
                            .toFixed(2)}{" "}
                        RON
                    </Text>
                </View>
                {!fromHome && roomData.owner === uid && (
                    <TouchableOpacity
                        style={{
                            borderRadius: 10,
                            backgroundColor: "#fff",
                            alignItems: "center",
                            paddingVertical: 12,
                        }}
                        onPress={() => {
                            reset({
                                index: 0,
                                routes: [{name: "Tabs"}],
                            });
                        }}
                    >
                        <Text bodyL bold color={Colors.lightBlue}>
                            End Room
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <Modal isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
                <View
                    style={{
                        position: "absolute",
                        bottom: 20,
                        alignItems: "center",
                        backgroundColor: "#fff",
                        borderRadius: 12,
                        padding: 15,
                        gap: 15,
                    }}
                >
                    <View width={"100%"}>
                        <TouchableOpacity
                            disabled={(total - alreadyPaid) === 0}
                            onPress={async () => {
                                console.log(selectedFriend.id)
                                getUser({id:uid}).then(currentUser => getUser({id:selectedFriend.id}).then((fullFriend) => fullFriend.pushTokens.forEach(token => {
                                    console.log(token)
                                    sendPushNotification({
                                        expoPushToken: token,
                                        data: {
                                            amount: total - alreadyPaid,
                                            inviterId: uid,
                                            inviterName: currentUser.name
                                        },
                                        type: NotificationType.giveMoney
                                    })
                                })))

                            }}
                            style={{
                                backgroundColor:(total - alreadyPaid) === 0 ?  Colors.grey:Colors.lightBlue,
                                paddingVertical: 10,
                                borderRadius: 10,
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text bodyL bold white>
                                Notify Friend
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View width={"100%"} row style={{justifyContent: "space-around"}}>
                        <TextInput
                            style={{
                                width: "18%",
                                color: "#000",
                                backgroundColor: "#fff",
                                borderRadius: 10,
                                padding: 5,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.22,
                                shadowRadius: 2.22,

                                elevation: 3,
                            }}
                            keyboardType={"numeric"}
                            placeholder={"0.00"}
                            placeholderTextColor={"#bbb"}
                            onChangeText={(text) => setOwnedEdit(parse(text))}
                        />
                        <TouchableOpacity
                            onPress={() => handleChangeOwned({
                                id: selectedFriend.id,
                                roomId: roomId,
                                amount: ownedEdit
                            })}
                            style={{
                                backgroundColor: "#FF6961",
                                paddingVertical: 10,
                                borderRadius: 10,
                                width: "78%",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text bodyL white bold>
                                Give Back
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View width={"100%"} row style={{justifyContent: "space-around"}}>
                        <TextInput
                            style={{
                                width: "18%",
                                color: "#000",
                                backgroundColor: "#fff",
                                borderRadius: 10,
                                padding: 5,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.22,
                                shadowRadius: 2.22,

                                elevation: 3,
                            }}
                            keyboardType={"numeric"}
                            placeholder={"0.00"}
                            placeholderTextColor={"#bbb"}
                            onChangeText={(text) => setPaidEdit(parseFloat(text))}

                        />
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#e8b757",
                                paddingVertical: 10,
                                borderRadius: 10,
                                width: "78%",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => handleChangePaid({id: selectedFriend.id, roomId: roomId, amount: paidEdit})}

                        >
                            <Text bodyL white bold>
                                Received
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View width={"100%"}>
                        <TouchableOpacity
                            onPress={() => {
                                handleComplete({id: selectedFriend.id, roomId: roomId})
                            }}
                            style={{
                                backgroundColor: "#77DD77",
                                paddingVertical: 10,
                                borderRadius: 10,
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text bodyL bold white>
                                Full Payment
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KContainer>
    );
};
