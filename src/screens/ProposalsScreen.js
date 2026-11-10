import { useCallback, useEffect, useState } from 'react'
import { RefreshControl, ScrollView, Text, View } from 'react-native'
import { Badge, Button, Card, Empty, ErrorBox, Loading, styles as ui } from '../components/ui.js'
import { PROPOSAL_STATUS, formatTime, reasonLabel } from '../utils/format.js'

/** 제안 카드: 변경 전후 시각은 서버의 changes 값을 사용 */
function ProposalCard({ proposal, busy, onApprove, onReject }) {
  const tz = proposal.window?.timezone ?? 'Asia/Seoul'
  const changes = proposal.appliedChanges?.length ? proposal.appliedChanges : proposal.changes ?? []
  const pending = proposal.status === 'pending'
  const statusTone = { pending: 'primary', applied: 'ok', rejected: 'gray' }[proposal.status] ?? 'gray'
  const source = proposal.decision?.source ?? proposal.explanation?.source

  return (
    <Card>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <Badge tone={statusTone}>{PROPOSAL_STATUS[proposal.status] ?? proposal.status}</Badge>
        <Badge tone="gray">{proposal.trigger === 'automatic' ? '자동 감지' : '직접 요청'}</Badge>
        {source === 'mock' && <Badge tone="danger">테스트 AI 응답</Badge>}
      </View>

      {!!(proposal.decision?.reason || proposal.explanation?.text) && (
        <Text style={ui.text}>{proposal.decision?.reason || proposal.explanation.text}</Text>
      )}

      {changes.map((c, i) => (
        <View key={`${c.kind}-${c.scheduleId ?? c.todoId}-${i}`} style={{ marginTop: 6, gap: 2 }}>
          <Text style={{ fontWeight: '700', color: '#1F2A44' }}>
            {c.title} · {c.durationMinutes}분
          </Text>
          <Text style={ui.sub}>
            {c.kind === 'schedule_todo' ? '할 일 일정 배치' : '일정 이동'} · {reasonLabel(c.reasonCode)}
          </Text>
          <Text style={ui.sub}>
            변경 전: {c.before ? `${formatTime(c.before.startAt, tz)} ~ ${formatTime(c.before.endAt, tz)}` : '아직 배치되지 않음'}
          </Text>
          <Text style={[ui.sub, { color: '#3B5BDB' }]}>
            변경 후: {formatTime(c.after?.startAt, tz)} ~ {formatTime(c.after?.endAt, tz)}
          </Text>
        </View>
      ))}

      {proposal.unplaced?.map((u, i) => (
        <Text key={`u-${i}`} style={[ui.sub, { color: '#C92A2A' }]}>
          미배치: {u.title ?? `#${u.id}`} — {reasonLabel(u.reasonCode)}
        </Text>
      ))}

      {pending && changes.length > 0 && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <Button
            title="거절"
            variant="outline"
            style={{ flex: 1 }}
            loading={busy === `reject:${proposal.id}`}
            disabled={!!busy}
            onPress={() => onReject(proposal.id)}
          />
          <Button
            title={`승인 (${changes.length}건)`}
            style={{ flex: 1 }}
            loading={busy === `approve:${proposal.id}`}
            disabled={!!busy}
            onPress={() => onApprove(proposal.id)}
          />
        </View>
      )}
      {pending && proposal.expiresAt && <Text style={ui.sub}>만료: {formatTime(proposal.expiresAt, tz)}</Text>}
    </Card>
  )
}

export default function ProposalsScreen({ source }) {
  const [proposals, setProposals] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    setError('')
    try {
      setProposals(await source.listProposals())
    } catch (err) {
      setError(err.message)
    }
  }, [source])

  useEffect(() => {
    load()
  }, [load])

  async function act(kind, id) {
    setBusy(`${kind}:${id}`)
    setNotice('')
    setError('')
    try {
      const updated = kind === 'approve' ? await source.approveProposal(id) : await source.rejectProposal(id)
      setProposals((list) => list.map((p) => (p.id === id ? { ...p, ...updated } : p)))
      setNotice(kind === 'approve' ? '승인했어요. 일정에 반영됐어요.' : '거절했어요. 기존 일정을 유지해요.')
    } catch (err) {
      // 일정이 바뀌어 거부되면 목록을 새로 받는다
      setError(err.message)
      load()
    } finally {
      setBusy('')
    }
  }

  async function checkNow() {
    setBusy('preview')
    setNotice('')
    setError('')
    try {
      await source.previewReplanning()
      await load()
      setNotice('지금 일정을 점검했어요.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  if (!proposals && !error) return <Loading text="제안을 불러오는 중…" />

  return (
    <ScrollView
      contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true)
            await load()
            setRefreshing(false)
          }}
        />
      }
    >
      <Button title="지금 일정 점검하기" variant="outline" onPress={checkNow} loading={busy === 'preview'} disabled={!!busy} />
      {!!notice && <Text style={[ui.sub, { color: '#2B8A3E' }]}>{notice}</Text>}
      {!!error && <ErrorBox message={error} onRetry={load} />}
      {proposals?.length === 0 && <Empty text="아직 제안이 없어요. 일정이 겹치거나 마감이 가까운 할 일이 생기면 여기에 나타나요." />}
      {proposals?.map((p) => (
        <ProposalCard key={p.id} proposal={p} busy={busy} onApprove={(id) => act('approve', id)} onReject={(id) => act('reject', id)} />
      ))}
    </ScrollView>
  )
}
