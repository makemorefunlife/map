/**
 * @file tour-filters.tsx
 * @description 관광지 필터 컴포넌트
 *
 * 지역, 관광 타입, 정렬 옵션을 제공하는 필터 UI입니다.
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTENT_TYPE_NAMES, type ContentTypeId } from "@/lib/types/tour";
import type { AreaCodeItem } from "@/lib/types/tour";

interface TourFiltersProps {
  areaCodes?: AreaCodeItem[];
  isLoadingAreaCodes?: boolean;
}

export function TourFilters({
  areaCodes = [],
  isLoadingAreaCodes = false,
}: TourFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 필터 값
  const currentAreaCode = searchParams.get("areaCode") || "all";
  const currentContentTypeIds = useMemo(() => {
    const ids = searchParams.get("contentTypeId");
    return ids ? ids.split(",").map(Number) : [];
  }, [searchParams]);
  const currentSort = searchParams.get("sort") || "latest";

  // 필터 업데이트 함수
  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.set("page", "1"); // 필터 변경 시 첫 페이지로
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  // 관광 타입 토글
  const toggleContentType = useCallback(
    (typeId: ContentTypeId) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentIds = currentContentTypeIds;
      const newIds = currentIds.includes(typeId)
        ? currentIds.filter((id) => id !== typeId)
        : [...currentIds, typeId];

      if (newIds.length === 0) {
        params.delete("contentTypeId");
      } else {
        params.set("contentTypeId", newIds.join(","));
      }
      params.set("page", "1");
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams, currentContentTypeIds]
  );

  return (
    <div className="space-y-4">
      {/* 지역 필터 */}
      <div>
        <label className="text-sm font-medium mb-2 block">지역</label>
        <Select
          value={currentAreaCode}
          onValueChange={(value) => updateFilter("areaCode", value)}
          disabled={isLoadingAreaCodes}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="지역 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {areaCodes.map((area) => (
              <SelectItem key={area.code} value={area.code}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 관광 타입 필터 */}
      <div>
        <label className="text-sm font-medium mb-2 block">관광 타입</label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={currentContentTypeIds.length === 0 ? "default" : "outline"}
            size="sm"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("contentTypeId");
              params.set("page", "1");
              router.push(`/?${params.toString()}`);
            }}
          >
            전체
          </Button>
          {Object.entries(CONTENT_TYPE_NAMES).map(([id, name]) => {
            const typeId = parseInt(id) as ContentTypeId;
            const isSelected = currentContentTypeIds.includes(typeId);
            return (
              <Button
                key={id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => toggleContentType(typeId)}
              >
                {name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div>
        <label className="text-sm font-medium mb-2 block">정렬</label>
        <Select
          value={currentSort}
          onValueChange={(value) => updateFilter("sort", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">최신순</SelectItem>
            <SelectItem value="name">이름순</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

