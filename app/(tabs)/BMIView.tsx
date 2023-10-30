import BMICalculator from "../../components/BMICalculator";
import BMISavedResults from "../../components/BMISavedResults";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

export default function BMIView() {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Kalkulator BMI" component={BMICalculator} />
      <Tab.Screen name="Zapisane wyniki" component={BMISavedResults} />
    </Tab.Navigator>
  );
}
