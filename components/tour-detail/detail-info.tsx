/**
 * @file detail-info.tsx
 * @description 관광지 기본 정보 섹션
 *
 * 관광지의 기본 정보를 표시합니다 (이름, 이미지, 주소, 전화번호 등).
 */

"use client";

import Image from "next/image";
import { Copy, Phone, ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { TourDetail } from "@/lib/types/tour";
import { CONTENT_TYPE_NAMES } from "@/lib/types/tour";

interface DetailInfoProps {
  detail: TourDetail;
}

export function DetailInfo({ detail }: DetailInfoProps) {
  // 이미지 URL 처리
  const imageUrl = detail.firstimage || detail.firstimage2;
  const fullImageUrl = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `https://${imageUrl}`
    : null;

  // 주소 조합
  const address = detail.addr2
    ? `${detail.addr1} ${detail.addr2}`
    : detail.addr1;
  const fullAddress = detail.zipcode
    ? `[${detail.zipcode}] ${address}`
    : address;

  // 주소 복사 기능
  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      toast.success("주소가 복사되었습니다.");
    } catch (error) {
      // Fallback: 텍스트 선택
      const textArea = document.createElement("textarea");
      textArea.value = fullAddress;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("주소가 복사되었습니다.");
    }
  };

  // 관광 타입 이름
  const contentTypeId = parseInt(detail.contenttypeid) as keyof typeof CONTENT_TYPE_NAMES;
  const typeName = CONTENT_TYPE_NAMES[contentTypeId] || "기타";

  return (
    <div className="space-y-6">
      {/* 관광지명 */}
      <h1 className="text-3xl md:text-4xl font-bold">{detail.title}</h1>

      {/* 대표 이미지 */}
      {fullImageUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
          <Image
            src={fullImageUrl}
            alt={detail.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}

      {/* 기본 정보 카드 */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        {/* 관광 타입 및 카테고리 */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">{typeName}</Badge>
          {detail.cat1 && <Badge variant="secondary">{detail.cat1}</Badge>}
          {detail.cat2 && <Badge variant="secondary">{detail.cat2}</Badge>}
          {detail.cat3 && <Badge variant="secondary">{detail.cat3}</Badge>}
        </div>

        {/* 주소 */}
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">주소</p>
            <p className="text-base">{fullAddress}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-8 gap-1"
              onClick={handleCopyAddress}
            >
              <Copy className="h-3 w-3" />
              주소 복사
            </Button>
          </div>
        </div>

        {/* 전화번호 */}
        {detail.tel && (
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground mb-1">전화번호</p>
              <a
                href={`tel:${detail.tel}`}
                className="text-base hover:text-primary transition-colors"
              >
                {detail.tel}
              </a>
            </div>
          </div>
        )}

        {/* 홈페이지 */}
        {detail.homepage && (
          <div className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground mb-1">홈페이지</p>
              <a
                href={detail.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base hover:text-primary transition-colors break-all"
              >
                {detail.homepage}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 개요 */}
      {detail.overview && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">개요</h2>
          <div
            className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: detail.overview }}
          />
        </div>
      )}
    </div>
  );
}

