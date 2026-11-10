import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

/** 로그인 토큰 저장: 휴대폰은 기기 보안 저장소, 웹 미리보기는 메모리 */
const KEY = 'lifemate.accessToken'
let memoryToken = null

const useSecureStore = Platform.OS !== 'web'

export async function getToken() {
  if (!useSecureStore) return memoryToken
  try {
    return await SecureStore.getItemAsync(KEY)
  } catch {
    return null
  }
}

export async function setToken(token) {
  if (!useSecureStore) {
    memoryToken = token
    return
  }
  await SecureStore.setItemAsync(KEY, token)
}

export async function clearToken() {
  memoryToken = null
  if (!useSecureStore) return
  try {
    await SecureStore.deleteItemAsync(KEY)
  } catch {
    // 이미 없으면 무시
  }
}
