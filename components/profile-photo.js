import { Image, StyleSheet, View } from "react-native";

export default function ProfilePhoto({ uri, width, containerStyle, online }) {
  const statusMarkerOffset = Math.round(width * .035)
  const statusMarkerWidth = Math.round(width * .25)
  
  return (
    <View style={containerStyle}>
      <Image source={{ uri }} style={[styles.image, { width }]} />
      <View
        style={[
          styles.statusMarker,
          {
            backgroundColor: online ? "green" : "gray",
            width: statusMarkerWidth,
            right: statusMarkerOffset,
            bottom: statusMarkerOffset
          }
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    borderRadius: 1000,
    borderColor: "#fff",
    borderWidth: 1
  },
  statusMarker: {
    position: "absolute",
    width: 10,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 100
  }
})