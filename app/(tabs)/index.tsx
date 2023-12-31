import { Image, StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fitness App</Text>
      <Text style={styles.title}>Twoje centrum zdrowego życia</Text>
      <Text style={styles.subtitle}>
        Planuj, ćwicz, jedz zdrowo i osiągnij swoje cele!
      </Text>
      <View style={styles.quoteWrapper}>
        <Text style={styles.quote}>
          "Obyś zawsze pamiętał, aby cieszyć się drogą, zwłaszcza gdy jest
          trudna"
        </Text>
        <Text style={styles.author}>~Kobe Bryant</Text>
      </View>
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
    marginVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  quoteWrapper: {
    paddingVertical: 24,
    paddingHorizontal: 9,
  },
  quote: {
    fontStyle: "italic",
    fontSize: 10,
    textAlign: "right",
  },
  author: {
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 10,
  },
});
