import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { Accelerometer } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { coordinates } from "../../types";
import { useIsFocused } from "@react-navigation/native";

export default function StepCounter() {
  const [stepCount, setStepCount] = useState(0);
  const prevAccelerationRef = useRef(0);
  const [isTracking, setIsTracking] = useState(false);
  const [savedStepGoal, setSavedStepGoal] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    let isMounted = true;

    const subscribeToAccelerometer = async () => {
      Accelerometer.setUpdateInterval(1000);

      Accelerometer.addListener(data => {
        if (isMounted && isTracking) {
          detectSteps(data);
        }
      });
    };

    subscribeToAccelerometer();

    return () => {
      isMounted = false;
      Accelerometer.removeAllListeners();
    };
  }, [isTracking]);

  useEffect(() => {
    const getStepGoal = async () => {
      try {
        const storedStepGoal = await AsyncStorage.getItem("stepGoal");
        if (storedStepGoal !== null) {
          setSavedStepGoal(+storedStepGoal);
        }
      } catch (error) {
        console.error("Error getting step goal:", error);
        Alert.alert(
          "Błąd",
          "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
          [{ text: "OK" }]
        );
        Vibration.vibrate(500);
      }
    };

    const loadStepCountFromStorage = async () => {
      try {
        const storedStepCount = await AsyncStorage.getItem("stepCount");
        if (storedStepCount !== null) {
          setStepCount(+storedStepCount);
        }
      } catch (error) {
        console.error("Error loading step count:", error);
        Alert.alert(
          "Błąd",
          "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
          [{ text: "OK" }]
        );
        Vibration.vibrate(500);
      }
    };

    loadStepCountFromStorage();
    getStepGoal();
  }, [isFocused]);

  useEffect(() => {
    const saveStepCountToStorage = async () => {
      try {
        await AsyncStorage.setItem("stepCount", stepCount.toString());
      } catch (error) {
        console.error("Error saving step count:", error);
        Alert.alert(
          "Błąd",
          "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
          [{ text: "OK" }]
        );
        Vibration.vibrate(500);
      }
    };

    saveStepCountToStorage();
  }, [stepCount]);

  const detectSteps = (data: coordinates) => {
    const { x, y, z } = data;
    const currentAcceleration = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    if (
      prevAccelerationRef.current &&
      Math.abs(currentAcceleration - prevAccelerationRef.current) >= 0.028
    ) {
      setStepCount(prevCount => prevCount + 1);
    }

    prevAccelerationRef.current = currentAcceleration;
  };

  const toggleTracking = () => {
    setIsTracking(prevTracking => !prevTracking);
  };

  const resetStepCount = async () => {
    if (!isTracking) {
      try {
        setStepCount(0);
      } catch (error) {
        Alert.alert(
          "Błąd",
          "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
          [{ text: "OK" }]
        );
        Vibration.vibrate(500);
        console.error("Error resetting step count in AsyncStorage:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.counterText}>
        Kroki: {stepCount}/{savedStepGoal}
      </Text>
      <Text style={styles.textSmall}>
        Spaliłeś około {Math.round(stepCount * 0.05)} kcal
      </Text>

      <TouchableOpacity
        style={[
          styles.toggleButton,
          isTracking ? styles.stopButton : styles.startButton,
        ]}
        onPress={toggleTracking}
      >
        <Text style={styles.toggleButtonText}>
          {isTracking ? "Wyłącz" : "Włącz"}
        </Text>
      </TouchableOpacity>

      {!isTracking && (
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetStepCount}
          disabled={isTracking}
        >
          <Text style={styles.resetButtonText}>Resetuj Kroki</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  counterText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textSmall: {
    fontSize: 16,
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  startButton: {
    backgroundColor: "#27ae60",
  },
  stopButton: {
    backgroundColor: "#e74c3c",
  },
  toggleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resetButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#3498db",
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
