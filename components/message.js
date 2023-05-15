import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { timeFormat } from "../date-format";
import { useAuth } from "../auth-context";
import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function Message({ data }) {
  const { colors } = useTheme()
  const { myUser } = useAuth()
  const lineHeight = useSharedValue(0)

  const toggleDate = () => {
    if (lineHeight.value === 0) {
      lineHeight.value = withTiming(16, {duration: 100})
    } else {
      lineHeight.value = withTiming(0, {duration: 100})
    }
  }

  const dateStyle = useAnimatedStyle(() => {
    return {
      lineHeight: lineHeight.value,
      opacity: interpolate(lineHeight.value, [0, 16], [0, 1], Extrapolate.CLAMP)
    }
  })

  useEffect(() => {
    if(data.to === myUser.uid){
      (async () => {
        try {
          const messageRef = doc(db, "messages", data.id)
          updateDoc(messageRef, {read: true})
        } catch (err) {
          console.log(err);
        }
      })()
    }
  }, [])

  return (
    <TouchableOpacity style={styles.messageContainer} onPress={toggleDate}>
      <Text style={[styles.message, { backgroundColor: data.sender === myUser.uid ? colors.primary : colors.card, color: colors.text }, data.sender === myUser.uid ? styles.outgoing : styles.incoming]}>
        {data.message}
      </Text>
      <Animated.Text style={[dateStyle, { fontSize: 12, color: "gray", paddingHorizontal: 8, overflow: "hidden" }, data.sender === myUser.uid && {alignSelf: "flex-end"}]}>
        {timeFormat(data.date)}
        {" "}
        {data.sender === myUser.uid && <Ionicons name="checkmark-done" size={16} color={data.read ? colors.primary : "gray"} />}
      </Animated.Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 4
  },
  message: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    maxWidth: "80%",
    elevation: 1,
    shadowColor: "rgba(0,0,0,0.625)",
    shadowOpacity: 0.625
  },
  incoming: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0
  },
  outgoing: {
    alignSelf: "flex-end",
    color: "#fff",
    borderBottomRightRadius: 0
  }
})