/** 예시 데이터 (백엔드 응답과 같은 모양) */

const MIN = 60 * 1000
const at = (minutesFromNow) => new Date(Date.now() + minutesFromNow * MIN).toISOString()

export function mockBriefing() {
  return {
    date: new Date().toISOString().slice(0, 10),
    timezone: 'Asia/Seoul',
    generatedAt: at(0),
    personalizationEnabled: true,
    summary: {
      text: '팀 회의에 가려면 권장 출발 시각에 맞춰 나가세요. 발표가 있으니 출발 30분 전부터 준비를 시작하는 걸 추천해요.',
      source: 'ai',
    },
    departures: [
      {
        scheduleId: 101,
        title: '캡스톤 팀 회의',
        category: 'study',
        startAt: at(150),
        destination: { name: '중부대학교 고양캠퍼스' },
        origin: { type: 'home' },
        travelMinutes: 42,
        travelBasis: 'predicted',
        distanceMeters: 18300,
        baseBufferMinutes: 10,
        weatherAdjustmentMinutes: 10,
        bufferMinutes: 20,
        weather: { status: 'ok', rainy: true, condition: '약한 비', temp: 11, precipitationProb: 70 },
        recommendedDepartureAt: at(85),
        late: null,
      },
    ],
    preparations: [
      {
        scheduleId: 101,
        title: '캡스톤 팀 회의 (발표)',
        startAt: at(150),
        reason: 'presentation',
        label: '발표',
        leadMinutes: 30,
        recommendedDepartureAt: at(85),
        prepareStartAt: at(55),
        isPast: false,
      },
    ],
    notices: [],
  }
}

export function mockProposals() {
  return [
    {
      id: '9001',
      status: 'pending',
      trigger: 'automatic',
      outcome: 'ready',
      window: { timezone: 'Asia/Seoul' },
      decision: {
        source: 'ai',
        action: 'select',
        reason: '팀 회의와 과제 작업 시간이 30분 겹쳐요. 과제 작업을 회의 뒤로 옮기면 마감 전에 끝낼 수 있어요.',
      },
      changes: [
        {
          kind: 'move_schedule',
          scheduleId: 102,
          title: '네트워크 과제',
          durationMinutes: 90,
          reasonCode: 'SCHEDULE_CONFLICT',
          before: { startAt: at(140), endAt: at(230) },
          after: { startAt: at(270), endAt: at(360) },
        },
      ],
      unplaced: [],
      issues: [],
      expiresAt: at(120),
    },
    {
      id: '9000',
      status: 'applied',
      trigger: 'manual',
      outcome: 'ready',
      window: { timezone: 'Asia/Seoul' },
      decision: { source: 'rule', action: 'select', reason: '마감이 가까운 할 일을 빈 시간에 배치했어요.' },
      changes: [
        {
          kind: 'schedule_todo',
          todoId: 55,
          title: '리눅스 실습 정리',
          durationMinutes: 60,
          reasonCode: 'TODO_DEADLINE',
          before: null,
          after: { startAt: at(-300), endAt: at(-240) },
        },
      ],
      unplaced: [],
      issues: [],
      expiresAt: null,
    },
  ]
}

export function mockAlerts() {
  return [
    {
      id: '501',
      proposalId: '9000',
      kind: 'completion_question',
      detail: { title: '리눅스 실습 정리', reason: '배치한 시간이 지났어요.' },
      isRead: false,
      answer: null,
      createdAt: at(-230),
    },
    {
      id: '500',
      proposalId: '9000',
      kind: 'auto_applied',
      detail: { title: '리눅스 실습 정리', reason: '허용한 범위 안에서 일정을 배치했어요.' },
      isRead: true,
      answer: null,
      createdAt: at(-310),
    },
  ]
}

export function mockSettings() {
  return {
    replanningEnabled: true,
    autoReplanningEnabled: true,
    aiExplanationEnabled: true,
    aiPersonalizationEnabled: true,
    autoApplyEnabled: false,
    timezone: 'Asia/Seoul',
  }
}
