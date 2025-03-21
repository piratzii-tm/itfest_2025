import React, {useContext, useState} from "react";
import {StyleSheet, TextInput} from "react-native";
import {Text, View} from "react-native-ui-lib";
import {RectButton, Swipeable} from "react-native-gesture-handler";
import {Item} from "../constants/types";
import {Colors} from "../constants";
import {ScannerContext} from "../store/scanner";

export const KInputProduct = ({
                                  item,
                                  onDelete,
                              }: {
    item: Item;
    onDelete: () => void;
}) => {
    const [quantity, setQuantity] = useState(item.quantity.toString());
    const [name, setName] = useState(item.name.toString());
    const [price, setPrice] = useState(item.price.toString());
    const {scannedObject, setScannedObject} = useContext(ScannerContext);

    const renderRightActions = () => (
        <RectButton style={styles.deleteButton} onPress={onDelete}>
            <Text white bold>
                Delete
            </Text>
        </RectButton>
    );

    const saveProductInfo = (id: number) => {
        const updatedItem: Item = {
            id,
            name,
            quantity: parseInt(quantity),
            price: parseInt(price),
        };

        setScannedObject((prevState) => {
            if (!prevState || prevState.items.length === 0) return prevState;

            const updatedItems = prevState.items.map((item) =>
                item.id === id ? updatedItem : item,
            );

            const newTotal = updatedItems.reduce((sum, item) =>
                sum + (item.quantity * item.price), 0);

            console.log("New total:", newTotal);

            return {
                ...prevState,
                items: updatedItems,
                total: newTotal,
            };
        });
    };

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <View margin-2>
                <View
                    row
                    style={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingBottom: 20,
                    }}
                >
                    <View row style={{alignItems: "center", width: "70%"}} gap-5>
                        <View
                            row
                            style={{justifyContent: "center", alignItems: "center"}}
                            gap-2
                        >
                            <TextInput
                                value={quantity}
                                style={styles.quantityInput}
                                keyboardType={"numeric"}
                                onChangeText={(quant) => setQuantity(quant)}
                                onBlur={() => saveProductInfo(item.id)}
                            />
                            <Text color={Colors.grey} bodyL>
                                x
                            </Text>
                        </View>
                        <View marginH-10 style={{width: "70%"}}>
                            <TextInput
                                value={name}
                                style={styles.nameInput}
                                onChangeText={(name) => setName(name)}
                                onBlur={() => saveProductInfo(item.id)}
                            />
                        </View>
                    </View>
                    <View
                        row
                        gap-4
                        style={{
                            width: "30%",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text bodyL bold>
                            RON
                        </Text>
                        <TextInput
                            value={price}
                            style={styles.priceInput}
                            keyboardType={"numeric"}
                            onChangeText={(price) => setPrice(price)}
                            onBlur={() => saveProductInfo(item.id)}
                        />
                    </View>
                </View>
            </View>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    quantityInput: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        padding: 5,
        color: Colors.grey,
        fontSize: 16,
    },
    nameInput: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        fontSize: 16,
    },
    priceInput: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        fontSize: 16,
        flexGrow: 1,
    },
    priceContainer: {
        width: "30%",
        justifyContent: "space-between",
        alignItems: "center",
    },

    deleteButton: {
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 30,
        marginVertical: 3,
        borderRadius: 8,
    },
});
