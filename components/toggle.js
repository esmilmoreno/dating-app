import { useTheme } from "@react-navigation/native";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

export default function Toggle({ active, style, onPress }) {
  const { colors } = useTheme()

  return (
    <TouchableOpacity style={[style, styles.toggleContainer, {borderColor: colors.border, backgroundColor: active ? colors.primary : "transparent"}]} onPress={onPress}>
      <View style={[styles.toggleHandle, {borderColor: colors.border, right: active ? 1 : null}]} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  toggleContainer: {
    borderWidth: 1,
    borderRadius: 50,
    width: 40,
    height: 20
  },
  toggleHandle: {
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: "#fff",
    marginStart: 1,
    position: "absolute",
    top: 1,
    bottom: 1
  }
})