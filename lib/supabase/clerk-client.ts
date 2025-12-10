"use client";

import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Client Component용)
 *
 * Next.js 15 App Router 모범 사례:
 * - 브라우저 환경 최적화된 클라이언트
 * - Clerk 토큰을 Supabase에 전달하여 인증
 * - React Hook으로 제공되어 Client Component에서 사용
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
 *
 * export default function MyComponent() {
 *   const supabase = useClerkSupabaseClient();
 *
 *   async function fetchData() {
 *     const { data } = await supabase.from('table').select('*');
 *     return data;
 *   }
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useClerkSupabaseClient() {
  const { getToken } = useAuth();

  const supabase = useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url, options = {}) => {
            const token = await getToken();
            const headers = new Headers(options.headers);
            if (token) {
              headers.set("Authorization", `Bearer ${token}`);
            }
            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }, [getToken]);

  return supabase;
}
