import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Meal } from "./AddKCAL";
import { useIsFocused } from "@react-navigation/native";

export default function KCALHistory() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const isFocused = useIsFocused();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const historyMeals = meals.filter(meal => {
    const mealDate = new Date(
      meal.timestamp.year,
      meal.timestamp.month - 1,
      meal.timestamp.day
    );
    const now = new Date();
    return (
      mealDate.getDate() !== now.getDate() ||
      mealDate.getMonth() !== now.getMonth() ||
      mealDate.getFullYear() !== now.getFullYear()
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
    loadMeals();
  }, [isFocused]);

  const groupedMeals = groupMealsByDate(historyMeals);

  const handleDatePress = (date: string) => {
    setSelectedDate(selectedDate === date ? null : date);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Historia posiłków:</Text>
      <FlatList
        data={groupedMeals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.dateContainer}>
            <TouchableOpacity onPress={() => handleDatePress(item.date)}>
              <Text style={styles.dateText}>{item.date}</Text>
            </TouchableOpacity>
            {selectedDate === item.date && (
              <View>
                {item.meals.map((meal, index) => (
                  <View
                    key={`${index}${meal.name}${item.date}`}
                    style={styles.mealContainer}
                  >
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <View style={styles.componentContainer}>
                      {meal.components.map((component, index) => (
                        <View
                          key={`${index}${component.name}${meal.name}`}
                          style={styles.componentItem}
                        >
                          <Text>
                            {component.name} - {component.amount}g(
                            {component.kcal}
                            kcal)
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

// Function to group meals by date
const groupMealsByDate = (meals: Meal[]): { date: string; meals: Meal[] }[] => {
  const groupedMeals: { [date: string]: Meal[] } = {};

  meals.forEach(meal => {
    const mealDate = `${meal.timestamp.day}/${meal.timestamp.month}/${meal.timestamp.year}`;
    if (!groupedMeals[mealDate]) {
      groupedMeals[mealDate] = [];
    }
    groupedMeals[mealDate].push(meal);
  });

  return Object.entries(groupedMeals)
    .map(([date, meals]) => ({
      date,
      meals,
    }))
    .reverse();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 35,
    textAlign: "center",
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  mealContainer: {
    marginBottom: 10,
    paddingHorizontal: 15,
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
