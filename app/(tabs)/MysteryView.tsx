import { Text, TouchableOpacity, Vibration } from "react-native";

import React from "react";

export default function MysteryView() {
  const handleVibration = () => {
    // Vibrate for 500 milliseconds
    Vibration.vibrate(500);
  };

  return (
    <>
      <TouchableOpacity onPress={handleVibration}>
        <Text>Press to Vibrate</Text>
      </TouchableOpacity>
      <Text>test</Text>
    </>
  );
}
