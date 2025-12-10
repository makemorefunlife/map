/**
 * @file bookmark-card.tsx
 * @description 북마크 전용 관광지 카드 컴포넌트
 *
 * 북마크 목록에서 사용하는 카드로, 체크박스와 삭제 버튼을 포함합니다.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CONTENT_TYPE_NAMES, type TourItem } from "@/lib/types/tour";
import { MapPin } from "lucide-react";

interface BookmarkCardProps {
  tour: TourItem;
  isSelected: boolean;
  onSelect: (contentId: string) => void;
  onDelete: (contentId: string) => void;
}

export function BookmarkCard({
  tour,
  isSelected,
  onSelect,
  onDelete,
}: BookmarkCardProps) {
  const contentTypeId = parseInt(
    tour.contenttypeid
  ) as keyof typeof CONTENT_TYPE_NAMES;
  const typeName = CONTENT_TYPE_NAMES[contentTypeId] || "기타";

  // 이미지 URL 처리
  const imageUrl = tour.firstimage || tour.firstimage2;
  const fullImageUrl = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `https://${imageUrl}`
    : null;

  // 주소 조합
  const address = tour.addr2 ? `${tour.addr1} ${tour.addr2}` : tour.addr1;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(tour.contentid);
  };

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(tour.contentid);
  };

  return (
    <div className="group relative h-full rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-lg overflow-hidden">
      {/* 체크박스 */}
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(tour.contentid)}
          onClick={handleCheckboxChange}
          className="bg-background/80 backdrop-blur-sm"
        />
      </div>

      {/* 삭제 버튼 */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* 카드 링크 */}
      <Link
        href={`/places/${tour.contentid}`}
        className="block h-full"
      >
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
        </div>
      </Link>
    </div>
  );
}

