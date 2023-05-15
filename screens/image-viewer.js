import { StyleSheet, Image } from "react-native";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Animated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

export default function ImageViewer({ route, navigation }) {
  const translationY = useSharedValue(0)

  const handleGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      translationY.value = interpolate(event.translationY, [0, 300], [0, 300], Extrapolate.CLAMP)
    },
    onEnd: () => {
      translationY.value = withTiming(0)
    } 
  })

  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translationY.value}],
      opacity: interpolate(translationY.value, [0, 300], [1, 0.3], Extrapolate.CLAMP)
    }
  })

  const goBack = event => {
    const offset = event.nativeEvent.translationY

    if(offset >= 200) navigation.goBack()
  }
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onGestureEvent={handleGesture} onEnded={goBack}>
        <Animated.View style={[{flex: 1}, aStyle]}>
          <Image 
            source={{
              uri: route.params.uri
            }}
            resizeMode={"contain"}
            style={{
              flex: 1,
              backgroundColor: "#000"
            }}
          />
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})