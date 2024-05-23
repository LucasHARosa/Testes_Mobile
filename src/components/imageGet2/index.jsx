import * as ImagePicker from 'expo-image-picker';
import * as ExpoImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, View, Image, TouchableOpacity, Text, StyleSheet, Button } from "react-native";
import TextRecognition from 'react-native-text-recognition';


export function ImageGet2(){
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');

  const options = {
    mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
    base64: true,
    allowsEditing: true,
    quality: 1,
  };

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
        }  
      });
  };

  const processImage = async (imageUri) => {
    console.log("Processando imagem", imageUri);
    try {
      const result = await TextRecognition.recognize(imageUri);
      console.log("Resultado da OCR",result); 
      
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleGetImageFromLibrary = async () => {
     // No permissions request is necessary for launching the image library
     const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(response);

    if (!response.canceled) {
      setImage(response.assets[0].uri);
      const result = await TextRecognition.recognize(response.assets[0].uri);
      console.log("Resultado da OCR",result); 
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
        <TouchableOpacity onPress={handleGetImage} style={styles.container}>
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