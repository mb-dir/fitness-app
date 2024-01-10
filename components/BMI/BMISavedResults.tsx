import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { bmiResult } from "../../types";
import { useIsFocused } from "@react-navigation/native";

export default function BMISavedResults() {
  const [results, setResults] = useState<bmiResult[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchSavedResults = async () => {
      try {
        const savedResults = await AsyncStorage.getItem("bmiResults");
        if (savedResults) {
          setResults(JSON.parse(savedResults));
        }
      } catch (error) {
        Alert.alert(
          "Błąd",
          "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
          [{ text: "OK" }]
        );
        Vibration.vibrate(500);
        console.error("Error fetching saved results: ", error);
      }
    };

    fetchSavedResults();
  }, [isFocused]);

  const deleteResult = async (index: number) => {
    try {
      const updatedResults = [...results];
      updatedResults.splice(index, 1);

      await AsyncStorage.setItem("bmiResults", JSON.stringify(updatedResults));
      setResults(updatedResults);
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
        [{ text: "OK" }]
      );
      Vibration.vibrate(500);
      console.error(error);
    }
  };

  const formatDate = (date: string) => {
    const parts = date.split("/");
    const day = +parts[0];
    const month = +parts[1];
    const year = +parts[2];

    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedDateString = `${formattedDay}/${month}/${year}`;

    return formattedDateString;
  };

  return (
    <FlatList
      data={results}
      keyExtractor={(result, index) => index.toString()}
      ListHeaderComponent={
        <View style={styles.headerItem}>
          <Text style={styles.headerText}>Data</Text>
          <Text style={styles.headerText}>BMI</Text>
          <Text style={styles.headerText}>Akcje</Text>
        </View>
      }
      renderItem={({ item, index }) => (
        <View style={styles.resultItem}>
          <Text>{formatDate(item.date)}</Text>
          <Text style={styles.value}>{item.result}</Text>
          <TouchableOpacity onPress={() => deleteResult(index)}>
            <Text style={styles.deleteButton}>Usuń</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  value: {
    paddingRight: 12,
  },
  deleteButton: {
    fontWeight: "bold",
    color: "red",
    paddingHorizontal: 18,
  },
});
