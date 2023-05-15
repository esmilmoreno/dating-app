import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../auth-context";
import CustomTabBarItem from "../components/custom-tab-bar-item";
import { db } from "../firebase";
import Chats from "../screens/chats";
import Discover from "../screens/discover";
import Settings from "../screens/settings";
import MatchTabs from "./match-tabs";

const Tab = createBottomTabNavigator()

export default function Tabs() {
  const { myUser } = useAuth()

  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    const q = query(collection(db, "messages"), where("to", "==", myUser.uid), where("read", "==", false))
    const unsubscribe = onSnapshot(q, result => {
      setUnreadMessages(result.docs.reduce((count) => count + 1, 0))
    })

    return unsubscribe
  }, [])

  return (
    <Tab.Navigator screenOptions={{ headerStyle: { borderBottomWidth: 1 }, tabBarStyle: { borderTopWidth: 1, height: 60 }, tabBarItemStyle: { paddingVertical: 8 }, tabBarShowLabel: false }}>
      <Tab.Screen name="Discover" component={Discover} options={{ tabBarIcon: params => <CustomTabBarItem name="Discover" iconName="albums" {...params} />, tabBarStyle: { backgroundColor: "transparent", borderTopWidth: 0, height: 60, elevation: 0 }, headerStyle: { backgroundColor: "transparent" }, headerShadowVisible: false }} />
      <Tab.Screen name="Messages" component={Chats} options={{ tabBarIcon: params => <CustomTabBarItem name="Messages" iconName="chatbox" {...params} />, tabBarBadge: unreadMessages || null, tabBarBadgeStyle: { fontSize: 12 } }} />
      <Tab.Screen name="Interactions" component={MatchTabs} options={{ tabBarIcon: params => <CustomTabBarItem name="Interactions" iconName="md-heart-half" {...params} />, title: "Interactions", headerStyle: { borderBottomWidth: 0, elevation: 0 } }} />
      <Tab.Screen name="Settings" component={Settings} options={{ tabBarIcon: params => <CustomTabBarItem name="Settings" iconName="settings-sharp" {...params} /> }} />
    </Tab.Navigator>
  )
}