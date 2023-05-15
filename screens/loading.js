import { useTheme } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Loading({ opacity }) {
  const { colors } = useTheme()

  return (
    <View style={[styles.loadingScreen, { backgroundColor: colors.background, opacity: opacity || 1 }]}>
      <ActivityIndicator size={"large"} color={colors.text} />
    </View>
  )
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})