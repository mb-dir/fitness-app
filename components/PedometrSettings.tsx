import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

export default function PedometrSettings() {
  const [stepGoal, setStepGoal] = useState("");
  const [savedStepGoal, setSavedStepGoal] = useState<string | null>(null);
  const isFocused = useIsFocused();

  const saveStepGoal = async () => {
    try {
      await AsyncStorage.setItem("stepGoal", stepGoal);
      setSavedStepGoal(stepGoal);
      setStepGoal("");
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
        [{ text: "OK" }]
      );
      console.error("Error saving step goal:", error);
    }
  };

  const loadStepGoal = async () => {
    try {
      const goal = await AsyncStorage.getItem("stepGoal");
      if (goal) {
        setSavedStepGoal(goal);
      }
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
        [{ text: "OK" }]
      );
      console.error("Error loading step goal:", error);
    }
  };

  useEffect(() => {
    loadStepGoal();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ustal cel:</Text>
      <TextInput
        style={styles.input}
        value={stepGoal}
        onChangeText={text => setStepGoal(text)}
        keyboardType="numeric"
      />
      <Button title="Zapisz cel" onPress={saveStepGoal} />
      {savedStepGoal !== null && (
        <View style={styles.savedGoalContainer}>
          <Text style={styles.savedGoalText}>
            Twój cel kroków: {savedStepGoal}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  savedGoalContainer: {
    marginTop: 20,
  },
  savedGoalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
