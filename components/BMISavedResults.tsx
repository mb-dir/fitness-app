import { FlatList, StyleSheet, Text, View } from "react-native";
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

  return (
    <FlatList
      data={results}
      keyExtractor={(result, index) => index.toString()}
      ListHeaderComponent={
        <View style={styles.headerItem}>
          <Text style={styles.headerText}>Data</Text>
          <Text style={styles.headerText}>BMI</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.resultItem}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          <View style={styles.bmiContainer}>
            <Text style={styles.bmiText}>{item.result}</Text>
          </View>
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
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  dateContainer: {
    flex: 1,
  },
  bmiContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
  },
  bmiText: {
    fontSize: 16,
    textAlign: "right",
  },
});
