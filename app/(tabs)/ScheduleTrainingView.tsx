import { StyleSheet, Text, View } from "react-native";

import { DAY_OF_WEEK } from "../../components/ScheduleDay";
import { JSX } from "react";
import ScheduleDay from "../../components/ScheduleDay";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

export default function ScheduleTrainingView() {
  const Tab = createMaterialTopTabNavigator();
  const getTabScreen = (
    name: string,
    props: JSX.IntrinsicAttributes & { day: DAY_OF_WEEK }
  ) => {
    return () => <ScheduleDay {...props} />;
  };
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Pn"
        component={getTabScreen("Pn", { day: DAY_OF_WEEK.Monday })}
      />
      <Tab.Screen
        name="Wt"
        component={getTabScreen("Wt", { day: DAY_OF_WEEK.Tuesday })}
      />
      <Tab.Screen
        name="Śr"
        component={getTabScreen("Śr", { day: DAY_OF_WEEK.Wednesday })}
      />
      <Tab.Screen
        name="Cz"
        component={getTabScreen("Cz", { day: DAY_OF_WEEK.Thursday })}
      />
      <Tab.Screen
        name="Pt"
        component={getTabScreen("Wt", { day: DAY_OF_WEEK.Friday })}
      />
      <Tab.Screen
        name="Sb"
        component={getTabScreen("Sb", { day: DAY_OF_WEEK.Saturday })}
      />
      <Tab.Screen
        name="Nd"
        component={getTabScreen("Nd", { day: DAY_OF_WEEK.Sunday })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
