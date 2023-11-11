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
      }
    };

    loadStepCountFromStorage();
    getStepGoal();
  }, [isFocused]);

  useEffect(() => {
    return () => {
      const saveStepCountToStorage = async () => {
        try {
          await AsyncStorage.setItem("stepCount", stepCount.toString());
        } catch (error) {
          console.error("Error saving step count:", error);
        }
      };

      saveStepCountToStorage();
    };
  }, [stepCount]);

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

  const resetStepCount = async () => {
    if (!isTracking) {
      try {
        await AsyncStorage.setItem("stepCount", "0");
        const storedStepCount = await AsyncStorage.getItem("stepCount");
        if (storedStepCount !== null) {
          setStepCount(+storedStepCount);
        }
      } catch (error) {
        console.error("Error resetting step count in AsyncStorage:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.counterText}>
        Kroki: {stepCount}/{savedStepGoal}
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