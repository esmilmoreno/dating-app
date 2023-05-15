import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useAuth } from "../auth-context";
import { useCallback, useEffect, useState } from "react";
import ProfileCard from "../components/profile-card";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import ProfilePhoto from "../components/profile-photo";
import ListEmptyText from "../components/list-empy-text";
import { useTheme } from "@react-navigation/native";

export default function Discover(props) {
  const { myProfile, likeProfile, dislikeProfile } = useAuth()
  const { colors } = useTheme()

  const [users, setUsers] = useState([])

  const getUsers = useCallback(async () => {
    let mounted = true

    try {
      const filterArray = [myProfile.uid, ...myProfile.likes, ...myProfile.dislikes]
      
      const q = query(collection(db, "profiles"), where("uid", "not-in", filterArray))
      const usersResult = await getDocs(q)
      mounted && setUsers(usersResult.docs.map( doc => ({id: doc.id, ...doc.data()})))
    } catch (err) {
      console.log(err);
    }

    return () => mounted = false
  }, [myProfile.likes])

  const likeUser = async uid => {
    removeUser(uid)
    
    try {
      await likeProfile(uid)
    } catch (err) {
      console.log(err);
    }
  }

  const dislikeUser = async uid => {
    removeUser(uid)
    
    try {
      await dislikeProfile(uid)
    } catch (err) {
      console.log(err);
    }
  }

  const removeUser = uid => {
    setUsers(prev => {
      return prev.filter( cr => cr.uid !== uid)
    })
  }

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
      <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: 16}}>
        <TouchableOpacity onPress={getUsers} style={{marginHorizontal: 16}}>
          <Ionicons name="refresh" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("view-profile")}>
          <ProfilePhoto uri={myProfile.profilePhoto} width={40} online={true} />
        </TouchableOpacity>
      </View>)
    })
  }, [myProfile, colors.text])

  if(!myProfile) return <ListEmptyText text="You need to configure your profile." />

  return (
    <View style={styles.container}>
      {users.length > 0 ? users.map((profile, index) => {
        let position

        if(index === users.length - 2) {position = "before-last"}
        if(index === users.length - 3) {position = "before-before-last"}
        
        return <ProfileCard {...props} key={index} profile={profile} position={position} likeUser={likeUser} dislikeUser={dislikeUser} />
      }) : <ListEmptyText text="No profiles were found" />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})