import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../auth-context";
import Chat from "../screens/chat";
import ImageViewer from "../screens/image-viewer";
import ProfileStack from "./profile-stack";
import Tabs from "./tabs";

const Stack = createNativeStackNavigator()

export default function MainStack() {
  const { myProfile } = useAuth()

  return (
    <Stack.Navigator screenOptions={{animation: "fade_from_bottom"}}>
      <Stack.Screen name="main tabs" component={Tabs} options={{headerShown: false}} />
      <Stack.Screen
        name="image"
        component={ImageViewer}
        options={{
          headerTransparent: true,
          headerTintColor: "#fff",
          headerStyle: {backgroundColor: "rgba(0,0,0,0.5)"},
          title: null,
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen name="chat" component={Chat} options={{
        presentation: "modal"
      }} />
      <Stack.Screen name="view-profile" component={ProfileStack}
        options={{
          presentation: "modal",
          headerShown: false
        }}
        initialParams={{uid: myProfile.uid}}
      />
    </Stack.Navigator>
  )
}