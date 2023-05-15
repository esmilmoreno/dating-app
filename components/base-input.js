import { View, Text, TextInput, StyleSheet } from "react-native"
import { useState } from "react"
import { useTheme } from "@react-navigation/native"

export default function BaseInput({ placeholder, value, onTextChange, style, secureTextEntry, multiline, keyboardType }) {
  const { colors } = useTheme()
  const [focused, setFocused] = useState()
  
  return (
    <View style={{width: "100%"}}>
      <View pointerEvents="none" style={{zIndex: 1}}>
        <Text style={[styles.placeholder, {backgroundColor: colors.background, color: focused ? colors.primary : "gray", top: (focused || value) ? -10 : 16, fontSize: (focused || value) ? 12 : 14}]}>{placeholder}</Text>
      </View>
      <TextInput 
        style={[styles.input, style, {color: colors.text, borderColor: focused ? colors.primary : colors.border}]}
        value={value}
        onChangeText={onTextChange}
        onFocus={setFocused}
        onBlur={() => setFocused(false)}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        blurOnSubmit={true}
        keyboardType={keyboardType}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8
  },
  placeholder: {
    position: "absolute",
    marginHorizontal: 8,
    paddingHorizontal: 8,
    zIndex: 1
  }
})