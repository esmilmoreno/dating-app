import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ProfilePhoto from "../components/profile-photo"
import { useAuth } from "../auth-context";
import { dateFormat, howLongAgo } from "../date-format";
import Message from "../components/message";
import { db } from "../firebase";
import { useTheme } from "@react-navigation/native";

export default function Chat({ route, navigation }) {
  const { colors } = useTheme()
  const { myUser } = useAuth()

  const chatList = useRef()
  const [messages, setMessages] = useState([])
  const [profile, setProfile] = useState({})
  const lastSeen = profile.lastSeen ? howLongAgo(profile.lastSeen) : "unknown"
  
  const partiesArray = [myUser.uid + "_" + route.params.uid, route.params.uid + "_" + myUser.uid]

  const [messageText, setMessageText] = useState("")

  const sendMessage = async () => {
    if (messageText === "" || messageText === " ") return

    try {
      const newMessage = {
        message: messageText,
        sender: myUser.uid,
        to: route.params.uid,
        parties: myUser.uid + "_" + route.params.uid,
        read: false,
        date: new Date()
      }
      setMessageText("")
      await addDoc(collection(db, "messages"), newMessage)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const q = query(collection(db, "profiles"), where("uid", "==", route.params.uid))

    const unsubscribe = onSnapshot(q, result => {
      const foundProfile = result.docs[0] ? { id: result.docs[0].id, ...result.docs[0].data() } : {}
      setProfile(foundProfile)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    const q = query(collection(db, "messages"), where("parties", "in", partiesArray))
    const unsubscribe = onSnapshot(q, result => {
      const foundMessages = result.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })

      setMessages(foundMessages)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity onPress={() => profile.uid && navigation.navigate("view-profile", {uid: profile.uid})} style={{ flexDirection: "row", alignItems: "center" }}>
          <View>
            <ProfilePhoto uri={profile.profilePhoto} width={45} online={lastSeen === "online"} />
          </View>
          <View style={{marginStart: 16}}>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: "bold", lineHeight: 28 }}>
              {profile.fName || "loading"}</Text>
            <Text style={{ color: "gray", lineHeight: 14 }}>{lastSeen}</Text>
          </View>
        </TouchableOpacity>
      )
    })

    return unsubscribe
  }, [profile])

  useEffect(() => {
    chatList.current.scrollToEnd()
  }, [messages])

  let previousMessage

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={chatList}
        data={messages.sort((a ,b) => {
          if(a.date < b.date) return -1
          if(a.date > b.date) return 1
          return 0
        })}
        keyExtractor={item => item.date}
        renderItem={({ item }) => {
          let showDate = false

          if (!previousMessage || previousMessage.date.toDate().toLocaleDateString() !== item.date.toDate().toLocaleDateString()) {
            previousMessage = item
            showDate = true
          }

          return <>
            {showDate && <Text style={[styles.messageDate, { backgroundColor: colors.card, color: colors.text }]}>{dateFormat(item.date)}</Text>}
            <Message data={item} />
          </>
        }}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      />
      <View style={styles.messageBox}>
        <TextInput
          style={[styles.messageInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card}]}
          placeholder="Write a message"
          placeholderTextColor="gray"
          multiline={true}
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity onPress={sendMessage} style={[styles.sendButton, { backgroundColor: colors.primary }]}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  userStatus: {
    width: 10,
    aspectRatio: 1,
    borderRadius: 100,
    position: "absolute",
    right: 2,
    bottom: 2,
    borderWidth: 1,
    borderColor: "#fff"
  },
  messageDate: {
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginVertical: 4,
    borderRadius: 100,
    elevation: 1,
    fontStyle: "italic"
  },
  messageBox: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center"
  },
  messageInput: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
    marginEnd: 16,
    borderWidth: 1,
    borderRadius: 100 / 2
  },
  sendButton: {
    borderRadius: 100 / 2,
    width: 45,
    aspectRatio: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    elevation: 1
  }
})