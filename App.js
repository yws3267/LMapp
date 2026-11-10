import { useMemo, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import LoginScreen from './src/screens/LoginScreen.js'
import HomeScreen from './src/screens/HomeScreen.js'
import ProposalsScreen from './src/screens/ProposalsScreen.js'
import AlertsScreen from './src/screens/AlertsScreen.js'
import SettingsScreen from './src/screens/SettingsScreen.js'
import { createSource } from './src/data/source.js'
import { clearToken } from './src/storage/token.js'
import { colors } from './src/components/ui.js'

/** 로그인 → 하단 탭 4개 (브리핑 · 제안 · 알림 · 설정) */
const TABS = [
  { key: 'home', label: '브리핑', title: '오늘의 AI 브리핑' },
  { key: 'proposals', label: '제안', title: '일정 변경 제안' },
  { key: 'alerts', label: '알림', title: '알림 · 완료 확인' },
  { key: 'settings', label: '설정', title: '개인화 · 동의 설정' },
]

export default function App() {
  const [session, setSession] = useState(null) // { mode: 'server' | 'demo', user }
  const [tab, setTab] = useState('home')
  const source = useMemo(() => (session ? createSource(session.mode) : null), [session])

  async function logout() {
    await clearToken()
    setSession(null)
    setTab('home')
  }

  if (!session) {
    return (
      <>
        <StatusBar style="dark" />
        <LoginScreen onLogin={setSession} />
      </>
    )
  }

  const current = TABS.find((t) => t.key === tab)
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{current.title}</Text>
        <Text style={[styles.mode, session.mode === 'demo' ? styles.modeDemo : styles.modeServer]}>
          {session.mode === 'demo' ? '예시 데이터' : '서버 연결'}
        </Text>
      </View>

      <View style={styles.body}>
        {tab === 'home' && <HomeScreen source={source} />}
        {tab === 'proposals' && <ProposalsScreen source={source} />}
        {tab === 'alerts' && <AlertsScreen source={source} />}
        {tab === 'settings' && <SettingsScreen source={source} user={session.user} onLogout={logout} />}
      </View>

      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <Pressable key={t.key} style={styles.tab} onPress={() => setTab(t.key)} accessibilityRole="tab">
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
            {tab === t.key && <View style={styles.tabDot} />}
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingTop: Platform.OS === 'web' ? 24 : 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  mode: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden' },
  modeDemo: { backgroundColor: '#FFF4E6', color: '#D9480F' },
  modeServer: { backgroundColor: '#EBFBEE', color: '#2B8A3E' },
  body: { flex: 1, paddingHorizontal: 16 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  tabText: { fontSize: 14, color: colors.sub },
  tabTextActive: { color: colors.primary, fontWeight: '700' },
  tabDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary },
})
