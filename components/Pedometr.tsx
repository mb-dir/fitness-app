import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Accelerometer } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

export default function StepCounter() {
  const [stepCount, setStepCount] = useState(0);
  const prevAccelerationRef = useRef(0);
  const [isTracking, setIsTracking] = useState(true);
  const [savedStepGoal, setSavedStepGoal] = useState(0);
  const isFocused = useIsFocused();

  const getStepGoal = async () => {
    try {
      const storedStepGoal = await AsyncStorage.getItem("stepGoal");
      if (storedStepGoal !== null) {
        setSavedStepGoal(+storedStepGoal);
      }
    } catch (error) {
      console.error("Error getting step goal:", error);
    }
  };

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
    getStepGoal();
  }, [isFocused]);

  const detectSteps = (data: { x: number; y: number; z: number }) => {
    const { x, y, z } = data;
    const currentAcceleration = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    if (
      prevAccelerationRef.current &&
      Math.abs(currentAcceleration - prevAccelerationRef.current) >= 0.025
    ) {
      setStepCount(prevCount => prevCount + 1);
    }

    prevAccelerationRef.current = currentAcceleration;
  };

  const toggleTracking = () => {
    setIsTracking(prevTracking => !prevTracking);
  };

  return (
    <View style={styles.container}>
      <Text>
        Kroki: {stepCount}/{savedStepGoal}
      </Text>

      <TouchableOpacity style={styles.toggleButton} onPress={toggleTracking}>
        <Text style={styles.toggleButtonText}>
          {isTracking ? "Wyłącz" : "włącz"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  toggleButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#3498db",
    borderRadius: 5,
  },
  toggleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
