import { StyleSheet, Text, View } from "react-native";

export enum DAY_OF_WEEK {
  Sunday = "Niedziela",
  Monday = "Poniedziałek",
  Tuesday = "Wtorek",
  Wednesday = "Środa",
  Thursday = "Czwartek",
  Friday = "Piątek",
  Saturday = "Sobota",
}

type props = {
  day: DAY_OF_WEEK;
};

export default function ScheduleTrainingView({ day }: props) {
  return <Text>{day}</Text>;
}

const styles = StyleSheet.create({});
