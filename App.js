import 'react-native-gesture-handler';
import { AuthProvider, useAuth } from './auth-context';
import AuthStack from './navigators/auth-stack';
import { ThemeProvider } from './theme-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainStack from './navigators/main-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthBasedRender />
          </GestureHandlerRootView>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AuthBasedRender() {
  const { myUser } = useAuth()

  return myUser ? <MainStack /> : <AuthStack />
}