/** 화면 표시용 문구·시각 */

export const PROPOSAL_STATUS = {
  pending: '승인 대기',
  applied: '적용 완료',
  rejected: '거절됨',
  expired: '만료됨',
  stale: '오래된 제안',
  undone: '되돌림 완료',
}

export const ALERT_KIND = {
  completion_question: '완료 확인',
  auto_applied: '자동 조정 결과',
  undone: '되돌리기 결과',
  needs_attention: '확인할 내용',
}

const REASONS = {
  SCHEDULE_CONFLICT: '다른 일정과 겹쳐요',
  EXPLICIT_REPLAN: '직접 다시 계획하기를 요청했어요',
  TODO_DEADLINE: '마감 전에 할 일을 배치해요',
  NO_AVAILABLE_SLOT: '허용 시간 안에서 빈 시간을 찾지 못했어요',
  REPLANNING_DISABLED: '설정에서 재계획 동의를 켜주세요',
  MISSING_AVAILABILITY: '사용 가능한 요일과 시간을 설정해주세요',
}

export const reasonLabel = (code) => REASONS[code] ?? (code ? `확인 필요: ${code}` : '')

export function formatTime(value, timezone = 'Asia/Seoul') {
  if (!value) return '미정'
  try {
    return new Intl.DateTimeFormat('ko-KR', {
      timeZone: timezone,
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(new Date(value))
  } catch {
    return new Date(value).toLocaleString()
  }
}

export function formatClock(value, timezone = 'Asia/Seoul') {
  if (!value) return '--:--'
  try {
    return new Intl.DateTimeFormat('ko-KR', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(
      new Date(value),
    )
  } catch {
    return new Date(value).toTimeString().slice(0, 5)
  }
}
