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
          style={styles.photosList}
          data={savedPhotos}
          keyExtractor={item => item.uri}
          numColumns={3}
          renderItem={({ item }) => (
            <Image source={item} style={styles.image} />
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
  photosList: {
    width: "100%",
  },
  image: {
    width: "30%",
    aspectRatio: 1,
    margin: 6,
  },
});
