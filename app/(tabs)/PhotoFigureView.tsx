import Camera from "../../components/Camera";
import PhotosList from "../../components/PhotosList";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

export default function PhotoFigureView() {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Twoja sylwetka" component={PhotosList} />
      <Tab.Screen name="Dodaj zdjęcie" component={Camera} />
    </Tab.Navigator>
  );
}
