import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useAuth } from "../auth-context";
import ChatLine from "../components/chat-line";
import ListEmptyText from "../components/list-empy-text";
import { db } from "../firebase";
import Loading from "./loading";
import Matches from "./matches";

export default function Chats(props) {
  const { myUser } = useAuth()
  const [sentMessages, setSentMessages] = useState([])
  const [receivedMessages, setReceivedMessages] = useState([])
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  const groupByUser = (list, field, negator) => {
    const groupsObject = list.reduce((result, message) => {
      const key = message[field].split("_").find(uid => uid !== negator)

      if (result[key]) {
        result[key].push(message)
      } else {
        result[key] = [message]
      }

      return result
    }, {})

    const conversations = []
    Object.keys(groupsObject).map(uid => {
      return conversations.push({ uid, messages: groupsObject[uid] })
    })

    return conversations
  }

  useEffect(() => {
    const sent_query = query(collection(db, "messages"), where("sender", "==", myUser.uid))

    const unsubscribe = onSnapshot(sent_query, result => {
      setSentMessages(result.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    const received_query = query(collection(db, "messages"), where("to", "==", myUser.uid))

    const unsubscribe = onSnapshot(received_query, result => {
      setReceivedMessages(result.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    setChats(() => {
      const allData = [...sentMessages, ...receivedMessages].sort((a, b) => {
        if (a.date < b.date) return 1
        if (a.date > b.date) return -1
        return 0
      })

      return groupByUser(allData, "parties", myUser.uid)
    })
  }, [sentMessages, receivedMessages])

  if (loading) return <Loading />

  return (
    <FlatList
      data={chats}
      keyExtractor={item => item.uid}
      renderItem={({ item }) => <ChatLine chat={item} {...props} />}
      ListEmptyComponent={<ListEmptyText text="No messages were found" />}
      ListHeaderComponent={<View>
        <Matches {...props} />
        <Text style={{ color: "gray", paddingHorizontal: 16 }}>Conversations</Text>
      </View>}
      contentContainerStyle={{ paddingVertical: 16 }}
    />
  )
}