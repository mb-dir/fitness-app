import {
  Alert,
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

export type bmiResult = {
  result: number;
  date: string;
};

export default function BMICalculator() {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [bmi, setBMI] = useState<number | null>(null);

  const calculateBMI = (height: string, weight: string) => {
    if (height && weight) {
      const heightMeters = +height / 100;
      const weightKg = +weight;
      const bmiValue = weightKg / (heightMeters * heightMeters);
      setBMI(+bmiValue.toFixed(2));
      Keyboard.dismiss();
    } else {
      setBMI(null);
    }
  };

  const saveResult = async (result: number) => {
    try {
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      const date = `${day}/${month}/${year}`;

      const resultObj: bmiResult = { result, date };

      const existingResults =
        (await AsyncStorage.getItem("bmiResults")) || "[]";
      const results = JSON.parse(existingResults);

      results.push(resultObj);

      await AsyncStorage.setItem("bmiResults", JSON.stringify(results));

      setHeight("");
      setWeight("");
      setBMI(null);
      Alert.alert("Informacja", "Twój wynik został zapisany", [{ text: "OK" }]);
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
        [{ text: "OK" }]
      );
    }
  };

  const showBMIExplanation = (bmiValue: number) => {
    if (bmiValue < 18.5) {
      return "Twój wskaźnik BMI wskazuje na niedowage.";
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      return "Twój wskaźnik BMI jest prawidłowy.";
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
      return "Twój wskaźnik BMI wskazuje na nadwage.";
    } else {
      return "Twój wskaźnik BMI wskazuje na otyłość";
    }
  };
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

      {bmi ? (
        <>
          <Text style={styles.result}>Twój wskaźnik BMI wynosi: {bmi}</Text>
          <Text style={styles.info}>{showBMIExplanation(bmi)}</Text>
          <Button title="Zapisz wynik" onPress={() => saveResult(bmi)} />
        </>
      ) : (
        <Text style={styles.info}>Uzupełnij dane, aby obliczyć swoje BMI</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
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
    textAlign: "center",
  },
  info: {
    fontSize: 18,
    margin: 20,
  },
});
