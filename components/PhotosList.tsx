import {
StyleSheet,
Text,
View,
} from "react-native";

export default function PhotosList() {

  return (
    <View style={styles.container}>
      <Text>PhotosList</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
