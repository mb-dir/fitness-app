import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => <MaterialIcons name="home" style={styles.icon} />,
        }}
      />
      <Tabs.Screen
        name="BMIView"
        options={{
          title: "BMI",
          tabBarIcon: () => (
            <MaterialIcons name="calculate" style={styles.icon} />
          ),
        }}
      />
      <Tabs.Screen
        name="PedometrView"
        options={{
          title: "Krokomierz",
          tabBarIcon: () => (
            <MaterialCommunityIcons name="run-fast" style={styles.icon} />
          ),
        }}
      />
      <Tabs.Screen
        name="ScheduleTrainingView"
        options={{
          title: "Twój Trening",
          tabBarIcon: () => (
            <MaterialCommunityIcons name="weight-lifter" style={styles.icon} />
          ),
        }}
      />
      <Tabs.Screen
        name="CalorieCalculatorView"
        options={{
          title: "KCAL",
          tabBarIcon: () => (
            <MaterialCommunityIcons name="food-apple" style={styles.icon} />
          ),
        }}
      />
      <Tabs.Screen
        name="PhotoFigureView"
        options={{
          title: "Sylwetka",
          tabBarIcon: () => (
            <MaterialIcons name="add-photo-alternate" style={styles.icon} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 26,
    marginBottom: -10,
  },
});
