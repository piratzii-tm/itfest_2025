import { Colors, Text, View } from "react-native-ui-lib";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface KProductProps {
  productName: string;
  productPrice: number;
  productQuantity: number;
}

export const KProduct = ({
  productName,
  productPrice,
  productQuantity,
}: KProductProps) => {
  return (
    <View>
      <View
        row
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <View row style={{ alignItems: "center" }} gap-20>
          <Text bodyL color={"#919191"}>
            {productQuantity}x
          </Text>
          <Text bodyL>{productName}</Text>
        </View>
        <Text bodyL bold>
          ${productPrice}
        </Text>
      </View>
      <View margin-10 row gap-10 style={{ flexWrap: "wrap" }}>
        <Image
          style={styles.profilePic}
          source={{
            uri: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
          }}
        />
        <Image
          style={styles.profilePic}
          source={{
            uri: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
          }}
        />

        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: Colors.lightBlue,
            borderStyle: "dashed",
          }}
        >
          <Text style={{ fontSize: 28, color: Colors.lightBlue }} center>
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "black",
  },
});
