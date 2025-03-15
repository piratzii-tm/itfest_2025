import { Text, View } from "react-native-ui-lib";
import { StyleSheet, TextInput } from "react-native";
import { Item } from "../constants/types";
import { Colors } from "../constants";
import { useState } from "react";

export const KInputProduct = ({ item }: { item: Item }) => {
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [name, setName] = useState(item.name.toString());
  const [price, setPrice] = useState(item.price.toString());

  return (
    <View width={"100%"}>
      <View
        row
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 20,
        }}
      >
        <View row style={{ alignItems: "center", width: "70%" }} gap-5>
          <View
            row
            style={{ justifyContent: "center", alignItems: "center" }}
            gap-2
          >
            <TextInput
              value={quantity}
              style={styles.quantityInput}
              keyboardType={"numeric"}
              onChangeText={(quant) => setQuantity(quant)}
            />
            <Text color={Colors.grey} bodyL>
              x
            </Text>
          </View>
          <View marginH-10 style={{ width: "70%" }}>
            <TextInput
              value={name}
              style={styles.nameInput}
              onChangeText={(name) => setName(name)}
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
          />
        </View>
      </View>
    </View>
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
});
