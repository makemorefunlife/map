import { createClient } from "@supabase/supabase-js";

/**
 * 공개 데이터용 Supabase 클라이언트 (인증 불필요)
 *
 * Next.js 15 App Router 모범 사례:
 * - 브라우저 환경 최적화
 * - RLS 정책이 'anon' 역할에 허용된 데이터만 접근 가능
 * - 인증이 필요 없는 공개 데이터 조회용
 *
 * @example
 * ```tsx
 * import { supabase } from '@/lib/supabase/client';
 *
 * // 공개 데이터 조회
 * const { data } = await supabase.from('public_posts').select('*');
 * ```
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
