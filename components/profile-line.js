import { useTheme } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { getAge } from "../date-format";
import ProfilePhoto from "./profile-photo";

export default function ProfileLine({ profile }) {
  const { colors } = useTheme()

  return (
    <View style={styles.container}>
      <ProfilePhoto uri={profile.profilePhoto} width={50} />
      <View style={styles.detailsContainer}>
        <Text style={[styles.name, { color: colors.text }]}>{profile.fName}, {getAge(profile.birthDate)}</Text>
        <Text style={{ color: "gray" }}>{profile.ocupation || "unknown"}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  detailsContainer: {
    paddingLeft: 16
  },
  name: {
    fontSize: 16,
    fontWeight: "bold"
  }
})