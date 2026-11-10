import { getToken } from '../storage/token.js'

/** 백엔드(/api/v1) 호출 공통 함수. 서버 주소는 .env의 EXPO_PUBLIC_API_URL */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1').replace(/\/+$/, '')

const TIMEOUT_MS = 10000

export class ApiError extends Error {
  constructor(message, { status = 0, code = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

// { success, data, error } 에서 data만 꺼내고, 실패면 ApiError
export async function request(path, { method = 'GET', body } = {}) {
  const token = await getToken()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
  } catch {
    throw new ApiError('서버에 연결할 수 없어요. 서버가 켜져 있는지, 주소(EXPO_PUBLIC_API_URL)가 맞는지 확인해주세요.')
  } finally {
    clearTimeout(timer)
  }

  let json = null
  try {
    json = await res.json()
  } catch {
  }

  if (!res.ok || !json?.success) {
    const message = json?.error?.message || `요청을 처리하지 못했어요. (HTTP ${res.status})`
    throw new ApiError(message, { status: res.status, code: json?.error?.code ?? null })
  }
  return json.data
}
