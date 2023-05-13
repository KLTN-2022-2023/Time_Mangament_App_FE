import { Text, View } from "native-base";
import { StyleSheet } from "react-native";
import Color from "../../Style/Color";

export default ({ message }) => {
  return (
    <View style={styles.Root}>
      <Text style={styles.Text}> {message || "No data"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  Root: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  Text: {
    fontWeight: "500",
    fontSize: 20,
    color: Color.Input().disable,
  },
});
