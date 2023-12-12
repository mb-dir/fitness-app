import * as FileSystem from "expo-file-system";

import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import { img } from "../../types";
import { useIsFocused } from "@react-navigation/native";

export default function PhotosList() {
  const [savedPhotos, setSavedPhotos] = useState<img[]>([]);
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null);
  const isModalVisible = selectedPhotoUri !== null;
  const isFocused = useIsFocused();

  useEffect(() => {
    loadSavedPhotos();
  }, [isFocused]);

  const loadSavedPhotos = async () => {
    try {
      const directory = `${FileSystem.documentDirectory}fa-photos/`;
      const isDirectoryExist = (await FileSystem.getInfoAsync(directory))
        .exists;

      if (!isDirectoryExist) return;

      const photosDirectory = await FileSystem.readDirectoryAsync(directory);

      const imageUris = photosDirectory.map(fileName => ({
        uri: `${directory}${fileName}`,
        date: extractDateFromFileName(fileName),
      }));

      imageUris.sort((a, b) => b.date - a.date);

      setSavedPhotos(imageUris);
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
        [{ text: "OK" }]
      );
      console.error(error);
    }
  };

  const extractDateFromFileName = (fileName: string): number => {
    const regex = /_(.*?)\./;
    const match = fileName.match(regex);
    if (match && match[1]) {
      return +match[1];
    }
    return 0;
  };

  const showDate = (photo: img) => {
    // xDXDXdxDXDXDXDXDXDXddxdxDXDX - best solution ever, FYI to create unique photo name I have used date, so now I get the date from photo name and display itXD
    const regex = /_(.*?)\./;
    const match = photo.uri.match(regex);
    if (match && match[1]) {
      const dateInSec = match[1];
      const photoDate = new Date(+dateInSec);
      const day = photoDate.getDate();
      const month = photoDate.getMonth() + 1;
      const year = photoDate.getFullYear();

      const date =
        day < 10 ? `0${day}/${month}/${year}` : `${day}/${month}/${year}`;

      return date;
    } else {
      return "";
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
      Alert.alert(
        "Błąd",
        "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
        [{ text: "OK" }]
      );
      console.error(error);
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
              <Text style={styles.date}>{showDate(item)}</Text>
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
    padding: 5,
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
  date: {
    textAlign: "center",
  },
  modalImage: {
    width: "100%",
    height: "90%",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    height: 50,
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
