import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect
} from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";

const themeContext = createContext()

export function useToggleThemeContext() {
  return useContext(themeContext)
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false)
  
  const currentTheme = dark ? {
    dark: true,
    colors: {
      ...DarkTheme.colors,
      primary: "#198754"
    }
  } : {
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      primary: "#198754"
    }
  }
  
  const toggleTheme = () => {
    setDark(prev => !prev)
  }
  
  useLayoutEffect(() => {
    (async () => {
      try {
        const theme = await AsyncStorage.getItem("theme")
        setDark(theme === "dark")
      } catch (err) {
        console.log(err);
      }
    })()
  }, [])
  
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem("theme", dark ? "dark" : "light")
      } catch (err) {
        console.log(err);
      }
    })()
  }, [dark])
  
  return (
    <themeContext.Provider value={toggleTheme}>
      <NavigationContainer theme={currentTheme}>
        <StatusBar style={!dark ? "dark" : "light"} />
        {children}
      </NavigationContainer>
    </themeContext.Provider>
  )
}

// const lightTheme = {
//   backgroundColor: "#f1f1f1",
//   supportColor: "#fff",
//   color: "#333",
//   borderColor: "#ddd",
//   primary: "#198754"
// }

// const darkTheme = {
//   backgroundColor: "#1c1c1c",
//   supportColor: "#2c2c2c",
//   color: "#fff",
//   borderColor: "#444",
//   primary: "#198754"
// }