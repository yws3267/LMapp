import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'

/** 앱 공통 색상 */
export const colors = {
  bg: '#F4F6FB',
  card: '#FFFFFF',
  text: '#1F2A44',
  sub: '#5B6475',
  line: '#E3E7EF',
  primary: '#3B5BDB',
  primarySoft: '#E7ECFF',
  danger: '#C92A2A',
  dangerSoft: '#FFF0F0',
  ok: '#2B8A3E',
  okSoft: '#EBFBEE',
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>
}

export function Badge({ children, tone = 'primary' }) {
  const toneStyle = {
    primary: { color: colors.primary, backgroundColor: colors.primarySoft },
    ok: { color: colors.ok, backgroundColor: colors.okSoft },
    danger: { color: colors.danger, backgroundColor: colors.dangerSoft },
    gray: { color: colors.sub, backgroundColor: '#EEF0F4' },
  }[tone]
  return <Text style={[styles.badge, toneStyle]}>{children}</Text>
}

export function Button({ title, onPress, variant = 'primary', disabled = false, loading = false, style }) {
  const isPrimary = variant === 'primary'
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.buttonPrimary : styles.buttonOutline,
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : colors.primary} />
      ) : (
        <Text style={isPrimary ? styles.buttonPrimaryText : styles.buttonOutlineText}>{title}</Text>
      )}
    </Pressable>
  )
}

export function Loading({ text = '불러오는 중…' }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.sub}>{text}</Text>
    </View>
  )
}

export function ErrorBox({ message, onRetry }) {
  return (
    <Card style={{ borderColor: '#FFC9C9', borderWidth: 1 }}>
      <Text style={[styles.text, { color: colors.danger }]}>{message}</Text>
      {onRetry && <Button title="다시 시도" variant="outline" onPress={onRetry} style={{ marginTop: 10 }} />}
    </Card>
  )
}

export function Empty({ text }) {
  return (
    <Card>
      <Text style={styles.sub}>{text}</Text>
    </Card>
  )
}

export const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, gap: 6 },
  badge: {
    alignSelf: 'flex-start',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buttonPrimary: { backgroundColor: colors.primary },
  buttonOutline: { backgroundColor: '#EEF0F4' },
  buttonPrimaryText: { color: '#fff', fontWeight: '600' },
  buttonOutlineText: { color: colors.text, fontWeight: '600' },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  text: { fontSize: 15, color: colors.text },
  sub: { fontSize: 13, color: colors.sub },
})
