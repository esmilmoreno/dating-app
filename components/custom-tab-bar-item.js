import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function CustomTabBarItem({ name, iconName, color, size }) {
  const focused = useIsFocused()

  const animValue = useSharedValue(0)

  const iconStyle = useAnimatedStyle(() => {
    const translationY = interpolate(animValue.value, [0, 1], [8, 0], Extrapolate.CLAMP)
    
    return {
      transform: [{translateY: translationY}]
    }
  })

  const labelStyle = useAnimatedStyle(() => {
    const translationY = interpolate(animValue.value, [0, 1], [12, 0], Extrapolate.CLAMP)

    return {
      transform: [{translateY: translationY}],
      opacity: animValue.value
    }
  })

  useEffect(() => {
    if (focused) {
      animValue.value = withTiming(1)
    } else {
      animValue.value = withTiming(0)
    }
  }, [focused])

  return (
    <View style={styles.container}>
      <Animated.View style={iconStyle}>
        <Ionicons name={iconName} size={size} color={color} />
      </Animated.View>
      <Animated.Text style={[{ color, fontSize: 12, lineHeight: 14 }, labelStyle]}>{name}</Animated.Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center"
  }
})