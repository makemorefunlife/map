/**
 * @file env.ts
 * @description 환경변수 검증 및 타입 안전한 접근 유틸리티
 *
 * 개발 환경에서 필수 환경변수가 누락되었을 때 경고를 표시하고,
 * 타입 안전한 방식으로 환경변수에 접근할 수 있도록 합니다.
 */

/**
 * 필수 환경변수 목록
 */
const REQUIRED_ENV_VARS = {
  // 한국관광공사 API
  NEXT_PUBLIC_TOUR_API_KEY: "한국관광공사 API 키 (클라이언트)",
  // TOUR_API_KEY는 선택 사항 (없으면 NEXT_PUBLIC_TOUR_API_KEY 사용)
  // 네이버 지도
  NEXT_PUBLIC_NAVER_MAP_CLIENT_ID: "네이버 지도 클라이언트 ID",
  // Clerk (기존)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "Clerk Publishable Key",
  CLERK_SECRET_KEY: "Clerk Secret Key",
  // Supabase (기존)
  NEXT_PUBLIC_SUPABASE_URL: "Supabase URL",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "Supabase Anon Key",
  SUPABASE_SERVICE_ROLE_KEY: "Supabase Service Role Key",
} as const;

/**
 * 환경변수 검증 함수
 * 개발 환경에서만 실행되며, 누락된 환경변수가 있으면 콘솔에 경고를 출력합니다.
 */
export function validateEnv(): void {
  if (process.env.NODE_ENV === "production") {
    return; // 프로덕션에서는 검증하지 않음
  }

  const missing: string[] = [];

  for (const [key, description] of Object.entries(REQUIRED_ENV_VARS)) {
    if (!process.env[key]) {
      missing.push(`${key} (${description})`);
    }
  }

  if (missing.length > 0) {
    console.warn(
      "⚠️  다음 환경변수가 설정되지 않았습니다:\n" +
        missing.map((v) => `  - ${v}`).join("\n") +
        "\n\n.env.local 파일을 생성하고 필요한 환경변수를 설정해주세요."
    );
  }
}

/**
 * 타입 안전한 환경변수 접근 함수
 * @param key 환경변수 키
 * @param defaultValue 기본값 (선택)
 * @returns 환경변수 값 또는 기본값
 */
export function getEnv(
  key: keyof typeof REQUIRED_ENV_VARS,
  defaultValue?: string
): string {
  const value = process.env[key];
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`환경변수 ${key}가 설정되지 않았습니다.`);
  }
  return value;
}

/**
 * 한국관광공사 API 키 가져오기 (클라이언트)
 */
export function getTourApiKey(): string {
  return getEnv("NEXT_PUBLIC_TOUR_API_KEY");
}

/**
 * 한국관광공사 API 키 가져오기 (서버)
 * TOUR_API_KEY가 없으면 NEXT_PUBLIC_TOUR_API_KEY를 fallback으로 사용
 */
export function getTourApiKeyServer(): string {
  // 서버 전용 키가 있으면 사용
  const serverKey = process.env.TOUR_API_KEY;
  if (serverKey) {
    return serverKey;
  }
  // 없으면 클라이언트 키 사용 (공공 API이므로 허용)
  return getEnv("NEXT_PUBLIC_TOUR_API_KEY");
}

/**
 * 네이버 지도 클라이언트 ID 가져오기
 */
export function getNaverMapClientId(): string {
  return getEnv("NEXT_PUBLIC_NAVER_MAP_CLIENT_ID");
}

// 개발 환경에서 자동으로 환경변수 검증 실행
if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
  validateEnv();
}

