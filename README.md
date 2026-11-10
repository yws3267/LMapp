# AI LifeMate 모바일 앱

Expo(React Native)로 만든 AI LifeMate 앱. 팀 백엔드(`/api/v1`)에 연결된다.
서버 없이 볼 때는 로그인 화면의 **예시 데이터로 둘러보기**를 누른다.

| 화면 | 백엔드 API |
|---|---|
| 로그인 | `POST /auth/login`, `GET /me` |
| 브리핑 | `GET /ai/briefing` |
| 제안 (승인·거절) | `/replanning/proposals`, `/replanning/preview` |
| 알림 | `/replanning/alerts` |
| 설정 | `/replanning/settings` |

## 실행

```bash
npm install
cp .env.example .env
npx expo start         # 휴대폰: Expo Go로 QR 코드
npx expo start --web   # PC 브라우저
```

`.env`의 `EXPO_PUBLIC_API_URL`에 서버 주소를 넣는다. 휴대폰에서는 `localhost` 대신 PC의 IP를 쓴다.

## 보안

- API 키는 앱에 넣지 않고 백엔드에서만 쓴다.
- 로그인 토큰은 `expo-secure-store`(기기 보안 저장소)에 저장한다.
