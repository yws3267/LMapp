import * as api from '../api/lifemate.js'
import { mockAlerts, mockBriefing, mockProposals, mockSettings } from './mock.js'

/** 서버 모드(server) / 예시 데이터 모드(demo) 전환 */
export function createSource(mode) {
  if (mode === 'server') {
    return {
      mode,
      getBriefing: api.getBriefing,
      listProposals: async () => (await api.listProposals()).proposals ?? [],
      previewReplanning: async () => (await api.previewReplanning()).proposal,
      approveProposal: async (id) => (await api.approveProposal(id)).proposal,
      rejectProposal: async (id) => (await api.rejectProposal(id)).proposal,
      listAlerts: async () => (await api.listAlerts()).alerts ?? [],
      readAlert: async (id) => (await api.readAlert(id)).alert,
      respondAlert: async (id, answer) => (await api.respondAlert(id, answer)).alert,
      getSettings: async () => (await api.getSettings()).settings,
      updateSettings: async (fields) => (await api.updateSettings(fields)).settings,
    }
  }

  // 예시 모드: 메모리 안의 데이터를 바꾼다.
  let proposals = mockProposals()
  let alerts = mockAlerts()
  let settings = mockSettings()
  const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 300))
  const updateProposal = (id, status) => {
    proposals = proposals.map((p) => (p.id === id ? { ...p, status } : p))
    return proposals.find((p) => p.id === id)
  }
  const updateAlert = (id, patch) => {
    alerts = alerts.map((a) => (a.id === id ? { ...a, ...patch } : a))
    return alerts.find((a) => a.id === id)
  }

  return {
    mode,
    getBriefing: () => delay(mockBriefing()),
    listProposals: () => delay(proposals),
    previewReplanning: () => delay(proposals[0]),
    approveProposal: (id) => delay(updateProposal(id, 'applied')),
    rejectProposal: (id) => delay(updateProposal(id, 'rejected')),
    listAlerts: () => delay(alerts),
    readAlert: (id) => delay(updateAlert(id, { isRead: true })),
    respondAlert: (id, answer) => delay(updateAlert(id, { isRead: true, answer })),
    getSettings: () => delay(settings),
    updateSettings: (fields) => {
      settings = { ...settings, ...fields }
      return delay(settings)
    },
  }
}
