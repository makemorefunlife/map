/**
 * @file sitemap.ts
 * @description 동적 사이트맵 생성
 *
 * Next.js의 sitemap 기능을 사용하여 검색 엔진에 사이트 구조를 제공합니다.
 * 정적 페이지와 동적 페이지(관광지 상세페이지)를 포함합니다.
 */

import { MetadataRoute } from "next";
import { getAreaBasedList } from "@/lib/api/tour-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/stats`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  // 동적 페이지 (관광지 상세페이지)
  // 주의: 모든 관광지를 가져오면 API 호출이 많아질 수 있으므로,
  // 샘플 데이터만 포함하거나 인기 관광지만 포함하는 것을 권장합니다.
  try {
    // 각 지역별로 일부 관광지만 가져오기 (성능 고려)
    const areaCodes = ["1", "2", "3", "4", "5", "6", "7", "8"]; // 주요 지역 코드
    const tourPagesPromises = areaCodes.map(async (areaCode) => {
      try {
        const response = await getAreaBasedList({
          areaCode,
          numOfRows: 10, // 지역당 최대 10개만
          pageNo: 1,
        });
        const items = response.response?.body?.items?.item;
        if (!items) return [];
        const tours = Array.isArray(items) ? items : [items];
        return tours.map((tour: any) => ({
          url: `${baseUrl}/places/${tour.contentid}`,
          lastModified: tour.modifiedtime
            ? new Date(tour.modifiedtime)
            : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }));
      } catch (error) {
        console.error(`Error fetching tours for area ${areaCode}:`, error);
        return [];
      }
    });

    const tourPagesArrays = await Promise.all(tourPagesPromises);
    const tourPages = tourPagesArrays.flat();

    return [...staticPages, ...tourPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // 에러 발생 시 정적 페이지만 반환
    return staticPages;
  }
}

