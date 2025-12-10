/**
 * @file naver-map.tsx
 * @description 네이버 지도 컴포넌트
 *
 * 관광지 목록을 네이버 지도에 마커로 표시하고, 리스트와 연동합니다.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { convertKATECToWGS84 } from "@/lib/api/tour-api";
import type { TourItem } from "@/lib/types/tour";

interface NaverMapProps {
  tours: TourItem[];
  selectedTourId?: string;
  onMarkerClick?: (tour: TourItem) => void;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

declare global {
  interface Window {
    naver: any;
  }
}

export function NaverMap({
  tours,
  selectedTourId,
  onMarkerClick,
  initialCenter = { lat: 36.5, lng: 127.5 }, // 대한민국 중심
  initialZoom = 7,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindows, setInfoWindows] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 네이버 지도 스크립트 로드
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 이미 로드된 경우
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

    return () => {
      // cleanup은 하지 않음 (다른 컴포넌트에서도 사용 가능)
    };
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.naver) return;

    const mapInstance = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
      zoom: initialZoom,
    });

    setMap(mapInstance);
  }, [isLoaded, initialCenter, initialZoom]);

  // 마커 생성 및 업데이트
  useEffect(() => {
    if (!map || !window.naver || tours.length === 0) return;

    // 기존 마커 및 인포윈도우 제거
    markers.forEach((marker) => marker.setMap(null));
    infoWindows.forEach((infoWindow) => infoWindow.close());

    const newMarkers: any[] = [];
    const newInfoWindows: any[] = [];

    tours.forEach((tour) => {
      const coords = convertKATECToWGS84(tour.mapx, tour.mapy);
      const position = new window.naver.maps.LatLng(coords.lat, coords.lng);

      // 마커 생성
      const marker = new window.naver.maps.Marker({
        position,
        map,
        title: tour.title,
      });

      // 인포윈도우 생성
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${tour.title}</h3>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${tour.addr1}</p>
            <button 
              onclick="window.open('/places/${tour.contentid}', '_blank')"
              style="padding: 4px 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
            >
              상세보기
            </button>
          </div>
        `,
      });

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, "click", () => {
        // 다른 인포윈도우 닫기
        newInfoWindows.forEach((iw) => iw.close());
        infoWindow.open(map, marker);
        onMarkerClick?.(tour);
      });

      // 선택된 관광지 강조
      if (selectedTourId === tour.contentid) {
        infoWindow.open(map, marker);
        map.setCenter(position);
        map.setZoom(15);
      }

      newMarkers.push(marker);
      newInfoWindows.push(infoWindow);
    });

    setMarkers(newMarkers);
    setInfoWindows(newInfoWindows);

    // 모든 마커가 보이도록 지도 범위 조정
    if (newMarkers.length > 0) {
      const bounds = new window.naver.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
    }
  }, [map, tours, selectedTourId, onMarkerClick]);

  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[600px] rounded-lg overflow-hidden border">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

