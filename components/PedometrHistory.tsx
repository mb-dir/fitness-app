import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PedometrHistory() {
  const [stepsHistory, setStepsHistory] = useState<any[]>([]);

  const getStepsHistory = async () => {
    try {
      const stepsHistoryString = await AsyncStorage.getItem("stepsHistory");
      if (stepsHistoryString !== null) {
        const parsedStepsHistory = JSON.parse(stepsHistoryString);
        setStepsHistory(parsedStepsHistory);
      }
    } catch (error) {
      console.error("Error getting steps history:", error);
    }
  };

  useEffect(() => {
    getStepsHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Historia(odświeżana każdego dnia o północy)
      </Text>
      {stepsHistory.map((entry, index) => (
        <View key={index} style={styles.entry}>
          <Text>Data: {entry.date}</Text>
          <Text>Ilość kroków: {entry.result}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  entry: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
});
