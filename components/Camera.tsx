import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CameraCapturedPicture, Camera as CameraComponent } from "expo-camera";
import { useEffect, useRef, useState } from "react";

import { StatusBar } from "expo-status-bar";
import { shareAsync } from "expo-sharing";
import { useIsFocused } from "@react-navigation/native";

export default function App() {
  let cameraRef = useRef<any>();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(false);
  const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>(
    undefined
  );
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const cameraPermission =
        await CameraComponent.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();

    if (!isFocused) {
      setHasCameraPermission(false);
      setHasMediaLibraryPermission(false);
    }
  }, [isFocused]);

  const toggleCameraType = () => {
    setCameraType(cameraType === 0 ? 1 : 0);
  };

  if (!hasCameraPermission) {
    return (
      <Text>Brak odpowiednich dostępów. Zmień ustawienia dostępu aparatu.</Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef?.current?.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let savePhoto = async () => {
      if (photo) {
        try {
          // Create a directory to store photos if it doesn't exist
          const directory = `${FileSystem.documentDirectory}photos/`;
          await FileSystem.makeDirectoryAsync(directory, {
            intermediates: true,
          });

          // Generate a unique file name for each saved photo
          const fileName = `photo_${new Date().getTime()}.jpg`;
          const fileUri = `${directory}${fileName}`;

          // Save the photo to the local file system
          await FileSystem.writeAsStringAsync(fileUri, photo.base64 || "", {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Clear the current photo
          setPhoto(undefined);
        } catch (error) {
          console.error("Error saving photo:", error);
        }
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <Button title="Share" onPress={sharePic} />
        {hasMediaLibraryPermission ? (
          <Button title="Save" onPress={savePhoto} />
        ) : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <CameraComponent style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button title="Take Pic" onPress={takePic} />
      </View>
      <StatusBar style="auto" />
    </CameraComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    height: 100,
    alignSelf: "flex-end",
    justifyContent: "space-around",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 10,
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
});
