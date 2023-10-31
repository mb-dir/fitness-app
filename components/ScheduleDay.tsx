import {
  Alert,
  Button,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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

type workout = {
  workout: string;
  reps: string;
};

export default function ScheduleTrainingView({ day }: props) {
  const [workout, setWorkout] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [workouts, setWorkouts] = useState<workout[]>([]);
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
    if (!workout || !reps) {
      Alert.alert("Błąd", "Musisz wprowadzić wszystkie dane");
      return;
    }
    const newWorkout: workout = { workout, reps };
    try {
      const existingWorkouts = await AsyncStorage.getItem(day);
      const workouts: workout[] = existingWorkouts
        ? JSON.parse(existingWorkouts)
        : [];
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

  const deleteWorkout = async (index: number) => {
    try {
      const existingWorkouts = await AsyncStorage.getItem(day);
      if (existingWorkouts) {
        const parsedWorkouts: workout[] = JSON.parse(existingWorkouts);
        parsedWorkouts.splice(index, 1);
        setWorkouts(parsedWorkouts);
        await AsyncStorage.setItem(day, JSON.stringify(parsedWorkouts));
      }
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

      <Text style={styles.label}>Serie/powtórzenia:</Text>
      <TextInput
        style={styles.input}
        value={reps}
        onChangeText={text => setReps(text)}
      />

      <Button title="Dodaj ćwiczenie" onPress={addWorkout} />

      <Text style={styles.header}>Twoje ćwiczenia:</Text>
      <FlatList
        style={styles.flatList}
        data={workouts}
        keyExtractor={(result, index) => index.toString()}
        ListHeaderComponent={
          <View style={styles.headerItem}>
            <Text style={styles.headerText}>Ćwiczenie</Text>
            <Text style={styles.headerText}>Serie/powtórzenia</Text>
            <Text style={styles.headerText}>Akcje</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.resultItem}>
            <Text style={styles.workoutName}>{item.workout}</Text>
            <Text style={styles.reps}>{item.reps}</Text>
            <TouchableOpacity onPress={() => deleteWorkout(index)}>
              <Text style={styles.deleteButton}>Usuń</Text>
            </TouchableOpacity>
          </View>
        )}
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
  flatList: {
    width: "100%",
  },
  workoutName: {
    width: "33%",
  },
  headerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerText: {
    fontSize: 16,
    padding: 12,
    fontWeight: "bold",
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  reps: {
    paddingRight: 12,
  },
  deleteButton: {
    fontWeight: "bold",
    color: "red",
  },
});
