import { useTheme } from "@react-navigation/native";
import { Text, StyleSheet } from "react-native";

export default function ListEmptyText({ text }) {
  const { colors } = useTheme()

  return <Text style={[styles.listEmptyText, { color: colors.text }]}>{text}</Text>
}

const styles = StyleSheet.create({
  listEmptyText: {
    alignSelf: "center",
    margin: 16
  }
})