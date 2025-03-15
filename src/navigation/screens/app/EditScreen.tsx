import { KContainer } from "../../../components";
import { View, Text, Colors } from "react-native-ui-lib";
import { useContext } from "react";
import { ScannerContext } from "../../../store/scanner";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KEdgeSvg } from "../../../components/KEdgeSvg";
import { KSittingInfo } from "../../../components/KSittingInfo";
import { Item } from "../../../constants/types";
import { KInputProduct } from "../../../components/KInputProduct";

export const EditScreen = () => {
  const { scannedObject, setScannedObject } = useContext(ScannerContext);
  const navigation = useNavigation();

  const addNewProduct = () => {
    const newProduct: Item = {
      name: "",
      quantity: 1,
      price: 0,
    };
    if (scannedObject) {
      setScannedObject({
        ...scannedObject,
        items: [...scannedObject.items, newProduct],
      });
    }
  };

  return (
    <KContainer>
      <View paddingH-10 paddingV-5>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
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
        <View marginH-10>
          <KEdgeSvg />
          <View
            style={{
              backgroundColor: "#fff",
              marginTop: -15,
              alignItems: "center",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            <KSittingInfo
              restaurantName={scannedObject?.store || "Unknown Store"}
              date={scannedObject?.date || "Unknown Date"}
              hour={"11:00 AM"}
            />
            <ScrollView
              gap-10
              style={{
                width: "100%",
                maxHeight: "70%",
                paddingHorizontal: 15,
                paddingTop: 10,
              }}
            >
              {scannedObject?.items?.map((item: Item, index: number) => (
                <KInputProduct key={index} item={item} />
              )) || <Text>No scanned items found.</Text>}
            </ScrollView>
            <View>
              <TouchableOpacity style={styles.addBtn} onPress={addNewProduct}>
                <Text style={{ fontSize: 28, color: "white" }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KContainer>
  );
};

const styles = StyleSheet.create({
  addBtn: {
    backgroundColor: Colors.lightBlue,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});
