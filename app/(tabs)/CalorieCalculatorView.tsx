import AddKCAL from "../../components/AddKCAL";
import CurrentKCAL from "../../components/CurrentKCAL";
import KCALHistory from "../../components/KCALHistory";
import KCALSettings from "../../components/KCALSettings";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

export default function CalorieCalculatorView() {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dodaj posiłek" component={AddKCAL} />
      <Tab.Screen name="Dziś" component={CurrentKCAL} />
      <Tab.Screen name="Historia" component={KCALHistory} />
      <Tab.Screen name="Ustawienia" component={KCALSettings} />
    </Tab.Navigator>
  );
}
