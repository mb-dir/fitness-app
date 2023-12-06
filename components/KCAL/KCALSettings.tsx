import {
  Alert,
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
        Keyboard.dismiss();
      } else {
        Alert.alert("Debilem jesteś", "Ale cymbał xdXd", [{ text: "OK" }]);
      }
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
        [{ text: "OK" }]
      );
      console.error(error);
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
      Alert.alert(
        "Błąd",
        "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
        [{ text: "OK" }]
      );
    }
  };

  useEffect(() => {
    loadKcalLimit();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Podaj limit kalorii</Text>
        <TextInput
          keyboardType="numeric"
          value={kcalLimit}
          onChangeText={text => setKcalLimit(text)}
          style={styles.input}
        />
        <Button title="Zapisz" onPress={saveKcalLimit} />
      </View>

      <View>
        <Text style={styles.text}>Obecnie ustawiony limit kalorii:</Text>
        <Text style={styles.text}>
          {savedKcalLimit ? `${savedKcalLimit} KCAL` : "Brak"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    marginTop: 5,
    fontSize: 18,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    height: 30,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
