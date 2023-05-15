import { useTheme } from "@react-navigation/native";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function Button({ style, text, onPress, disabled }) {
  const { colors } = useTheme()
  
  return (
    <TouchableOpacity disabled={disabled} style={[styles.button, style, {backgroundColor: colors.primary, opacity: disabled ? .625 : 1}]} onPress={onPress}>
      {disabled ? 
        <ActivityIndicator size="small" color="#fff" />
        :
        <Text style={styles.buttonText}>{text}</Text>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    width: "100%",
    alignItems: "center",
    borderRadius: 8
  },
  buttonText: {
    color: "#fff",
    textTransform: "uppercase"
  }
})
