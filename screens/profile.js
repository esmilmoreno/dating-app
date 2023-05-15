import { ImageBackground, Image, View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import Button from "../components/button";
import * as ImagePicker from "expo-image-picker"
import { useAuth } from "../auth-context";
import { useTheme } from "../theme-context";
import { useState } from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import PhotoUploader from "../components/photo-uploader";

export default function Profile({ navigation }) {
  const { backgroundColor, color, borderColor } = useTheme()
  const { user, profile, updateProfile, removePhoto } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)

  const numColumns = 4

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns)

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns)
    while(numberOfElementsLastRow !== numColumns - 1) {
      data.push({uri: null, type: "empty"})
      numberOfElementsLastRow ++
    }

    return [{id: Math.random(), uri: null, type: "btn"}, ...data]
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1,1]
    });

    if (!result.cancelled) {
      handleImagePicked(result);
    }
  }

  const handleImagePicked = async (pickerResult) => {
    setLoading(true)
    
    try {
      const uploadUrl = await uploadImageAsync(pickerResult.uri);
      await updateProfile({profilePhoto: uploadUrl});
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    }

    setLoading(false)
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
  
    const fileRef = ref(storage, "profile/" + user.uid);
    await uploadBytes(fileRef, blob);
  
    // We're done with the blob, close and release it
    blob.close();
  
    return await getDownloadURL(fileRef);
  }

  const handleImagePress = (photo) => {
    if(!photo.uri) return
    if(!editMode) return navigation.navigate("image", {uri: photo.uri})
    deletePhoto(photo)
  }

  const deletePhoto = async (photo) => {
    if(loading) return
    
    try {
      await removePhoto(photo)
    } catch (err) {
      console.log(err);
    }
  }

  if(!profile) return (
    <View style={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor, padding: 16}}>
      <Text style={{color, marginBottom: 16, fontSize: 16, textAlign: "center"}}>You need to configure your profile.</Text>
      <Button text="configure profile" onPress={() => navigation.navigate("profile-edit")} />
    </View>
  )

  return (
    <View style={{flex: 1, backgroundColor, paddingBottom: editMode ? 60 : 0}}>
      <FlatList style={{backgroundColor}} contentContainerStyle={{paddingVertical: 16, paddingHorizontal: 12}} 
        data={formatData(profile.photos || [], numColumns)}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          if(item.type === "btn") return <PhotoUploader />

          return (
            <TouchableOpacity onPress={() => handleImagePress(item)} onLongPress={setEditMode} style={[{flex: 1, aspectRatio: 1, justifyContent: "center", alignItems: "center", margin: 4, borderColor, borderRadius: 8}, editMode && styles.editMode]}>
              {!item.type && <>
                {editMode && <Ionicons name="remove-circle" size={24} color={"#dc3545"} style={{position: "absolute", top: -10, right: -10, zIndex: 1}} />}
                <Image source={{uri: item.uri}} style={{flex: 1, aspectRatio: 1, borderRadius: 8}} />
              </>}
            </TouchableOpacity>
          )
        }}
        numColumns={numColumns}
        ListHeaderComponent={ () =>
        <View style={{paddingHorizontal: 4}}>
          <ImageBackground
            source={{
              uri: profile.profilePhoto
            }}
            blurRadius={20}
            style={{
              padding: 16,
              marginBottom: 16
            }}
            imageStyle={{
              borderRadius: 8
            }}
          >
            <View style={{backgroundColor: "rgba(0,0,0,0.625", display: "flex", flexDirection: "row", alignItems: "flex-end"}}>
              <TouchableOpacity onPress={() => navigation.navigate("image", {uri: profile.profilePhoto})} style={{width: 100, aspectRatio: 1, borderRadius: 500, backgroundColor, display: "flex", justifyContent: "center", alignItems: "center"}}>
                {loading ? <ActivityIndicator size={"small"} color={color} /> :
                <Image
                  source={{
                    uri: profile.profilePhoto
                  }}
                  style={{flex: 1, aspectRatio: 1, borderRadius: 500}}
                />}
                <TouchableOpacity onPress={pickImage} style={{position: "absolute", bottom: 2, right: 2}}>
                  <AntDesign name="edit" size={24} color="#333" style={{backgroundColor: "#fff", borderRadius: 100, padding: 4}} />
                </TouchableOpacity>
              </TouchableOpacity>
              <View style={{flex: 1, paddingHorizontal: 16}}>
                <Text style={{color: "#fff", fontSize: 24, fontWeight: "bold"}} numberOfLines={1}>{profile.fName + " " + profile.lName}.</Text>
                <Text style={{color: "#fff", opacity: .625}}>{new Date().getFullYear() - profile.birthDate.toDate().getFullYear()} years old</Text>
              </View>
            </View>
          </ImageBackground>

          <Text style={{color: "gray", paddingHorizontal: 0, marginBottom: 4}}>About me</Text>
          <Text style={{ color, marginBottom: 16 }}>{profile.about}</Text>

          <Text style={{color: "gray", paddingHorizontal: 0, marginBottom: 8}}>Photos</Text>

        </View>
        }
      />
      {editMode && <View style={styles.finishButtonContainer}><Button text="done" onPress={() => setEditMode(false)} /></View>}
    </View>
  )
}

const styles = StyleSheet.create({
  editMode: {
    transform: [{scale: .9}]
  },
  finishButtonContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8
  }
})