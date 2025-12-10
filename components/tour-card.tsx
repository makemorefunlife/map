/**
 * @file tour-card.tsx
 * @description 관광지 카드 컴포넌트
 *
 * 개별 관광지 정보를 카드 형태로 표시하며, 클릭 시 상세페이지로 이동합니다.
 */

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CONTENT_TYPE_NAMES, type TourItem } from "@/lib/types/tour";
import { MapPin } from "lucide-react";

interface TourCardProps {
  tour: TourItem;
  onHover?: (tour: TourItem) => void;
}

export function TourCard({ tour, onHover }: TourCardProps) {
  const contentTypeId = parseInt(tour.contenttypeid) as keyof typeof CONTENT_TYPE_NAMES;
  const typeName = CONTENT_TYPE_NAMES[contentTypeId] || "기타";

  // 이미지 URL 처리 (상대 경로를 절대 경로로 변환)
  const imageUrl = tour.firstimage || tour.firstimage2;
  const fullImageUrl = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `https://${imageUrl}`
    : null;

  // 주소 조합
  const address = tour.addr2 ? `${tour.addr1} ${tour.addr2}` : tour.addr1;

  // 개요 텍스트 처리 (1-2줄)
  const overview = tour.overview
    ? tour.overview.length > 100
      ? `${tour.overview.substring(0, 100)}...`
      : tour.overview
    : null;

  return (
    <Link
      id={`tour-${tour.contentid}`}
      href={`/places/${tour.contentid}`}
      className="group block h-full"
      onMouseEnter={() => onHover?.(tour)}
    >
      <div className="h-full rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg overflow-hidden">
        {/* 썸네일 이미지 */}
        <div className="relative w-full aspect-video overflow-hidden bg-muted">
          {fullImageUrl ? (
            <Image
              src={fullImageUrl}
              alt={tour.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
              <MapPin className="h-12 w-12 opacity-50" />
            </div>
          )}
        </div>

        {/* 카드 내용 */}
        <div className="p-4 space-y-2">
          {/* 관광 타입 뱃지 */}
          <Badge variant="secondary" className="text-xs">
            {typeName}
          </Badge>

          {/* 관광지명 */}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {tour.title}
          </h3>

          {/* 주소 */}
          <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{address}</span>
          </div>

          {/* 간단한 개요 */}
          {overview && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {overview}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

