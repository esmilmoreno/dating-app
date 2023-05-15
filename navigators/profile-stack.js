import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/view-profile";
import ProfileEdit from "../screens/profile-edit";

const Stack = createNativeStackNavigator()

export default function ProfileStack({ route }) {

  return (
    <Stack.Navigator screenOptions={{headerShadowVisible: false, animation: "fade_from_bottom"}}>
      <Stack.Screen name="Profile" component={Profile} initialParams={route.params} options={{
          headerTransparent: true,
          headerTintColor: "#fff",
          title: null,
          headerStyle: {backgroundColor: "transparent"}
        }} />
      <Stack.Screen name="profile-edit" component={ProfileEdit} options={{title: "Edit profile"}} />
    </Stack.Navigator>
  )
}