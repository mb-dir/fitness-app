import * as FileSystem from "expo-file-system";

import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import { useIsFocused } from "@react-navigation/native";

export default function PhotosList() {
  const [savedPhotos, setSavedPhotos] = useState<any[]>([]);
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null);
  const isModalVisible = selectedPhotoUri !== null;

  const isFocused = useIsFocused();
  useEffect(() => {
    loadSavedPhotos();
  }, [isFocused]);

  const loadSavedPhotos = async () => {
    try {
      const directory = `${FileSystem.documentDirectory}photos/`;
      const photosDirectory = await FileSystem.readDirectoryAsync(directory);
      const imageUris = photosDirectory.map(fileName => ({
        uri: `${directory}${fileName}`,
      }));
      setSavedPhotos(imageUris);
    } catch (error) {
      console.error("Error loading saved photos:", error);
    }
  };

  const openPhotoDetail = (photoUri: string) => {
    setSelectedPhotoUri(photoUri);
  };

  const closePhotoDetail = () => {
    setSelectedPhotoUri(null);
  };

  const deletePhoto = async () => {
    try {
      if (selectedPhotoUri) {
        await FileSystem.deleteAsync(selectedPhotoUri);
        loadSavedPhotos();
        closePhotoDetail();
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
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
            <TouchableOpacity
              style={styles.imageWrapper}
              onPress={() => openPhotoDetail(item.uri)}
            >
              <Image source={item} style={styles.image} />
            </TouchableOpacity>
          )}
        />
      )}

      {savedPhotos.length === 0 && <Text>Brak zdjęć</Text>}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePhotoDetail}
      >
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: selectedPhotoUri || "" }}
            style={styles.modalImage}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={deletePhoto}>
              <Text style={styles.deleteButton}>Usuń</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closePhotoDetail}>
              <Text style={styles.closeButton}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  imageWrapper: {
    width: "30%",
    margin: 6,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  modalImage: {
    width: "100%",
    height: "90%",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  closeButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  deleteButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
});
