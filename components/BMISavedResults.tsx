import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

export default function BMISavedResults() {
  const [results, setResults] = useState<any>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchSavedResults() {
      try {
        const savedResults = await AsyncStorage.getItem("bmiResults");
        if (savedResults) {
          setResults(JSON.parse(savedResults));
        }
      } catch (error) {
        console.error("Error fetching saved results: ", error);
      }
    }

    fetchSavedResults();
  }, [isFocused]);

  const deleteResult = async (index: number) => {
    try {
      const updatedResults = [...results];
      updatedResults.splice(index, 1);

      await AsyncStorage.setItem("bmiResults", JSON.stringify(updatedResults));
      setResults(updatedResults);
    } catch (error) {
      console.error("Error deleting result: ", error);
    }
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
          <Text>{item.date}</Text>
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
