/**
 * @file supabase-api.ts
 * @description Supabase 북마크 관련 API 함수
 *
 * 북마크 조회, 추가, 제거 기능을 제공합니다.
 */

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export interface Bookmark {
  id: string;
  user_id: string;
  content_id: string;
  created_at: string;
  updated_at?: string;
}

/**
 * 현재 사용자의 Clerk ID를 가져옵니다.
 */
async function getCurrentUserId(): Promise<string | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    // users 테이블에서 clerk_id로 조회하여 user_id 가져오기
    const supabase = await createClerkSupabaseClient();
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (error || !data) {
      console.error("Error fetching user:", error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * 특정 관광지의 북마크 상태 확인
 */
export async function getBookmark(
  contentId: string
): Promise<Bookmark | null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const supabase = await createClerkSupabaseClient();
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .eq("content_id", contentId)
      .single();

    if (error) {
      // 북마크가 없는 경우는 에러가 아님
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching bookmark:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getBookmark:", error);
    return null;
  }
}

/**
 * 북마크 추가
 */
export async function addBookmark(contentId: string): Promise<Bookmark> {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("로그인이 필요합니다.");
  }

  const supabase = await createClerkSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      user_id: userId,
      content_id: contentId,
    })
    .select()
    .single();

  if (error) {
    // 이미 존재하는 경우 (UNIQUE 제약 위반)
    if (error.code === "23505") {
      // 기존 북마크 반환
      const existing = await getBookmark(contentId);
      if (existing) return existing;
    }
    throw new Error(`북마크 추가 실패: ${error.message}`);
  }

  if (!data) {
    throw new Error("북마크 추가 실패: 데이터가 반환되지 않았습니다.");
  }

  return data;
}

/**
 * 북마크 제거
 */
export async function removeBookmark(contentId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("로그인이 필요합니다.");
  }

  const supabase = await createClerkSupabaseClient();
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("content_id", contentId);

  if (error) {
    throw new Error(`북마크 제거 실패: ${error.message}`);
  }
}

/**
 * 사용자의 모든 북마크 목록 조회
 */
export async function getUserBookmarks(): Promise<Bookmark[]> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return [];
  }

  const supabase = await createClerkSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }

  return data || [];
}

