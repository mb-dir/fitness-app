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
import RNPickerSelect from "react-native-picker-select";
import { useIsFocused } from "@react-navigation/native";

export type Meal = {
  name: string;
  components: MealComponent[];
  timestamp: {
    day: number;
    month: number;
    year: number;
    hour: number;
  };
};

type MealComponent = {
  name: string;
  amount: string;
  kcal: number;
};

type availableComponent = {
  label: string;
  value: string;
  kcalPerG: number;
};

const availableComponents: availableComponent[] = [
  { label: "Ryż (0.5kcal/g)", value: "Ryż", kcalPerG: 0.5 },
  { label: "Ziemniaki (0.4kcal/g)", value: "Ziemniaki", kcalPerG: 0.4 },
  { label: "Jajka (0.3kcal/g)", value: "Jajka", kcalPerG: 0.3 },
  { label: "Kurczak (0.25kcal/g)", value: "Kurczak", kcalPerG: 0.25 },
  { label: "Wołowina (0.2kcal/g)", value: "Wołowina", kcalPerG: 0.2 },
  { label: "Tuńczyk (0.29kcal/g)", value: "Tuńczyk", kcalPerG: 0.29 },
  { label: "Łosoś (0.41kcal/g)", value: "Łosoś", kcalPerG: 0.41 },
  {
    label: "Oliwa z oliwek (0.35kcal/g)",
    value: "Oliwa z oliwek",
    kcalPerG: 0.35,
  },
  { label: "Awokado (0.32kcal/g)", value: "Awokado", kcalPerG: 0.32 },
  { label: "Brokuły (0.25kcal/g)", value: "Brokuły", kcalPerG: 0.25 },
  { label: "Marchewki (0.15kcal/g)", value: "Marchewki", kcalPerG: 0.15 },
  { label: "Cukinia (0.17kcal/g)", value: "Cukinia", kcalPerG: 0.17 },
  { label: "Czosnek (0.19kcal/g)", value: "Czosnek", kcalPerG: 0.19 },
  { label: "Cebula (0.2kcal/g)", value: "Cebula", kcalPerG: 0.2 },
  {
    label: "Czerwona papryka (0.15kcal/g)",
    value: "Czerwona papryka",
    kcalPerG: 0.15,
  },
  { label: "Brokuły (0.15kcal/g)", value: "Brokuły", kcalPerG: 0.15 },
  { label: "Szpinak (0.12kcal/g)", value: "Szpinak", kcalPerG: 0.12 },
  {
    label: "Jogurt naturalny (0.29kcal/g)",
    value: "Jogurt naturalny",
    kcalPerG: 0.29,
  },
  { label: "Mleko (0.3kcal/g)", value: "Mleko", kcalPerG: 0.3 },
  { label: "Ser feta (0.26kcal/g)", value: "Ser feta", kcalPerG: 0.26 },
];

export default function AddKCAL() {
  const [mealName, setMealName] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [componentAmount, setComponentAmount] = useState("");
  const [mealComponents, setMealComponents] = useState<MealComponent[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const isFocused = useIsFocused();

  const addComponent = () => {
    if (selectedComponent && componentAmount) {
      const selectedComponentInfo = availableComponents.find(
        component => component.value === selectedComponent
      );

      if (selectedComponentInfo) {
        const kcal =
          parseFloat(componentAmount) * selectedComponentInfo.kcalPerG;

        setMealComponents(prev => [
          ...prev,
          {
            name: selectedComponent,
            amount: componentAmount,
            kcal: kcal,
          },
        ]);
        setComponentAmount("");
        setSelectedComponent("");
      } else {
        Alert.alert("Błąd", "Nieprawidłowy składnik", [{ text: "OK" }]);
      }
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

        await AsyncStorage.setItem("meals", JSON.stringify([...meals, meal]));
        setMealName("");
        setComponentAmount("");
        setSelectedComponent("");
        setMealComponents([]);
        Alert.alert("Informacja", "Posiłek został dodany", [{ text: "OK" }]);
      } else {
        Alert.alert("Błąd", "Uzupełnij dane", [{ text: "OK" }]);
      }
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
        [{ text: "OK" }]
      );
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
          <Text style={styles.label}>Wybierz składnik</Text>
          <RNPickerSelect
            items={availableComponents}
            onValueChange={value => setSelectedComponent(value)}
            value={selectedComponent}
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
    padding: 10,
  },
  flexContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 50,
  },
  flexChild: {
    width: "45%",
  },
  text: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 18,
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
