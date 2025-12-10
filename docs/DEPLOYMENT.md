# 배포 가이드

## 환경변수 설정

### 필수 환경변수

프로덕션 배포 시 다음 환경변수를 설정해야 합니다:

```bash
# 한국관광공사 API
NEXT_PUBLIC_TOUR_API_KEY=your_tour_api_key
# TOUR_API_KEY는 선택 사항 (없으면 NEXT_PUBLIC_TOUR_API_KEY 사용)

# 네이버 지도
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_naver_map_client_id

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 사이트 URL (SEO용)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 환경변수 설명

- **NEXT_PUBLIC_TOUR_API_KEY**: 한국관광공사 공공 API 키 (클라이언트에서 사용)
- **TOUR_API_KEY**: 서버 전용 API 키 (선택 사항, 없으면 NEXT_PUBLIC_TOUR_API_KEY 사용)
- **NEXT_PUBLIC_NAVER_MAP_CLIENT_ID**: 네이버 클라우드 플랫폼 Maps API 클라이언트 ID
- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**: Clerk 인증 공개 키
- **CLERK_SECRET_KEY**: Clerk 인증 비밀 키
- **NEXT_PUBLIC_SUPABASE_URL**: Supabase 프로젝트 URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Supabase Anon Key (공개 키)
- **SUPABASE_SERVICE_ROLE_KEY**: Supabase Service Role Key (서버 전용, 비밀)
- **NEXT_PUBLIC_SITE_URL**: 사이트 URL (sitemap.xml, robots.txt에서 사용)

## Vercel 배포

### 1. 프로젝트 연결

1. [Vercel](https://vercel.com)에 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택 또는 Git 저장소 연결
4. 프로젝트 설정:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `pnpm build` (자동 감지)
   - **Output Directory**: `.next` (자동 감지)

### 2. 환경변수 설정

Vercel 대시보드에서 다음 환경변수를 설정:

1. 프로젝트 설정 → Environment Variables
2. 위의 필수 환경변수 목록을 모두 추가
3. 환경별 설정:
   - **Production**: 모든 환경변수
   - **Preview**: 모든 환경변수 (선택 사항)
   - **Development**: 모든 환경변수 (선택 사항)

### 3. 빌드 및 배포

```bash
# 로컬에서 빌드 테스트
pnpm build

# 빌드 성공 확인 후 Vercel에 배포
# Vercel CLI 사용 시:
vercel --prod
```

### 4. 배포 후 확인

- [ ] 홈페이지 로드 확인
- [ ] 관광지 목록 표시 확인
- [ ] 검색 기능 확인
- [ ] 상세페이지 확인
- [ ] 북마크 기능 확인 (로그인 필요)
- [ ] 통계 페이지 확인
- [ ] 네이버 지도 표시 확인

## Supabase 설정

### 데이터베이스 마이그레이션

1. Supabase 대시보드 접속
2. SQL Editor 열기
3. `supabase/migrations/db.sql` 파일 내용 실행
4. 테이블 생성 확인:
   - `users` 테이블
   - `bookmarks` 테이블

### RLS 정책 (프로덕션)

프로덕션 환경에서는 RLS를 활성화하고 적절한 정책을 설정해야 합니다:

```sql
-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- users 테이블 정책 예시
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.jwt()->>'sub' = clerk_id);

-- bookmarks 테이블 정책 예시
CREATE POLICY "Users can manage own bookmarks" ON bookmarks
  FOR ALL USING (
    auth.jwt()->>'sub' = (SELECT clerk_id FROM users WHERE id = user_id)
  );
```

## 성능 최적화

### 이미지 최적화

- Next.js Image 컴포넌트 사용 (이미 구현됨)
- `next.config.ts`에 외부 이미지 도메인 설정 (이미 설정됨)

### API 캐싱

- 통계 페이지: `revalidate: 3600` (1시간)
- 상세페이지: 동적 데이터이므로 캐싱 제한적

### 코드 분할

- Next.js 자동 코드 분할 활용
- Server Components 우선 사용
- Client Components는 필요한 경우에만 사용

## 트러블슈팅

### 빌드 에러

- 환경변수 누락 확인
- TypeScript 타입 에러 확인
- 의존성 버전 확인

### 런타임 에러

- 브라우저 콘솔 확인
- Vercel 로그 확인
- API 응답 확인

### 네이버 지도 미표시

- `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` 확인
- 네이버 클라우드 플랫폼 Maps API 활성화 확인
- 도메인 등록 확인

## 보안 체크리스트

- [ ] 환경변수에 비밀 키 노출되지 않음
- [ ] `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용
- [ ] RLS 정책 설정 (프로덕션)
- [ ] HTTPS 사용
- [ ] CORS 설정 확인

