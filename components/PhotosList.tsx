import * as FileSystem from "expo-file-system";

import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";

import { useIsFocused } from "@react-navigation/native";

export default function PhotosList() {
  const [savedPhotos, setSavedPhotos] = useState<any[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    loadSavedPhotos();
  }, [isFocused]);

  const loadSavedPhotos = async () => {
    try {
      const directory = `${FileSystem.documentDirectory}photos/`;

      // Read the contents of the photos directory
      const photosDirectory = await FileSystem.readDirectoryAsync(directory);

      // Create an array of image URIs
      const imageUris = photosDirectory.map(fileName => ({
        uri: `${directory}${fileName}`,
      }));

      setSavedPhotos(imageUris);
    } catch (error) {
      console.error("Error loading saved photos:", error);
    }
  };

  return (
    <View style={styles.container}>
      {savedPhotos.length > 0 && (
        <FlatList
          data={savedPhotos}
          keyExtractor={item => item.uri}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={item} style={styles.image} />
            </View>
          )}
        />
      )}

      {savedPhotos.length === 0 && <Text>No saved photos available.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    margin: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
});
