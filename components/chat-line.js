import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfilePhoto from "../components/profile-photo";
import { useAuth } from "../auth-context";
import { dateTimeFormat } from "../date-format";
import { db } from "../firebase";

export default function ChatLine({ navigation, chat }) {
  const { colors } = useTheme()
  const { myUser } = useAuth()
  const lastMessage = chat.messages[0]
  const unreadMessages = chat.messages.reduce((count, message) => {
    if(!message.read && message.sender !== myUser.uid) return count +1
    return count
  }, 0)

  const [otherParty, setOtherParty] = useState({})

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, "profiles"), where("uid", "==", chat.uid))
        const results = await getDocs(q)
        const partyResult = results.docs.length > 0 ? results.docs[0] : null

        partyResult && setOtherParty({id: partyResult.id, ...partyResult.data()})
      } catch (err) {
        console.log(err);
      }
    })()
  }, [])

  return (
    <TouchableOpacity onPress={() => navigation.navigate("chat", { uid: otherParty.uid })} style={styles.chatLine}>
      <ProfilePhoto uri={otherParty.profilePhoto} width={50} />
      <View style={{ marginStart: 16, flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.otherParty, { color:  colors.text }]} numberOfLines={1}>{otherParty.fName || "------"}</Text>
          <Text style={{ color: unreadMessages > 0 ? colors.primary : "gray" }}>{dateTimeFormat(lastMessage.date)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: "gray", flex: 1 }} numberOfLines={1}>
            {lastMessage.sender === myUser.uid && <><Ionicons name="checkmark-done" size={14} color={lastMessage.read ? colors.primary : "gray"} />{" "}</>}
            {lastMessage.message}
          </Text>
          {unreadMessages > 0 && <Text style={[styles.unread, {backgroundColor: colors.primary}]}>{unreadMessages}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chatLine: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  otherParty: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginEnd: 16
  },
  unread: {
    color: "#fff",
    borderRadius: 100,
    fontSize: 12,
    paddingHorizontal: 8
  }
})