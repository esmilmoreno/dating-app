import { Link, useTheme } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../auth-context";
import BaseInput from "../components/base-input"
import Button from "../components/button";

export default function Login() {
  const { colors } = useTheme()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [password2, setPassword2] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { signUp } = useAuth()

  async function submit() {
    setLoading(true)
    setError("")

    try {
      await signUp(email, password)
    } catch (err) {
      setError(err.message.split("Firebase: ").pop());
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ marginBottom: 16, fontSize: 24, fontWeight: "bold", color: colors.text }}>Register</Text>

      <BaseInput
        placeholder="Email address"
        value={email}
        onTextChange={setEmail}
        style={{ marginBottom: 16 }}
      />
      <BaseInput
        placeholder="Password"
        value={password}
        onTextChange={setPassword}
        style={{ marginBottom: 16 }}
        secureTextEntry={true}
      />

      <BaseInput
        placeholder="Confirm Password"
        value={password2}
        onTextChange={setPassword2}
        style={{ marginBottom: 16 }}
        secureTextEntry={true}
      />

      <Button style={{ marginBottom: 16 }} text="Log In" onPress={submit} disabled={loading} />

      <Text style={{ color: colors.text }}>{error}</Text>

      <Link to="/login" style={{ color: colors.text }}>log in</Link>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32
  }
})
