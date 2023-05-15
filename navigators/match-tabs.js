import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Likes from "../screens/likes";
import Dislikes from "../screens/dislikes";
import { useTheme } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator()

export default function MatchTabs() {
  const { colors } = useTheme()

  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: { borderBottomWidth: 1, borderBottomColor: colors.border }, tabBarLabelStyle: { fontWeight: "bold" } }}>
      <Tab.Screen name="Likes" component={Likes} />
      <Tab.Screen name="Dislikes" component={Dislikes} />
    </Tab.Navigator>
  )
}