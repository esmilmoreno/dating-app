import { collection, getDocs, query, where } from "firebase/firestore";
import { useLayoutEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../auth-context";
import { db } from "../firebase";
import ProfileLine from "../components/profile-line";
import ListEmptyText from "../components/list-empy-text";
import { useTheme } from "@react-navigation/native";

export default function Likes({ navigation }) {
  const { colors } = useTheme()
  const { myProfile, dislikeProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profilesArray, setProfilesArray] = useState([])
  const [selectedProfileIds, setSelectedProfileIds] = useState([])

  const refresh = async () => {
    setSelectedProfileIds([])
    setLoading(true)

    try {
      const filterArray = myProfile.likes.length > 0 ? myProfile.likes : ["placeholder"]
      const q = query(collection(db, "profiles"), where("uid", "in", filterArray || [profile.uid]))
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

  const handlePress = (uid) => {
    if (selectedProfileIds.length > 0) return toggleSelection(uid)
    navigation.navigate("view-profile", { uid })
  }

  const toggleSelection = (uid) => {
    setSelectedProfileIds(prev => {
      const isSelected = prev.find(cr => cr === uid) ? true : false

      if (isSelected) return prev.filter(cr => cr !== uid)
      return [...prev, uid]
    })
  }

  const removeLikes = () => {
    selectedProfileIds.forEach(async (cr) => {
      try {
        await dislikeProfile(cr)
      } catch (err) {
        console.log(err);
      }
    })
  }

  useLayoutEffect(() => {
    refresh()
  }, [myProfile])

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={profilesArray}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedProfileIds.find(cr => cr === item.uid) ? true : false

          return (
            <TouchableOpacity onPress={() => handlePress(item.uid)} onLongPress={() => toggleSelection(item.uid)}>
              <ProfileLine profile={item} />
              {isSelected && (
                <View style={[styles.selectedBackground, { backgroundColor: colors.primary }]} />
              )}
            </TouchableOpacity>
          )
        }}
        ListEmptyComponent={<ListEmptyText text="No dislikes were found" />}
        contentContainerStyle={{ paddingVertical: 8 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      />

      {selectedProfileIds.length > 0 && (
        <TouchableOpacity onPress={removeLikes} style={[styles.action, { backgroundColor: colors.primary }]}>
          <Text style={styles.actionText}>Dislike {selectedProfileIds.length} profiles</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  selectedBackground: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    opacity: 0.325
  },
  action: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  actionText: {
    color: "#fff"
  }
})