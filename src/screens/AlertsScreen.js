import { useCallback, useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Badge, Button, Card, Empty, ErrorBox, Loading, styles as ui } from '../components/ui.js'
import { ALERT_KIND, formatTime } from '../utils/format.js'

/** 알림 · 완료 확인: GET /replanning/alerts */
export default function AlertsScreen({ source }) {
  const [alerts, setAlerts] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      setAlerts(await source.listAlerts())
    } catch (err) {
      setError(err.message)
    }
  }, [source])

  useEffect(() => {
    load()
  }, [load])

  async function run(key, fn) {
    setBusy(key)
    setError('')
    try {
      const updated = await fn()
      if (updated) setAlerts((list) => list.map((a) => (a.id === updated.id ? { ...a, ...updated } : a)))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  if (!alerts && !error) return <Loading text="알림을 불러오는 중…" />

  return (
    <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
      {!!error && <ErrorBox message={error} onRetry={load} />}
      {alerts?.length === 0 && <Empty text="새 알림이 없어요." />}
      {alerts?.map((a) => {
        const askCompletion = a.kind === 'completion_question' && !a.answer
        return (
          <Card key={a.id} style={a.isRead && !askCompletion ? { opacity: 0.6 } : null}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <Badge tone={askCompletion ? 'danger' : 'primary'}>{ALERT_KIND[a.kind] ?? '생활비서 알림'}</Badge>
              {!a.isRead && <Badge tone="gray">새 알림</Badge>}
            </View>
            <Text style={ui.title}>{a.detail?.title ?? '관리 중인 작업'}</Text>
            {!!a.detail?.reason && <Text style={ui.text}>{a.detail.reason}</Text>}
            <Text style={ui.sub}>{formatTime(a.createdAt)}</Text>

            {askCompletion ? (
              <>
                <Text style={ui.text}>이 작업을 끝냈나요?</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button
                    title="아직 못 끝냈어요"
                    variant="outline"
                    style={{ flex: 1 }}
                    disabled={!!busy}
                    loading={busy === `no:${a.id}`}
                    onPress={() => run(`no:${a.id}`, () => source.respondAlert(a.id, 'not_completed'))}
                  />
                  <Button
                    title="끝냈어요"
                    style={{ flex: 1 }}
                    disabled={!!busy}
                    loading={busy === `yes:${a.id}`}
                    onPress={() => run(`yes:${a.id}`, () => source.respondAlert(a.id, 'completed'))}
                  />
                </View>
              </>
            ) : a.answer ? (
              <Text style={[ui.sub, { color: '#2B8A3E' }]}>{a.answer === 'completed' ? '완료로 응답했어요' : '미완료로 응답했어요'}</Text>
            ) : (
              !a.isRead && (
                <Button
                  title="읽음으로 표시"
                  variant="outline"
                  disabled={!!busy}
                  loading={busy === `read:${a.id}`}
                  onPress={() => run(`read:${a.id}`, () => source.readAlert(a.id))}
                />
              )
            )}
          </Card>
        )
      })}
    </ScrollView>
  )
}
