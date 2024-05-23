import * as ImagePicker from 'expo-image-picker';
import * as ExpoImagePicker from "expo-image-picker";
import * as ImageManipulator from 'expo-image-manipulator';
import { useState } from "react";
import { Alert, View, Image, TouchableOpacity, Text, StyleSheet, Button } from "react-native";

import callGoogleVisionAsync from '../../../GoogleVision';

export function ImageGet(){
  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const options = {
    mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
    base64: true,
    allowsEditing: true,
    quality: 1,
  };
  function PrepareText(text){
    const regex = /[A-Z]{3}-\d{4}|[A-Z]{3}\d[A-Z]\d{2}/g; // Expressão regular para encontrar uma placa de carro nos formatos ABC-1234 ou AAA1A11
    const match = regex.exec(text);
    setText(match ? match[0] : 'Nenhuma placa encontrada');
  }

  const handleGetImageFromCamera = async () => {
    var { granted } = await ExpoImagePicker.getCameraPermissionsAsync();
    if (!granted) {
      const { granted: newGranted } =
        await ExpoImagePicker.requestCameraPermissionsAsync();
      granted = newGranted;
    }
    if (granted)
      await ExpoImagePicker.launchCameraAsync(options).then((response) => {
        if (!response.canceled){
          setImage(response.assets[0].uri);
          setLoading(true);
          callGoogleVisionAsync(response.assets[0].base64)
          .then((res) => {
            console.log("Resultado da OCR",res.responses[0].fullTextAnnotation.text);
            PrepareText(res.responses[0].fullTextAnnotation.text);
          }).catch((error) => {
            console.error(error);
          }).finally(() => {
            setLoading(false);
          });
        }  
      });
  };


  const handleGetImageFromLibrary = async () => {
     // No permissions request is necessary for launching the image library
     const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log(response);

    if (!response.canceled) {
      const imgManipulation = await ImageManipulator.manipulateAsync(
        response.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      setImage(imgManipulation.uri);
      callGoogleVisionAsync(imgManipulation.base64).then((res) => {
        console.log("Resultado da OCR",res.responses[0].fullTextAnnotation.text);
        PrepareText(res.responses[0].fullTextAnnotation.text);
      }).catch((error) => {
        console.error(error);
      });
    }
  };

  const handleGetImage = async () => {
    Alert.alert("Selecione uma imagem", "A imagem será usada para extrair a placa do carro", [
      
      { text: "Usar Câmera", onPress: handleGetImageFromCamera },
      { text: "Escolher da biblioteca", onPress: handleGetImageFromLibrary },
      { text: "Cancelar" },
    ],
    { cancelable: true });
  };

  return (
    <>
      <View style={styles.ImageContainer}>
        <TouchableOpacity onPress={handleGetImage} style={styles.container} disabled={loading}>
          {image !== undefined && image !== null && image !== "" ? (
            <Image 
              source={{ uri: image }} 
              style={styles.Image} 
            />
            
          ) : (
            <View style={styles.center}>
              <Text>
                Selecione uma imagem
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    <View style={styles.Text}>
        <Text>
          Texto lido pela API do Google:
        </Text>
        {loading && <Text>Carregando...</Text>}
        <Text>
          {text}
        </Text>
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  ImageContainer:{
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "lightgray",
    alignItems: "center",
    justifyContent: "center",
  
  },
  container: {
    width: "100%",
    height: "100%",
    borderRadius: 10,

  },
  Image:{
    width: "100%",
    height: "100%",
    borderRadius: 10,
  
  },
  Text:{
    width: "100%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  center:{
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  }
});