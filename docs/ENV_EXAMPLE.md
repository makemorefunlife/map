# 환경변수 예시 파일

이 파일은 `.env` 파일의 예시입니다. 실제 `.env` 파일을 생성할 때 이 내용을 참고하세요.

**주의**: 실제 API 키와 비밀 키는 절대 공개 저장소에 커밋하지 마세요!

```bash
# ============================================
# 한국관광공사 공공 API
# ============================================
# 공공데이터포털(https://www.data.go.kr)에서 발급받은 API 키
NEXT_PUBLIC_TOUR_API_KEY=your_tour_api_key_here

# 서버 전용 API 키 (선택 사항)
# 없으면 NEXT_PUBLIC_TOUR_API_KEY를 사용합니다
# TOUR_API_KEY=your_server_tour_api_key_here

# ============================================
# 네이버 지도 API
# ============================================
# 네이버 클라우드 플랫폼(https://www.ncloud.com)에서 발급받은 Maps API 클라이언트 ID
# Web Dynamic Map 서비스 활성화 필요
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_naver_map_client_id_here

# ============================================
# Clerk 인증
# ============================================
# Clerk 대시보드(https://dashboard.clerk.com)에서 발급받은 키
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# ============================================
# Supabase
# ============================================
# Supabase 대시보드(https://app.supabase.com)에서 발급받은 키
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx

# ============================================
# 사이트 URL (SEO용)
# ============================================
# 프로덕션 배포 시 실제 도메인으로 변경
# 예: NEXT_PUBLIC_SITE_URL=https://my-trip.vercel.app
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 환경변수 발급 방법

### 1. 한국관광공사 API 키

1. [공공데이터포털](https://www.data.go.kr) 접속
2. 회원가입 및 로그인
3. "한국관광공사_국문 관광정보 서비스" 검색
4. 활용신청 → API 키 발급

### 2. 네이버 지도 API 키

1. [네이버 클라우드 플랫폼](https://www.ncloud.com) 접속
2. 회원가입 및 신용카드 등록 (무료 사용량 제공)
3. Console → Services → AI·NAVER API → Maps
4. Web Dynamic Map 서비스 활성화
5. Application 등록 → Client ID 발급

### 3. Clerk 인증 키

1. [Clerk](https://clerk.com) 접속
2. 회원가입 및 프로젝트 생성
3. API Keys 메뉴에서 키 복사

### 4. Supabase 키

1. [Supabase](https://app.supabase.com) 접속
2. 프로젝트 생성
3. Settings → API에서 URL 및 키 확인

## 보안 주의사항

- **절대 공개 저장소에 커밋하지 마세요**
- `.env` 파일은 `.gitignore`에 포함되어 있습니다
- 프로덕션에서는 Vercel 대시보드에서 환경변수를 설정하세요
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용이며 절대 클라이언트에서 사용하지 마세요

