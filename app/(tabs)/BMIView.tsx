import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";

export default function BMIView() {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [bmi, setBMI] = useState<number | null>(null);

  const calculateBMI = (height: string, weight: string) => {
    if (height && weight) {
      const heightMeters = +height / 100;
      const weightKg = +weight;
      const bmiValue = weightKg / (heightMeters * heightMeters);
      setBMI(+bmiValue.toFixed(2));
    }
  };

  // const showBMIExplanation = bmiValue;
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Twój wzrost (cm):</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={text => setHeight(text)}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Twoja waga (kg):</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={text => setWeight(text)}
        keyboardType="numeric"
      />

      <Button
        title="Oblicz swoje BMI"
        onPress={() => calculateBMI(height, weight)}
      />

      {bmi !== null && (
        <Text style={styles.result}>Twój wskaźnik BMI wynosi: {bmi}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: 200,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  result: {
    fontSize: 24,
    marginTop: 20,
  },
});
