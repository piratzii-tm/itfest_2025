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
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const EditScreen = () => {
  const { scannedObject, setScannedObject } = useContext(ScannerContext);
  const navigation = useNavigation();

  const addNewProduct = () => {
    const newId = scannedObject?.items.length
      ? scannedObject.items[scannedObject.items.length - 1].id + 1
      : 0;

    const newProduct: Item = {
      id: newId,
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

  const handleDeleteItem = (id: number) => {
    setScannedObject((prevState: RecipetData) => {
      if (!prevState || !prevState.items) return prevState;

      const updatedItems = prevState.items.filter(
        (item: Item) => item.id !== id,
      );

      return {
        ...prevState,
        items: updatedItems,
      };
    });
  };

  return (
    <KContainer>
      <View paddingH-10 paddingV-5>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={20}
            color={Colors.lightBlue}
          />
        </TouchableOpacity>

        <View
          marginH-10
          style={{ maxHeight: "65%", justifyContent: "space-between" }}
        >
          <KEdgeSvg />
          <View style={styles.contentContainer}>
            <KSittingInfo
              restaurantName={scannedObject?.store || "Unknown Store"}
              date={scannedObject?.date || "Unknown Date"}
              hour={"11:00 AM"}
            />

            <ScrollView style={styles.scrollView}>
              {scannedObject!.items?.length > 0 ? (
                scannedObject!.items.map((item: Item) => (
                  <KInputProduct
                    key={item.id}
                    item={item}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))
              ) : (
                <Text>No scanned items found.</Text>
              )}
            </ScrollView>
            <View
              row
              style={{
                justifyContent: "space-between",
                width: "100%",
                paddingHorizontal: 15,
                marginVertical: 15,
              }}
            >
              <Text bodyXL>Total:</Text>
              <Text bodyXL>RON {scannedObject?.total}</Text>
            </View>
          </View>
          <View
            style={{ width: "100%", alignItems: "center", marginVertical: 15 }}
          >
            <TouchableOpacity style={styles.addBtn} onPress={addNewProduct}>
              <FontAwesomeIcon icon={faPlus} size={25} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.goToSelectFriends}
            onPress={() => console.log(scannedObject)}
          >
            <Text bodyL white bold>
              Add Friends
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KContainer>
  );
};

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "white",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  contentContainer: {
    backgroundColor: "#fff",
    marginTop: -15,
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  scrollView: {
    width: "100%",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  addBtn: {
    backgroundColor: Colors.lightBlue,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  goToSelectFriends: {
    backgroundColor: Colors.lightBlue,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    alignSelf: "flex-end",
  },
});
