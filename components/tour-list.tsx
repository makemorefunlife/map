/**
 * @file tour-list.tsx
 * @description 관광지 목록 컴포넌트
 *
 * 관광지 목록을 그리드 레이아웃으로 표시하며, 로딩, 빈 상태, 에러 상태를 처리합니다.
 */

import { TourCard } from "@/components/tour-card";
import { Error } from "@/components/ui/error";
import { Skeleton } from "@/components/ui/skeleton";
import type { TourItem } from "@/lib/types/tour";

interface TourListProps {
  tours: TourItem[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onCardHover?: (tour: TourItem) => void;
}

export function TourList({
  tours,
  isLoading = false,
  error = null,
  onRetry,
  onCardHover,
}: TourListProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg border overflow-hidden">
            <Skeleton className="w-full aspect-video" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Error
        message="관광지 목록을 불러오는 중 오류가 발생했습니다."
        onRetry={onRetry}
      />
    );
  }

  // 빈 상태
  if (tours.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <svg
            className="h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">관광지가 없습니다</h3>
        <p className="text-sm text-muted-foreground">
          검색 조건을 변경해보세요.
        </p>
      </div>
    );
  }

  // 목록 표시
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {tours.map((tour) => (
        <TourCard key={tour.contentid} tour={tour} onHover={onCardHover} />
      ))}
    </div>
  );
}

