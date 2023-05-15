import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/login";
import Register from "../screens/register";

const Stack = createNativeStackNavigator()

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: "fade_from_bottom"}}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
    </Stack.Navigator>
  )
}