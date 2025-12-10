/**
 * @file detail-pet-tour.tsx
 * @description 반려동물 동반 여행 정보 섹션
 *
 * 반려동물과 함께 여행 가능한 관광지 정보를 표시합니다.
 */

import { Heart, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PetTourInfo } from "@/lib/types/tour";

interface DetailPetTourProps {
  petInfo: PetTourInfo;
}

export function DetailPetTour({ petInfo }: DetailPetTourProps) {
  // 반려동물 동반 가능 여부 확인
  const isPetAllowed =
    petInfo.chkpetleash === "Y" ||
    petInfo.chkpetplace ||
    petInfo.chkpetfee !== undefined;

  if (!isPetAllowed && !petInfo.petinfo) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">반려동물 동반 정보</h2>
      </div>

      {/* 반려동물 동반 가능 여부 */}
      {isPetAllowed && (
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-base px-3 py-1">
            🐾 반려동물 동반 가능
          </Badge>
        </div>
      )}

      {/* 반려동물 크기 제한 */}
      {petInfo.chkpetsize && (
        <div>
          <p className="text-sm font-medium mb-1">반려동물 크기</p>
          <Badge variant="secondary">{petInfo.chkpetsize}</Badge>
        </div>
      )}

      {/* 입장 가능 장소 */}
      {petInfo.chkpetplace && (
        <div>
          <p className="text-sm font-medium mb-1">입장 가능 장소</p>
          <p className="text-sm text-muted-foreground">{petInfo.chkpetplace}</p>
        </div>
      )}

      {/* 추가 요금 */}
      {petInfo.chkpetfee && (
        <div>
          <p className="text-sm font-medium mb-1">반려동물 동반 추가 요금</p>
          <p className="text-sm text-muted-foreground">{petInfo.chkpetfee}</p>
        </div>
      )}

      {/* 반려동물 전용 시설 정보 */}
      {petInfo.petinfo && (
        <div>
          <p className="text-sm font-medium mb-1">반려동물 정보</p>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {petInfo.petinfo}
          </p>
        </div>
      )}

      {/* 주차장 정보 */}
      {petInfo.parking && (
        <div>
          <p className="text-sm font-medium mb-1">주차장 정보</p>
          <p className="text-sm text-muted-foreground">{petInfo.parking}</p>
        </div>
      )}

      {/* 주의사항 */}
      <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
              주의사항
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              반려동물 동반 시 목줄 착용 및 배변 봉투 준비를 부탁드립니다.
              관광지별로 반려동물 정책이 다를 수 있으니 방문 전 확인해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

