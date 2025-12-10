/**
 * @file page.tsx
 * @description 북마크 목록 페이지
 *
 * 사용자가 북마크한 관광지 목록을 표시하고 관리할 수 있는 페이지입니다.
 */

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { getDetailCommon } from "@/lib/api/tour-api";
import { BookmarkList } from "@/components/bookmarks/bookmark-list";
import { Loading } from "@/components/ui/loading";
import type { TourItem } from "@/lib/types/tour";

interface Bookmark {
  id: string;
  user_id: string;
  content_id: string;
  created_at: string;
}

async function BookmarksData() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  try {
    // users 테이블에서 user_id 조회
    const supabase = await createClerkSupabaseClient();
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !userData) {
      console.error("Error fetching user:", userError);
      return <BookmarkList bookmarks={[]} tourItems={[]} />;
    }

    // 북마크 목록 조회
    const { data: bookmarkData, error: bookmarkError } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userData.id)
      .order("created_at", { ascending: false });

    if (bookmarkError) {
      console.error("Error fetching bookmarks:", bookmarkError);
      return <BookmarkList bookmarks={[]} tourItems={[]} />;
    }

    if (!bookmarkData || bookmarkData.length === 0) {
      return <BookmarkList bookmarks={[]} tourItems={[]} />;
    }

    // 각 북마크의 관광지 정보 조회 (병렬 처리)
    const tourPromises = bookmarkData.map(async (bookmark) => {
      try {
        const response = await getDetailCommon({
          contentId: bookmark.content_id,
        });
        const items = response.response?.body?.items?.item;
        if (!items) return null;
        const detail = Array.isArray(items) ? items[0] : items;

        // TourItem 형태로 변환
        return {
          contentid: detail.contentid,
          contenttypeid: detail.contenttypeid,
          title: detail.title,
          addr1: detail.addr1,
          addr2: detail.addr2,
          areacode: detail.areacode || "",
          mapx: detail.mapx,
          mapy: detail.mapy,
          firstimage: detail.firstimage,
          firstimage2: detail.firstimage2,
          tel: detail.tel,
          modifiedtime: bookmark.created_at,
        } as TourItem;
      } catch (error) {
        console.error(
          `Error fetching tour detail for ${bookmark.content_id}:`,
          error
        );
        return null;
      }
    });

    const tourItems = (await Promise.all(tourPromises)).filter(
      (tour): tour is TourItem => tour !== null
    );

    return (
      <BookmarkList
        bookmarks={bookmarkData}
        tourItems={tourItems}
      />
    );
  } catch (error) {
    console.error("Error loading bookmarks:", error);
    return <BookmarkList bookmarks={[]} tourItems={[]} />;
  }
}

export default async function BookmarksPage() {
  const { userId } = await auth();

  // 인증되지 않은 사용자는 홈으로 리다이렉트
  if (!userId) {
    redirect("/");
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">내 북마크</h1>
        <p className="text-muted-foreground">
          저장한 관광지를 확인하고 관리할 수 있습니다.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading text="북마크 목록을 불러오는 중..." />
          </div>
        }
      >
        <BookmarksData />
      </Suspense>
    </main>
  );
}
