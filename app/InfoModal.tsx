import { StyleSheet, Text, View } from "react-native";

export default function InfoModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.content}>
        BMI (Body Mass Index) to wskaźnik, który służy do oceny masy ciała w
        stosunku do wzrostu. Oblicza się go dzieląc masę ciała (w kilogramach)
        przez kwadrat wzrostu (w metrach). Wartość BMI pozwala na określenie,
        czy osoba ma prawidłową masę ciała, nadwagę, otyłość lub niedowagę.
        Interpretacja BMI jest następująca:
      </Text>
      <Text style={styles.listItem}>BMI poniżej 18,5 - niedowaga.</Text>
      <Text style={styles.listItem}>
        BMI między 18,5 a 24,9 - prawidłowa masa ciała.
      </Text>
      <Text style={styles.listItem}>BMI między 25 a 29,9 - nadwaga.</Text>
      <Text style={styles.listItem}>BMI 30 i wyżej - otyłość.</Text>
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
  content: {
    fontSize: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: "justify",
  },
  listItem: {
    textAlign: "left",
    width: "100%",
    fontSize: 20,
    paddingHorizontal: 24,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
