/**
 * @file detail-map.tsx
 * @description 관광지 지도 섹션
 *
 * 해당 관광지의 위치를 네이버 지도에 표시하고 길찾기 기능을 제공합니다.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { convertKATECToWGS84 } from "@/lib/api/tour-api";

interface DetailMapProps {
  contentId: string;
  title: string;
  mapx: string;
  mapy: string;
  addr1: string;
}

declare global {
  interface Window {
    naver: any;
  }
}

export function DetailMap({
  contentId,
  title,
  mapx,
  mapy,
  addr1,
}: DetailMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 네이버 지도 스크립트 로드
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.naver) {
      setIsLoaded(true);
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    if (!clientId) {
      console.error("NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 환경변수가 설정되지 않았습니다.");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // 지도 초기화 및 마커 표시
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.naver || mapInstanceRef.current) return;

    const coords = convertKATECToWGS84(mapx, mapy);
    const position = new window.naver.maps.LatLng(coords.lat, coords.lng);

    // 지도 생성
    const mapInstance = new window.naver.maps.Map(mapRef.current, {
      center: position,
      zoom: 15,
    });

    mapInstanceRef.current = mapInstance;

    // 마커 생성
    const marker = new window.naver.maps.Marker({
      position,
      map: mapInstance,
      title,
    });

    // 인포윈도우 생성
    const infoWindow = new window.naver.maps.InfoWindow({
      content: `
        <div style="padding: 10px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${title}</h3>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${addr1}</p>
        </div>
      `,
    });

    infoWindow.open(mapInstance, marker);
  }, [isLoaded, mapx, mapy, title, addr1]);

  // 길찾기 URL 생성
  const coords = convertKATECToWGS84(mapx, mapy);
  const directionsUrl = `https://map.naver.com/v5/directions/-/${coords.lng},${coords.lat}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">위치</h2>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => window.open(directionsUrl, "_blank")}
        >
          <Navigation className="h-4 w-4" />
          길찾기
        </Button>
      </div>
      <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border bg-muted">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  );
}

