import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import Torch from "react-native-torch";

export default function MysteryView() {
  const [flashOn, setFlashOn] = useState(false);

  const toggleFlash = () => {
    if (flashOn) {
      Torch.switchState(true);
    } else {
      Torch.switchState(false);
    }
    setFlashOn(prev => !prev);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={toggleFlash}
        style={{ backgroundColor: "lightblue", padding: 10 }}
      >
        <Text style={{ color: "white" }}>
          {flashOn ? "Turn Off Flash" : "Turn On Flash"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
