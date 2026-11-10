import { request } from './client.js'

/** 앱에서 쓰는 백엔드 API 목록 */

// 서버 상태
export const getHealth = () => request('/health')

// 로그인: 이메일 또는 아이디 + 비밀번호 → { accessToken, tokenType, expiresIn, user }
export const login = (identifier, password) =>
  request('/auth/login', { method: 'POST', body: { identifier, password } })

export const getMe = () => request('/me')

// AI 브리핑 (시나리오 5): 출발·준비 브리핑과 요약
export const getBriefing = () => request('/ai/briefing')

// 생활비서 일정 재계획: 제안 → 승인/거절 (JWT 필수)
export const listProposals = () => request('/replanning/proposals')
export const previewReplanning = () =>
  request('/replanning/preview', { method: 'POST', body: { trigger: 'manual', scheduleIds: [], todoIds: [] } })
export const approveProposal = (id) => request(`/replanning/proposals/${id}/approve`, { method: 'POST', body: {} })
export const rejectProposal = (id) => request(`/replanning/proposals/${id}/reject`, { method: 'POST', body: {} })

// 앱 안 알림 · 완료 확인
export const listAlerts = () => request('/replanning/alerts')
export const readAlert = (id) => request(`/replanning/alerts/${id}/read`, { method: 'POST', body: {} })
export const respondAlert = (id, answer) =>
  request(`/replanning/alerts/${id}/respond`, { method: 'POST', body: { answer } })

// 동의 · 개인화 설정
export const getSettings = () => request('/replanning/settings')
export const updateSettings = (fields) => request('/replanning/settings', { method: 'PATCH', body: fields })
