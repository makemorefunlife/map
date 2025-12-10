/**
 * @file page.tsx
 * @description 홈페이지 - 관광지 목록
 *
 * 관광지 목록을 표시하고, 필터, 검색, 지도 기능을 제공합니다.
 */

import { Suspense } from "react";
import { TourListWithMap } from "@/components/tour-list-with-map";
import { TourFilters } from "@/components/tour-filters";
import { TourSearch } from "@/components/tour-search";
import { getAreaCode, getAreaBasedList, searchKeyword } from "@/lib/api/tour-api";
import type { TourItem, ContentTypeId } from "@/lib/types/tour";
import { Error } from "@/components/ui/error";

interface HomePageProps {
  searchParams: Promise<{
    areaCode?: string;
    contentTypeId?: string;
    keyword?: string;
    sort?: string;
    page?: string;
  }>;
}

// 데이터 정렬 함수
function sortTours(tours: TourItem[], sort: string): TourItem[] {
  if (sort === "name") {
    return [...tours].sort((a, b) => a.title.localeCompare(b.title));
  }
  // 최신순 (기본값)
  return [...tours].sort(
    (a, b) =>
      new Date(b.modifiedtime).getTime() -
      new Date(a.modifiedtime).getTime()
  );
}

// API 응답에서 TourItem 배열 추출
function extractTourItems(response: any): TourItem[] {
  const items = response.response?.body?.items?.item;
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

async function TourListData({
  areaCode,
  contentTypeId,
  keyword,
  sort,
  page,
}: {
  areaCode?: string;
  contentTypeId?: string;
  keyword?: string;
  sort?: string;
  page?: string;
}) {
  try {
    let tours: TourItem[] = [];
    let totalCount = 0;
    const pageNo = parseInt(page || "1");
    const numOfRows = 20;

    // 검색어가 있으면 검색 API 사용
    if (keyword) {
      const params: any = {
        keyword,
        numOfRows,
        pageNo,
      };
      if (areaCode && areaCode !== "all") {
        params.areaCode = areaCode;
      }
      if (contentTypeId) {
        const ids = contentTypeId.split(",").map(Number);
        if (ids.length === 1) {
          params.contentTypeId = ids[0] as ContentTypeId;
        }
      }
      const response = await searchKeyword(params);
      tours = extractTourItems(response);
      totalCount = response.response?.body?.totalCount || 0;
    } else {
      // 검색어가 없으면 지역 기반 목록 API 사용
      const params: any = {
        numOfRows,
        pageNo,
      };
      if (areaCode && areaCode !== "all") {
        params.areaCode = areaCode;
      }
      if (contentTypeId) {
        const ids = contentTypeId.split(",").map(Number);
        if (ids.length === 1) {
          params.contentTypeId = ids[0] as ContentTypeId;
        }
      }
      const response = await getAreaBasedList(params);
      tours = extractTourItems(response);
      totalCount = response.response?.body?.totalCount || 0;
    }

    // 정렬 적용
    const sortedTours = sortTours(tours, sort || "latest");

    return (
      <TourListWithMap
        tours={sortedTours}
        totalCount={totalCount}
        currentPage={pageNo}
        pageSize={numOfRows}
      />
    );
  } catch (error) {
    console.error("Error fetching tours:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "관광지 목록을 불러오는 중 오류가 발생했습니다.";
    return (
      <Error
        message={errorMessage}
        onRetry={() => window.location.reload()}
      />
    );
  }
}

async function AreaCodesData() {
  try {
    const response = await getAreaCode({ numOfRows: 100 });
    const items = response.response?.body?.items?.item;
    const areaCodes = Array.isArray(items) ? items : items ? [items] : [];
    return <TourFilters areaCodes={areaCodes} />;
  } catch (error) {
    console.error("Error fetching area codes:", error);
    return <TourFilters areaCodes={[]} />;
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const {
    areaCode,
    contentTypeId,
    keyword,
    sort = "latest",
    page = "1",
  } = params;

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 검색창 */}
      <div className="mb-8">
        <Suspense fallback={<div className="h-10 bg-muted animate-pulse rounded" />}>
          <TourSearch initialKeyword={keyword || ""} />
        </Suspense>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 필터 사이드바 */}
        <aside className="lg:col-span-1">
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold mb-4">필터</h2>
            <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded" />}>
              <AreaCodesData />
            </Suspense>
          </div>
        </aside>

        {/* 관광지 목록 및 지도 */}
        <div className="lg:col-span-3">
          <Suspense fallback={<TourListWithMap tours={[]} isLoading />}>
            <TourListData
              areaCode={areaCode}
              contentTypeId={contentTypeId}
              keyword={keyword}
              sort={sort}
              page={page}
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
