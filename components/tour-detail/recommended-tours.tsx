/**
 * @file recommended-tours.tsx
 * @description 추천 관광지 섹션
 *
 * 같은 지역 또는 타입의 다른 관광지를 추천하는 컴포넌트입니다.
 */

import { Suspense } from "react";
import { getAreaBasedList } from "@/lib/api/tour-api";
import { TourList } from "@/components/tour-list";
import { Skeleton } from "@/components/ui/skeleton";
import type { TourItem, ContentTypeId } from "@/lib/types/tour";

interface RecommendedToursProps {
  currentContentId: string;
  areaCode?: string;
  contentTypeId?: ContentTypeId;
}

// API 응답에서 TourItem 배열 추출
function extractTourItems(response: any): TourItem[] {
  const items = response.response?.body?.items?.item;
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

async function RecommendedToursData({
  currentContentId,
  areaCode,
  contentTypeId,
}: RecommendedToursProps) {
  try {
    const params: any = {
      numOfRows: 8, // 추천 관광지 8개만 표시
      pageNo: 1,
    };

    // 같은 지역과 타입으로 필터링 (둘 다 있으면 둘 다 적용, 하나만 있으면 그것만 적용)
    if (areaCode && areaCode !== "all") {
      params.areaCode = areaCode;
    }
    if (contentTypeId) {
      params.contentTypeId = contentTypeId;
    }

    const response = await getAreaBasedList(params);
    const tours = extractTourItems(response);

    // 현재 관광지 제외
    const filteredTours = tours.filter(
      (tour) => tour.contentid !== currentContentId
    ).slice(0, 6); // 최대 6개만 표시

    if (filteredTours.length === 0) {
      return null;
    }

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">추천 관광지</h2>
        <TourList tours={filteredTours} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching recommended tours:", error);
    return null;
  }
}

export function RecommendedTours({
  currentContentId,
  areaCode,
  contentTypeId,
}: RecommendedToursProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-48 w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <RecommendedToursData
        currentContentId={currentContentId}
        areaCode={areaCode}
        contentTypeId={contentTypeId}
      />
    </Suspense>
  );
}

