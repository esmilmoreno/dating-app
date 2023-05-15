import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import ProfilePhoto from "./profile-photo";

export default function ProfileCard({ navigation, profile, position, likeUser, dislikeUser }) {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  const carousel = useRef()
  const [currentIndex, setCurrentIndex] = useState(0)

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length <= 0) return

    setCurrentIndex(viewableItems[0].index)
  }).current

  const previous = () => {
    if (currentIndex <= 0) return

    carousel.current.scrollToIndex({ index: currentIndex - 1 })
  }

  const next = () => {
    if (currentIndex >= profile.photos.length - 1) return

    carousel.current.scrollToIndex({ index: currentIndex + 1 })
  }

  const translationX = useSharedValue(0)
  const translationY = useSharedValue(0)

  const gestureEvent = useAnimatedGestureHandler({
    onActive: event => {
      translationX.value = event.translationX
      translationY.value = event.translationY
    }
  })

  const gestureEventEnded = ({ nativeEvent }) => {
    if (nativeEvent.translationY < -150) return chat()

    if (nativeEvent.translationX > 150) return like()

    if (nativeEvent.translationX < -150) return dislike()

    translationX.value = withSpring(0)
    translationY.value = withSpring(0)
  }

  const like = () => {
    translationX.value = withTiming(width)
    setTimeout(() => {
      likeUser(profile.uid)
    }, 300);
  }

  const dislike = () => {
    translationX.value = withTiming(-width)
    setTimeout(() => {
      dislikeUser(profile.uid)
    }, 300);
  }

  const chat = () => {
    translationX.value = withSpring(0)
    translationY.value = withSpring(0)

    navigation.navigate("chat", { uid: profile.uid })
  }

  const cardStyle = useAnimatedStyle(() => {
    let offset = 0
    let scale = 1

    if (position === "before-last") {
      offset = 25
      scale = .95
    }

    if (position === "before-before-last") {
      offset = 50
      scale = .9
    }

    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value - offset },
        { rotateZ: interpolate(translationX.value, [-300, 300], [-15, 15], Extrapolate.CLAMP) + "deg" },
        { scale: scale }
      ]
    }
  })

  const likeStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translationX.value, [0, 150], [0, 1], Extrapolate.CLAMP)
    }
  })

  const dislikeStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translationX.value, [0, -150], [0, 1], Extrapolate.CLAMP)
    }
  })

  const chatStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translationY.value, [0, -150], [0, 1], Extrapolate.CLAMP)
    }
  })

  return (
    <View style={styles.root}>
      <PanGestureHandler onGestureEvent={gestureEvent} onEnded={gestureEventEnded}>
        <Animated.View style={[styles.cardContainer, { borderColor: colors.border }, cardStyle]}>
          <View style={{ flex: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, overflow: "hidden", backgroundColor: colors.background }}>
            <FlatList
              ref={carousel}
              onViewableItemsChanged={onViewableItemsChanged}
              pagingEnabled={true}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              data={profile.photos}
              keyExtractor={item => item.uri}
              renderItem={({ item }) => {
                return (
                  <Image
                    source={{
                      uri: item.uri
                    }}
                    style={[styles.photo, { width: width - 32 }]}
                  />
                )
              }}
              ListEmptyComponent={<Image source={require("../assets/default-placeholder-image.png")} style={[styles.photo, { width: width - 32 }]} />}
            />
            {(profile.photos.length > 1 && !position) && <View style={{ position: "absolute", flexDirection: "row", alignItems: "center", width: width - 32 }}>
              {profile.photos.map((_, ind) => {
                return <View key={ind} style={{ flex: 1, height: currentIndex === ind ? 5 : 3, backgroundColor: "#fff", margin: 5, borderRadius: 100, opacity: currentIndex === ind ? 1 : 0.625 }} />
              })}
            </View>}

            <View style={{ position: "absolute", bottom: 0, top: 0, width: width - 32, flexDirection: "row" }}>
              <TouchableOpacity onPress={previous} style={{ flex: 1 }} />
              <TouchableOpacity onPress={next} style={{ flex: 1 }} />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("view-profile", { uid: profile.uid })} style={styles.detailsContainer}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.625)']}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0
                }}
              />
              <ProfilePhoto uri={profile.profilePhoto} width={64} containerStyle={{ marginBottom: 16 }} />
              <Text style={styles.fName}>{profile.fName}, {new Date().getFullYear() - profile.birthDate.toDate().getFullYear()}</Text>
              <Text style={styles.ocupation} numberOfLines={2}>
                {profile.ocupation || "unknown"}
              </Text>
            </TouchableOpacity>

            <View pointerEvents="none" style={{ position: "absolute", bottom: 0, top: 0, width: width - 32 }}>
              <Animated.Text style={[styles.actionText, styles.likeLabel, likeStyle]}>Like</Animated.Text>
              <Animated.Text style={[styles.actionText, styles.dislikeLabel, dislikeStyle]}>Dislike</Animated.Text>
              <Animated.Text style={[styles.actionText, styles.chatLabel, chatStyle, { borderColor: colors.primary, color: colors.primary }]}>Chat</Animated.Text>
            </View>
          </View>
          <View style={[styles.options, { backgroundColor: colors.card }]}>
            <TouchableOpacity onPress={dislike} style={[styles.actionButton, { borderColor: colors.border }]}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={chat} style={[styles.actionButton, { backgroundColor: colors.primary, borderWidth: 0, marginHorizontal: 16, width: 64 }]}>
              <Ionicons name="chatbox" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={like} style={[styles.actionButton, { borderColor: colors.border }]}>
              <Ionicons name="checkmark" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
  },
  cardContainer: {
    flex: 1,
    elevation: 3,
    borderRadius: 8
  },
  photo: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: "100%"
  },
  detailsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center"
  },
  fName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold"
  },
  ocupation: {
    color: "#fff",
    opacity: .625,
    fontSize: 16
  },
  likeLabel: {
    left: "20%",
    top: "50%",
    borderColor: "#0d6efd",
    color: "#0d6efd",
    transform: [{ rotateZ: "-15deg" }]
  },
  dislikeLabel: {
    right: "20%",
    top: "50%",
    borderColor: "#dc3545",
    color: "#dc3545",
    transform: [{ rotateZ: "15deg" }]
  },
  chatLabel: {
    bottom: "25%",
    alignSelf: "center"
  },
  actionText: {
    position: "absolute",
    padding: 16,
    paddingBottom: 0,
    borderWidth: 8,
    borderRadius: 16,
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  options: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  actionButton: {
    borderRadius: 100,
    borderWidth: 3,
    width: 50,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center"
  },
})