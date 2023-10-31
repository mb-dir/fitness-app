import {
  Alert,
  Button,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

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
  const [workouts, setWorkouts] = useState<any[]>([]);
  const isFocused = useIsFocused();

  const stateReset = () => {
    setWorkout("");
    setReps("");
  };

  const getWorkouts = async () => {
    try {
      const existingWorkouts = await AsyncStorage.getItem(day);
      if (existingWorkouts) {
        setWorkouts(JSON.parse(existingWorkouts));
      }
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
        [{ text: "OK" }]
      );
    }
  };

  const addWorkout = async () => {
    const newWorkout = { workout, reps };
    try {
      const existingWorkouts = await AsyncStorage.getItem(day);
      const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];
      workouts.push(newWorkout);
      setWorkouts(workouts);
      await AsyncStorage.setItem(day, JSON.stringify(workouts));
      stateReset();
      Keyboard.dismiss();
      Alert.alert("Informacja", "Ćwiczenie zostało zapisane", [{ text: "OK" }]);
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
        [{ text: "OK" }]
      );
    }
  };

  useEffect(() => {
    getWorkouts();
  }, [isFocused]);

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
