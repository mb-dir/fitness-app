import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function KCALSettings() {
  const [kcalLimit, setKcalLimit] = useState("");
  const [savedKcalLimit, setSavedKcalLimit] = useState("");

  const saveKcalLimit = async () => {
    try {
      if (kcalLimit !== "") {
        await AsyncStorage.setItem("kcalLimit", kcalLimit);
        setSavedKcalLimit(kcalLimit);
        Alert.alert("Informacja", "Limit kalorii został ustawiony", [
          { text: "OK" },
        ]);
        setKcalLimit("");
      } else {
        Alert.alert("Debilem jesteś", "Ale cymbał xdXd", [{ text: "OK" }]);
      }
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
        [{ text: "OK" }]
      );
    }
  };

  const loadKcalLimit = async () => {
    try {
      const storedKcalLimit = await AsyncStorage.getItem("kcalLimit");
      if (storedKcalLimit !== null) {
        setSavedKcalLimit(storedKcalLimit);
      }
    } catch (error) {
      console.error("Error loading kcal limit:", error);
    }
  };

  useEffect(() => {
    loadKcalLimit();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>Obecnie ustawiony limit kalorii:</Text>
        <Text style={styles.text}>
          {savedKcalLimit ? `${savedKcalLimit} KCAL` : "Brak"}
        </Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Podaj limit kalorii</Text>
        <TextInput
          keyboardType="numeric"
          value={kcalLimit}
          onChangeText={text => setKcalLimit(text)}
          style={styles.input}
        />
        <Button title="Zapisz" onPress={saveKcalLimit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 10,
  },
  text: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 18,
  },
  form: {
    marginTop: -50,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: 200,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
