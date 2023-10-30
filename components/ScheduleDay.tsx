import { Button, StyleSheet, Text, TextInput, View } from "react-native";

import { useState } from "react";

export enum DAY_OF_WEEK {
  Sunday = "Niedziela",
  Monday = "Poniedziałek",
  Tuesday = "Wtorek",
  Wednesday = "Środa",
  Thursday = "Czwartek",
  Friday = "Piątek",
  Saturday = "Sobota",
}

type props = {
  day: DAY_OF_WEEK;
};

export default function ScheduleTrainingView({ day }: props) {
  const [workout, setWorkout] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dodaj ćwiczenie</Text>
      <Text style={styles.label}>Nazwa:</Text>
      <TextInput
        style={styles.input}
        value={workout}
        onChangeText={text => setWorkout(text)}
      />

      <Text style={styles.label}>Ilość powtórzeń:</Text>
      <TextInput
        style={styles.input}
        value={reps}
        onChangeText={text => setReps(text)}
        keyboardType="numeric"
      />

      <Button
        title="Dodaj ćwiczenie"
        // onPress={() => calculateBMI(height, weight)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
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
});
