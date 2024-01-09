import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import {
  Alert,
  Button,
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import {
  CameraCapturedPicture,
  Camera as CameraComponent,
  CameraPictureOptions,
} from "expo-camera";
import { useEffect, useRef, useState } from "react";

import { cameraType } from "../../types";
import { shareAsync } from "expo-sharing";
import { useIsFocused } from "@react-navigation/native";

export default function Camera() {
  const cameraRef = useRef<CameraComponent>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(false);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [cameraType, setCameraType] = useState<cameraType>(0);
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

  const openAppSettings = () => {
    Linking.openSettings();
  };

  if (!hasCameraPermission) {
    return (
      <View style={styles.container}>
        <Text>Brak odpowiednich dostępów.</Text>
        <Text style={styles.text}>Zmień ustawienia dostępu aparatu.</Text>
        <Button title="Otwórz ustawienia" onPress={openAppSettings} />
      </View>
    );
  }

  const takePhoto = async () => {
    const options: CameraPictureOptions = {
      quality: 1,
      base64: true,
      exif: false,
    };

    const newPhoto: CameraCapturedPicture | null =
      (await cameraRef.current?.takePictureAsync(options)) || null;
    setPhoto(newPhoto);
  };

  if (photo) {
    const sharePhoto = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(null);
      });
    };

    const savePhoto = async () => {
      if (photo) {
        try {
          const directory = `${FileSystem.documentDirectory}fa-photos/`;
          await FileSystem.makeDirectoryAsync(directory, {
            intermediates: true,
          });
          const fileName = `photo_${new Date().getTime()}.jpg`;
          const fileUri = `${directory}${fileName}`;
          await FileSystem.writeAsStringAsync(fileUri, photo.base64 || "", {
            encoding: FileSystem.EncodingType.Base64,
          });

          setPhoto(null);
        } catch (error) {
          Alert.alert(
            "Błąd",
            "Wystąpił nieoczekiwany błąd, skontaktuj się z administratorem",
            [{ text: "OK" }]
          );
          Vibration.vibrate(500);
          console.error(error);
        }
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <View style={styles.actionButtonsContainer}>
          {hasMediaLibraryPermission ? (
            <Button title="Zapisz" onPress={savePhoto} />
          ) : undefined}
          <Button title="Udostępnij" onPress={sharePhoto} />
          <Button title="Usuń" onPress={() => setPhoto(null)} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <CameraComponent style={styles.container} ref={cameraRef} type={cameraType}>
      <View style={styles.buttonsContainer}>
        <Button title="Zrób zdjęcie" onPress={takePhoto} />
        <Button title="Zmień kamerę" onPress={toggleCameraType} />
      </View>
    </CameraComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    paddingBottom: 10,
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
