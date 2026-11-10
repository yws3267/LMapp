import { useCallback, useEffect, useState } from 'react'
import { RefreshControl, ScrollView, Text, View } from 'react-native'
import { Badge, Card, Empty, ErrorBox, Loading, styles as ui } from '../components/ui.js'
import { formatClock } from '../utils/format.js'

/** 브리핑: GET /ai/briefing */
export default function HomeScreen({ source }) {
  const [briefing, setBriefing] = useState(null)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    setError('')
    try {
      setBriefing(await source.getBriefing())
    } catch (err) {
      setError(err.message)
    }
  }, [source])

  useEffect(() => {
    load()
  }, [load])

  async function refresh() {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  if (!briefing && !error) return <Loading text="AI 브리핑을 불러오는 중…" />

  const tz = briefing?.timezone ?? 'Asia/Seoul'
  return (
    <ScrollView
      contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      {!!error && <ErrorBox message={error} onRetry={load} />}

      {briefing && (
        <>
          <Card>
            <Badge>{briefing.summary?.source === 'ai' ? 'AI 요약' : '규칙 기반 요약'}</Badge>
            <Text style={ui.text}>{briefing.summary?.text || '지금 확인할 브리핑이 없어요.'}</Text>
          </Card>

          {!briefing.personalizationEnabled && (
            <Empty text="AI 개인화가 꺼져 있어서 일정을 확인하지 않았어요. 설정 탭에서 켤 수 있어요." />
          )}

          {briefing.departures?.map((d) => (
            <Card key={`dep-${d.scheduleId}`}>
              <Badge tone={d.late ? 'danger' : 'primary'}>{d.late ? '출발 시각 지남' : '출발 브리핑'}</Badge>
              <Text style={ui.title}>{d.title}</Text>
              <Text style={ui.sub}>
                {formatClock(d.startAt, tz)} 시작 · {d.destination?.name ?? '장소 미정'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                <Text style={{ fontSize: 28, fontWeight: '800', color: '#1F2A44' }}>
                  {formatClock(d.recommendedDepartureAt, tz)}
                </Text>
                <Text style={ui.sub}>권장 출발</Text>
              </View>
              <Text style={ui.sub}>
                이동 약 {d.travelMinutes}분(자동차) + 여유 {d.bufferMinutes}분
                {d.weatherAdjustmentMinutes ? ` (비 예보로 +${d.weatherAdjustmentMinutes}분)` : ''}
              </Text>
              {d.weather?.status === 'ok' && (
                <Text style={ui.sub}>
                  도착지 날씨: {d.weather.condition} {d.weather.temp}°C · 강수확률 {d.weather.precipitationProb}%
                </Text>
              )}
              {d.late && <Text style={[ui.sub, { color: '#C92A2A' }]}>지금 출발하면 {formatClock(d.late.arriveAt, tz)} 도착 예상</Text>}
            </Card>
          ))}

          {briefing.preparations?.map((p) => (
            <Card key={`prep-${p.scheduleId}`}>
              <Badge tone="ok">{p.label} 준비</Badge>
              <Text style={ui.title}>{p.title}</Text>
              <Text style={ui.text}>
                {formatClock(p.prepareStartAt, tz)}부터 준비 시작 (출발 {p.leadMinutes}분 전)
              </Text>
            </Card>
          ))}

          {briefing.notices?.map((n, i) => (
            <Empty key={`notice-${i}`} text={n.message} />
          ))}

          {briefing.personalizationEnabled && !briefing.departures?.length && !briefing.preparations?.length && (
            <Empty text="24시간 안에 장소가 있는 일정이 없어요." />
          )}
        </>
      )}
    </ScrollView>
  )
}
