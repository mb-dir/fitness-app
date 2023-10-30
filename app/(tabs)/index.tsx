import { Image, StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fitness App</Text>
      <Text style={styles.title}>Twoje centrum zdrowego życia</Text>
      <Text style={styles.subtitle}>
        Zaplanuj, ćwicz, jedz zdrowo i osiągnij swoje cele!
      </Text>
      <View style={styles.quoteWrapper}>
        <Text style={styles.quote}>
          "Obyś zawsze pamiętał, aby cieszyć się drogą, zwłaszcza gdy jest
          trudna"
        </Text>
        <Text style={styles.author}>Kobe Bryant</Text>
        <Image
          style={styles.photo}
          source={require("../../assets/images/kobe.png")}
        ></Image>
      </View>

      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 36,
    fontStyle: "italic",
    fontFamily: "",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  quoteWrapper: {
    paddingVertical: 18,
    paddingHorizontal: 9,
  },
  quote: {
    fontStyle: "italic",
    color: "white",
    zIndex: 9999,
  },
  author: {
    textAlign: "right",
    color: "white",
    zIndex: 9999,
    fontWeight: "bold",
  },
  photo: {
    width: "120%",
    height: "750%",
    position: "absolute",
    left: "-10%",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
