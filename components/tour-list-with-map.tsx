/**
 * @file tour-list-with-map.tsx
 * @description 관광지 목록과 지도를 함께 표시하는 컴포넌트
 *
 * 리스트와 지도를 연동하여 선택된 관광지를 강조 표시합니다.
 */

"use client";

import { useState } from "react";
import { TourList } from "@/components/tour-list";
import { NaverMap } from "@/components/naver-map";
import { TourPagination } from "@/components/tour-pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TourItem } from "@/lib/types/tour";

interface TourListWithMapProps {
  tours: TourItem[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
}

export function TourListWithMap({
  tours,
  isLoading,
  error,
  onRetry,
  totalCount = 0,
  currentPage = 1,
  pageSize = 20,
}: TourListWithMapProps) {
  const [selectedTourId, setSelectedTourId] = useState<string | undefined>();

  const handleCardHover = (tour: TourItem) => {
    setSelectedTourId(tour.contentid);
  };

  const handleMarkerClick = (tour: TourItem) => {
    setSelectedTourId(tour.contentid);
    // 해당 카드로 스크롤 (선택 사항)
    const element = document.getElementById(`tour-${tour.contentid}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="space-y-4">
      {/* 데스크톱: 분할 레이아웃 */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6">
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          <TourList
            tours={tours}
            isLoading={isLoading}
            error={error}
            onRetry={onRetry}
            onCardHover={handleCardHover}
          />
          {totalCount > 0 && (
            <TourPagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={pageSize}
              isLoading={isLoading}
            />
          )}
        </div>
        <div className="sticky top-4 h-[600px]">
          <NaverMap
            tours={tours}
            selectedTourId={selectedTourId}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      </div>

      {/* 모바일/태블릿: 탭 형태 */}
      <div className="lg:hidden">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">목록</TabsTrigger>
            <TabsTrigger value="map">지도</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-4">
            <TourList
              tours={tours}
              isLoading={isLoading}
              error={error}
              onRetry={onRetry}
              onCardHover={handleCardHover}
            />
            {totalCount > 0 && (
              <TourPagination
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={pageSize}
                isLoading={isLoading}
              />
            )}
          </TabsContent>
          <TabsContent value="map" className="mt-4">
            <div className="h-[400px]">
              <NaverMap
                tours={tours}
                selectedTourId={selectedTourId}
                onMarkerClick={handleMarkerClick}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

