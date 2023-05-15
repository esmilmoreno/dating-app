import { useTheme } from "@react-navigation/native";
import { useToggleThemeContext } from "../theme-context";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../auth-context";
import Button from "../components/button";
import Toggle from "../components/toggle";

export default function Settings() {
  const { dark, colors } = useTheme()
  const toggleTheme = useToggleThemeContext()
  const { signOut } = useAuth()
  
  return (
    <View style={[styles.container]}>
      <Text style={{color: "gray", paddingHorizontal: 16, marginBottom: 8}}>Theme</Text>
      <View style={[styles.optionsContainer, {borderColor: colors.border, backgroundColor: colors.card}]}>
        <View style={styles.option}>
          <Text style={{color: colors.text, fontSize: 16}}>Dark mode</Text>
          <Toggle 
            active={dark}
            onPress={toggleTheme}
          />
        </View>
      </View>
      <Button text="sign out" onPress={signOut} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  optionsContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16
  },
  option: {
    padding: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
})