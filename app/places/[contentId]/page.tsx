/**
 * @file page.tsx
 * @description 관광지 상세페이지
 *
 * 관광지의 상세 정보를 표시하는 페이지입니다.
 * 기본 정보, 운영 정보, 이미지 갤러리, 지도 등을 포함합니다.
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import {
  getDetailCommon,
  getDetailIntro,
  getDetailImage,
  getDetailPetTour,
} from "@/lib/api/tour-api";
import type { ContentTypeId } from "@/lib/types/tour";
import { DetailInfo } from "@/components/tour-detail/detail-info";
import { DetailIntro } from "@/components/tour-detail/detail-intro";
import { DetailGallery } from "@/components/tour-detail/detail-gallery";
import { DetailMap } from "@/components/tour-detail/detail-map";
import { DetailPetTour } from "@/components/tour-detail/detail-pet-tour";
import { ShareButton } from "@/components/tour-detail/share-button";
import { BookmarkButton } from "@/components/bookmarks/bookmark-button";
import type { Metadata } from "next";

interface PlacePageProps {
  params: Promise<{ contentId: string }>;
}

// API 응답에서 TourDetail 추출
function extractTourDetail(response: any) {
  const items = response.response?.body?.items?.item;
  if (!items) return null;
  return Array.isArray(items) ? items[0] : items;
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: PlacePageProps): Promise<Metadata> {
  try {
    const { contentId } = await params;
    const response = await getDetailCommon({ contentId });
    const detail = extractTourDetail(response);

    if (!detail) {
      return {
        title: "관광지 정보를 찾을 수 없습니다",
      };
    }

    const title = detail.title || "관광지 정보";
    const description = detail.overview
      ? detail.overview.substring(0, 100).replace(/\n/g, " ")
      : `${title}의 상세 정보를 확인하세요.`;
    const image = detail.firstimage || detail.firstimage2 || "";

    return {
      title: `${title} - My Trip`,
      description,
      openGraph: {
        title,
        description,
        images: image ? [{ url: image, width: 1200, height: 630 }] : [],
        url: `https://yourdomain.com/places/${contentId}`,
        type: "website",
        locale: "ko_KR",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "관광지 정보",
    };
  }
}

async function TourDetailData({ contentId }: { contentId: string }) {
  try {
    // 병렬로 모든 데이터 로드
    const [commonResponse, introResponse, imageResponse, petResponse] =
      await Promise.all([
        getDetailCommon({ contentId }),
        getDetailCommon({ contentId }).then(async (common) => {
          const detail = extractTourDetail(common);
          if (!detail) return null;
          const contentTypeId = parseInt(
            detail.contenttypeid
          ) as ContentTypeId;
          return getDetailIntro({
            contentId,
            contentTypeId,
          });
        }),
        getDetailImage({ contentId }),
        getDetailPetTour({ contentId }),
      ]);

    const detail = extractTourDetail(commonResponse);
    if (!detail) {
      notFound();
    }

    const intro = extractTourDetail(introResponse);
    const images = imageResponse.response?.body?.items?.item;
    const imageList = Array.isArray(images) ? images : images ? [images] : [];
    const petInfo = petResponse
      ? extractTourDetail(petResponse)
      : null;

    const contentTypeId = parseInt(detail.contenttypeid) as ContentTypeId;

    return (
      <div className="space-y-8">
        {/* 헤더 영역 (뒤로가기, 공유, 북마크) */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              뒤로가기
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <ShareButton url={`/places/${contentId}`} title={detail.title} />
            <BookmarkButton contentId={contentId} />
          </div>
        </div>

        {/* 기본 정보 섹션 */}
        <DetailInfo detail={detail} />

        {/* 운영 정보 섹션 */}
        {intro && (
          <DetailIntro intro={intro} contentTypeId={contentTypeId} />
        )}

        {/* 이미지 갤러리 */}
        {imageList.length > 0 && (
          <DetailGallery images={imageList} contentId={contentId} />
        )}

        {/* 지도 섹션 */}
        <DetailMap
          contentId={contentId}
          title={detail.title}
          mapx={detail.mapx}
          mapy={detail.mapy}
          addr1={detail.addr1}
        />

        {/* 반려동물 정보 섹션 */}
        {petInfo && <DetailPetTour petInfo={petInfo} />}
      </div>
    );
  } catch (error) {
    console.error("Error fetching tour detail:", error);
    notFound();
  }
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { contentId } = await params;

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading text="관광지 정보를 불러오는 중..." />
          </div>
        }
      >
        <TourDetailData contentId={contentId} />
      </Suspense>
    </main>
  );
}

