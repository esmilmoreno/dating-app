import { collection, getDocs, query, where } from "firebase/firestore";
import { useLayoutEffect, useState } from "react";
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../auth-context";
import { db } from "../firebase";
import ProfilePhoto from "../components/profile-photo";
import ListEmptyText from "../components/list-empy-text";

export default function Matches({ navigation }) {
  const { myProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profilesArray, setProfilesArray] = useState([])

  const refresh = async () => {
    setLoading(true)

    try {
      const filterArray = myProfile.likes.length > 0 ? myProfile.likes : ["placeholder"]
      const q = query(collection(db, "profiles"), where("uid", "in", filterArray), where("likes", "array-contains", myProfile.uid))
      const result = await getDocs(q)

      setProfilesArray(() => {
        return result.docs.map(doc => {
          return { id: doc.id, ...doc.data() }
        })
      })
    } catch (err) {
      console.log(err);
    }

    setLoading(false)
  }

  useLayoutEffect(() => {
    refresh()
  }, [myProfile])
  
  return (
    <View>
      <Text style={{ color: "gray", paddingHorizontal: 16, marginBottom: 8 }}>Matches</Text>
      <FlatList
        data={profilesArray}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={{marginHorizontal: 6}} onPress={() => navigation.navigate("chat", { uid: item.uid })}>
              <ProfilePhoto uri={item.profilePhoto} width={50} />
            </TouchableOpacity>
          )
        }}
        ListEmptyComponent={<ListEmptyText text="No matches were found" />}
        style={{ marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 6 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        horizontal={true}
      />
    </View>
  )
}