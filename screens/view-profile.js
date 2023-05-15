import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useLayoutEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { db } from "../firebase";
import { useAuth } from "../auth-context";
import Loading from "./loading";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function ViewProfile({ route, navigation }) {
  const { colors } = useTheme()
  const { myUser, likeProfile, dislikeProfile } = useAuth()
  const { width, height } = useWindowDimensions()
  const [friend, setFriend] = useState(null)

  const minHeight = Math.floor(height * .4)
  const maxHeight = Math.floor(height - 132)
  const animatedHeight = useSharedValue(minHeight)
  const offsetHeight = useSharedValue(0)

  const onGestureEvent = useAnimatedGestureHandler({
    onActive: event => {
      offsetHeight.value = -event.translationY
    },
    onEnd: event => {
      offsetHeight.value = withTiming(0)

      if (event.translationY < -100) return animatedHeight.value = withTiming(maxHeight)
      if (event.translationY > 100) return animatedHeight.value = withTiming(minHeight)
    }
  })

  const detailsStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value + offsetHeight.value
    }
  })

  const like = () => {
    likeProfile(friend.uid)
  }

  const chat = () => {
    navigation.navigate("chat", { uid: friend.uid })
  }

  const dislike = () => {
    dislikeProfile(friend.uid)
  }

  useLayoutEffect(() => {
    (async () => {
      try {
        const uid = route.params.uid
        const q = query(collection(db, "profiles"), where("uid", "==", uid))
        const result = await getDocs(q)
        setFriend({ ...result.docs[0].data() })
      } catch (err) {
        console.log(err.message);
      }
    })()
  }, [])

  if (!friend) return <Loading />

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        <Image source={{ uri: friend.profilePhoto }} style={{ width, height: "100%" }} />
        <View pointerEvents="none" style={[styles.carouselOverlay]}>
          <LinearGradient colors={["rgba(0,0,0,0.625)", "transparent"]} style={{ height: 80 }} />
          <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "flex-end", padding: 16, paddingBottom: 32 }}>
            <LinearGradient colors={["transparent", "rgba(0,0,0,0.625)"]} style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0 }} />
            <View style={{ flex: 1, marginTop: 32 }}>
              <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>{friend.fName}, {friend.birthDate && new Date().getFullYear() - friend.birthDate.toDate().getFullYear()}</Text>
              <Text style={{ color: "gray" }}>{friend.ocupation || "unknown"}</Text>
            </View>
          </View>
        </View>
      </View>
      <Animated.View style={[styles.detailsContainer, detailsStyle]}>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View style={{ backgroundColor: colors.card, paddingVertical: 16, alignItems: "center", borderWidth: 1, borderTopLeftRadius: 16, borderTopRightRadius: 16, borderColor: colors.border }}>
            <View style={{ height: 5, width: 30, borderRadius: 100, backgroundColor: "gray" }} />
          </Animated.View>
        </PanGestureHandler>
        <FlatList
          data={friend.photos}
          keyExtractor={item => item.uri}
          renderItem={({ item }) => <Image source={{ uri: item.uri }} style={{ width: 50, aspectRatio: 1 }} />}
          ListHeaderComponent={
            <View>
              <Text style={{ color: "gray" }}>About me</Text>
              <Text style={{ color: colors.text, marginBottom: 16 }}>
                {friend.about}
              </Text>
            </View>
          }
          contentContainerStyle={{ padding: 16 }}
        />
      </Animated.View>
      <View style={[styles.options, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {friend.uid === myUser.uid ?
          <TouchableOpacity onPress={() => navigation.navigate("profile-edit")} style={[styles.actionButton, { backgroundColor: colors.primary, borderWidth: 0, marginHorizontal: 16, width: 64 }]}>
            <FontAwesome5 name="user-edit" size={24} color="#fff" />
          </TouchableOpacity>
          :
          <>
            <TouchableOpacity onPress={dislike} style={[styles.actionButton, { borderColor: colors.border }]}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={chat} style={[styles.actionButton, { backgroundColor: colors.primary, borderWidth: 0, marginHorizontal: 16, width: 64 }]}>
              <Ionicons name="chatbox" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={like} style={[styles.actionButton, { borderColor: colors.border }]}>
              <Ionicons name="checkmark" size={24} color={colors.text} />
            </TouchableOpacity>
          </>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  detailsContainer: {
    transform: [{ translateY: -16 }]
  },
  options: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopWidth: 1
  },
  actionButton: {
    borderRadius: 100,
    borderWidth: 3,
    width: 50,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})