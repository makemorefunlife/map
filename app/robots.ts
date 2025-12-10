/**
 * @file robots.ts
 * @description robots.txt 생성
 *
 * 검색 엔진 크롤러에게 사이트 크롤링 규칙을 제공합니다.
 */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // API 라우트는 크롤링 제외
          "/bookmarks", // 인증이 필요한 페이지는 제외 (선택 사항)
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

