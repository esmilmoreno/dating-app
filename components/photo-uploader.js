import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker"
import { useAuth } from "../auth-context";
import { useTheme } from "../theme-context";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

export default function PhotoUploader() {
  const { borderColor, color } = useTheme()
  const { myUser, addPhoto } = useAuth()
  const [loading, setLoading] = useState(false)
  
  const pickImage = async () => {
    if(loading) return
    
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });

    if (!result.cancelled) {
      handleImagePicked(result);
    }
  }

  const handleImagePicked = async (pickerResult) => {
    setLoading(true)
    
    try {
      const photo = await uploadImageAsync(pickerResult.uri);
      await addPhoto(photo);
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
      setLoading(false)
    }
  }

  async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  
    const fileName = "photos/" + (myUser.uid + "_" + Date.now())
    const fileRef = ref(storage, fileName);
    await uploadBytes(fileRef, blob);
  
    // We're done with the blob, close and release it
    blob.close();
  
    const downloadURL = await getDownloadURL(fileRef);
    return {fileName, uri: downloadURL}
  }
  
  return (
    <TouchableOpacity onPress={pickImage} style={[styles.photoPicker, {borderColor}]}>
      {loading ? <ActivityIndicator size="large" color={color} /> :
      <Ionicons name="add" size={40} color={borderColor} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  photoPicker: {
    margin: 4,
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 8,
  }
})