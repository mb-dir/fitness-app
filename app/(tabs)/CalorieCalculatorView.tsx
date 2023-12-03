import AddKCAL from "../../components/KCAL/AddKCAL";
import CurrentKCAL from "../../components/KCAL/CurrentKCAL";
import KCALHistory from "../../components/KCAL/KCALHistory";
import KCALSettings from "../../components/KCAL/KCALSettings";
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
