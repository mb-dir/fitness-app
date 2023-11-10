import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

export interface Meal {
  name: string;
  components: MealComponent[];
  timestamp: {
    day: number;
    month: number;
    year: number;
    hour: number;
  };
}

interface MealComponent {
  name: string;
  amount: string;
}

export default function AddKCAL() {
  const [mealName, setMealName] = useState("");
  const [componentName, setComponentName] = useState("");
  const [componentAmount, setComponentAmount] = useState("");
  const [mealComponents, setMealComponents] = useState<MealComponent[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const isFocused = useIsFocused();

  const addComponent = () => {
    if (componentName && componentAmount) {
      setMealComponents(prev => [
        ...prev,
        { name: componentName, amount: componentAmount },
      ]);
      setComponentName("");
      setComponentAmount("");
    } else {
      Alert.alert("Błąd", "Uzupełnij dane", [{ text: "OK" }]);
    }
  };

  const saveMeal = async () => {
    try {
      if (mealName && mealComponents.length > 0) {
        const now = new Date();
        const meal: Meal = {
          name: mealName,
          components: mealComponents,
          timestamp: {
            day: now.getDate(),
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            hour: now.getHours(),
          },
        };

        setMeals(prev => [...prev, meal]);

        // Save the updated array of meals to AsyncStorage
        await AsyncStorage.setItem("meals", JSON.stringify([...meals, meal]));
        setMealName("");
        setComponentAmount("");
        setComponentName("");
        setMealComponents([]);
        Alert.alert("Informacja", "Posiłek został dodany", [{ text: "OK" }]);
      } else {
        Alert.alert("Błąd", "Uzupełnij dane", [{ text: "OK" }]);
      }
    } catch (error) {
      console.error("Error saving meal:", error);
    }
  };

  const deleteComponent = (index: number) => {
    const updatedComponents = mealComponents.slice();
    updatedComponents.splice(index, 1);
    setMealComponents(updatedComponents);
  };

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem("meals");
        if (storedMeals) {
          const parsedMeals: Meal[] = JSON.parse(storedMeals);
          setMeals(parsedMeals);
        }
      } catch (error) {
        console.error("Error loading meals:", error);
      }
    };
    loadMeals();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.flexContainer}>
        <View style={styles.flexChild}>
          <Text style={styles.label}>Nazwa posiłku</Text>
          <TextInput
            style={styles.input}
            value={mealName}
            onChangeText={text => setMealName(text)}
          />
          <Text style={styles.label}>Składnik</Text>
          <TextInput
            style={styles.input}
            value={componentName}
            onChangeText={text => setComponentName(text)}
          />

          <Text style={styles.label}>Ilość(gramy)</Text>
          <TextInput
            style={styles.input}
            value={componentAmount}
            keyboardType="numeric"
            onChangeText={text => setComponentAmount(text)}
          />
          <Button title="Dodaj składnik" onPress={addComponent} />
        </View>

        <View style={styles.flexChild}>
          <Text style={styles.text}>Podgląd posiłku</Text>
          <FlatList
            data={mealComponents}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.componentItem}>
                <Text style={styles.list}>
                  {item.name} - {item.amount}g
                </Text>
                <TouchableOpacity onPress={() => deleteComponent(index)}>
                  <Text style={styles.deleteButton}>X</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
      <Button title="Zapisz Posiłek" onPress={saveMeal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 10,
  },
  flexContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  flexChild: {
    width: "45%",
  },
  text: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 18,
  },
  form: {
    marginTop: -50,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 30,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  list: {
    marginRight: 20,
  },
  componentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    paddingVertical: 10,
  },
  deleteButton: {
    fontWeight: "bold",
    color: "red",
  },
});
