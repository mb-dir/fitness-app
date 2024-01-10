import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Torch from "react-native-torch";

export default function MysteryView() {
  const [flashOn, setFlashOn] = useState(false);

  const toggleFlash = () => {
    if (flashOn) {
      Torch.switchState(false);
    } else {
      Torch.switchState(true);
    }
    setFlashOn(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Nie masz pomysłu na trening? Oświeć się!
      </Text>
      <TouchableOpacity onPress={toggleFlash} style={styles.button}>
        <Text style={styles.buttonText}>{flashOn ? "Wyłącz" : "Włącz"}</Text>
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
  message: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0077cc",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
