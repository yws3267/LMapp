import { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import { API_URL } from '../api/client.js'
import { getMe, login } from '../api/lifemate.js'
import { setToken } from '../storage/token.js'
import { Button, colors, styles as ui } from '../components/ui.js'

/** 로그인 · 예시 데이터로 둘러보기 */
export default function LoginScreen({ onLogin }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    if (!identifier.trim() || !password) {
      setError('이메일(또는 아이디)과 비밀번호를 입력해주세요.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await login(identifier.trim(), password)
      await setToken(data.accessToken)
      const user = await getMe()
        .then((me) => me.user ?? null)
        .catch(() => null)
      onLogin({ mode: 'server', user })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.box}>
        <Text style={styles.logo}>AI LifeMate</Text>
        <Text style={ui.sub}>AI가 먼저 제안하고, 실행은 내가 승인해요</Text>

        <TextInput
          style={styles.input}
          placeholder="이메일 또는 아이디"
          autoCapitalize="none"
          autoCorrect={false}
          value={identifier}
          onChangeText={setIdentifier}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={handleLogin}
        />
        {!!error && <Text style={styles.error}>{error}</Text>}

        <Button title="로그인" onPress={handleLogin} loading={loading} />
        <Button title="예시 데이터로 둘러보기" variant="outline" onPress={() => onLogin({ mode: 'demo', user: null })} />
        <Text style={[ui.sub, styles.server]}>서버: {API_URL}</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 },
  box: { gap: 12 },
  logo: { fontSize: 32, fontWeight: '800', color: colors.text },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  error: { color: colors.danger, fontSize: 13 },
  server: { textAlign: 'center', marginTop: 8 },
})
