import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Meal } from "../../types";
import { useIsFocused } from "@react-navigation/native";

export default function CurrentKCAL() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [savedKcalLimit, setSavedKcalLimit] = useState("");
  const isFocused = useIsFocused();

  const calculateTotalAmount = (meal: Meal): number => {
    const totalAmount = meal.components.reduce((sum, component) => {
      const componentAmount = component.kcal;
      return isNaN(componentAmount) ? sum : sum + componentAmount;
    }, 0);

    return totalAmount;
  };

  const calculateTotalAmountForMeals = (meals: Meal[]): number => {
    const totalAmountForAllMeals = meals.reduce((total, meal) => {
      const mealTotalAmount = calculateTotalAmount(meal);
      return total + mealTotalAmount;
    }, 0);

    return totalAmountForAllMeals;
  };

  const todayMeals = meals.filter(meal => {
    const mealDate = new Date(
      meal.timestamp.year,
      meal.timestamp.month - 1,
      meal.timestamp.day
    );
    const today = new Date();

    return (
      mealDate.getDate() === today.getDate() &&
      mealDate.getMonth() === today.getMonth() &&
      mealDate.getFullYear() === today.getFullYear()
    );
  });

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem("meals");
        if (storedMeals) {
          const parsedMeals: Meal[] = JSON.parse(storedMeals);
          setMeals(parsedMeals);
        }
      } catch (error) {
        Alert.alert(
          "Błąd",
          "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
          [{ text: "OK" }]
        );
        console.error("Error loading meals:", error);
      }
    };
    const loadKcalLimit = async () => {
      try {
        const storedKcalLimit = await AsyncStorage.getItem("kcalLimit");
        if (storedKcalLimit !== null) {
          setSavedKcalLimit(storedKcalLimit);
        }
      } catch (error) {
        Alert.alert(
          "Błąd",
          "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
          [{ text: "OK" }]
        );
        console.error("Error loading kcal limit:", error);
      }
    };

    loadKcalLimit();
    loadMeals();
  }, [isFocused]);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Twoje dzisiejsze kalorie:</Text>
        <Text style={styles.headerText}>
          {calculateTotalAmountForMeals(todayMeals)}/{savedKcalLimit}
        </Text>
      </View>
      <FlatList
        data={todayMeals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.mealContainer}>
            <Text style={styles.mealName}>{item.name}</Text>
            <View style={styles.componentContainer}>
              {item.components.map((component, index) => (
                <View
                  key={`${index}${component.name}${item.name}`}
                  style={styles.componentItem}
                >
                  <Text>
                    {component.name} - {component.amount}g({component.kcal}kcal)
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  mealContainer: {
    marginBottom: 20,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  componentContainer: {
    flexDirection: "column",
  },
  componentItem: {
    flexDirection: "row",
    marginBottom: 5,
  },
});
