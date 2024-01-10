import { Link, Tabs } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";
import { blue } from "../../constants/Colors";

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
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="home"
              style={[styles.icon, { color: focused ? blue : color }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="BMIView"
        options={{
          title: "BMI",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="calculate"
              style={[styles.icon, { color: focused ? blue : color }]}
            />
          ),
          headerRight: () => (
            <Link href="/InfoModal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <MaterialCommunityIcons
                    name="progress-question"
                    size={26}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="PedometrView"
        options={{
          title: "Krokomierz",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="run-fast"
              style={[styles.icon, { color: focused ? blue : color }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ScheduleTrainingView"
        options={{
          title: "Twój Trening",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="weight-lifter"
              style={[styles.icon, { color: focused ? blue : color }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="CalorieCalculatorView"
        options={{
          title: "KCAL",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="food-apple"
              style={[styles.icon, { color: focused ? blue : color }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="PhotoFigureView"
        options={{
          title: "Sylwetka",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="add-photo-alternate"
              style={[styles.icon, { color: focused ? blue : color }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="MysteryView"
        options={{
          title: "?",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="crosshairs-question"
              style={[styles.icon, { color: focused ? blue : color }]}
            />
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
