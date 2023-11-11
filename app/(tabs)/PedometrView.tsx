import Pedometr from "../../components/Pedometr";
import PedometrHistory from "../../components/PedometrHistory";
import PedometrSettings from "../../components/PedometrSettings";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

export default function PedometrView() {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Krokomierz" component={Pedometr} />
      <Tab.Screen name="Historia" component={PedometrHistory} />
      <Tab.Screen name="Ustawienia" component={PedometrSettings} />
    </Tab.Navigator>
  );
}
