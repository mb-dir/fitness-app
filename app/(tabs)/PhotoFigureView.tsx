import Camera from "../../components/Photos/Camera";
import PhotosList from "../../components/Photos/PhotosList";
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
