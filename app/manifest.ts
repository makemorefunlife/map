/**
 * @file manifest.ts
 * @description PWA 매니페스트 파일
 *
 * Progressive Web App 기능을 위한 매니페스트를 생성합니다.
 */

import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My Trip - 한국 관광지 정보 서비스",
    short_name: "My Trip",
    description: "전국 관광지 정보를 검색하고 지도에서 확인하세요",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    orientation: "portrait-primary",
    categories: ["travel", "tourism"],
    lang: "ko",
    dir: "ltr",
  };
}

