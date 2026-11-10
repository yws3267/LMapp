import { useCallback, useEffect, useState } from 'react'
import { ScrollView, Switch, Text, View } from 'react-native'
import { Button, Card, ErrorBox, Loading, colors, styles as ui } from '../components/ui.js'

/** 설정: GET / PATCH /replanning/settings */
const ITEMS = [
  { key: 'aiPersonalizationEnabled', title: 'AI 개인화', desc: '일정·할 일을 AI 브리핑과 제안에 사용해요.' },
  { key: 'replanningEnabled', title: '일정 재계획', desc: '겹치는 일정과 마감이 가까운 할 일을 점검해요.' },
  { key: 'autoReplanningEnabled', title: '자동 제안', desc: '묻지 않아도 필요할 때 변경안을 먼저 만들어요. 반영은 승인 후에만 해요.' },
  { key: 'aiExplanationEnabled', title: 'AI 설명', desc: '변경안을 고른 이유를 AI가 설명해요.' },
  {
    key: 'autoApplyEnabled',
    title: '허용 범위 안 자동 적용',
    desc: '내가 허용한 작업만, 정한 범위 안에서 승인 없이 옮겨요. 이동 범위·점검 시각 설정이 필요해요.',
  },
]

export default function SettingsScreen({ source, user, onLogout }) {
  const [settings, setSettings] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      setSettings(await source.getSettings())
    } catch (err) {
      setError(err.message)
    }
  }, [source])

  useEffect(() => {
    load()
  }, [load])

  async function toggle(key, value) {
    setSaving(key)
    setError('')
    const before = settings
    setSettings({ ...settings, [key]: value })
    try {
      setSettings(await source.updateSettings({ [key]: value }))
    } catch (err) {
      setSettings(before) // 실패하면 되돌림
      setError(err.message)
    } finally {
      setSaving('')
    }
  }

  return (
    <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
      <Card>
        <Text style={ui.title}>{source.mode === 'demo' ? '예시 데이터 모드' : user?.nickname ?? user?.email ?? '로그인됨'}</Text>
        <Text style={ui.sub}>
          {source.mode === 'demo' ? '서버 없이 화면만 확인하는 중이에요.' : '팀 백엔드 서버에 연결되어 있어요.'}
        </Text>
        <Button title="로그아웃" variant="outline" onPress={onLogout} style={{ marginTop: 8 }} />
      </Card>

      {!!error && <ErrorBox message={error} />}
      {!settings && !error && <Loading text="설정을 불러오는 중…" />}

      {settings &&
        ITEMS.map((item) => (
          <Card key={item.key}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>{item.title}</Text>
                <Text style={ui.sub}>{item.desc}</Text>
              </View>
              <Switch
                value={!!settings[item.key]}
                disabled={!!saving}
                onValueChange={(v) => toggle(item.key, v)}
                trackColor={{ true: colors.primary }}
              />
            </View>
          </Card>
        ))}
    </ScrollView>
  )
}
