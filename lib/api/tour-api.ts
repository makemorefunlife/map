/**
 * @file tour-api.ts
 * @description 한국관광공사 공공 API 클라이언트
 *
 * 한국관광공사 KorService2 API를 호출하는 함수들을 제공합니다.
 * 모든 API 호출은 에러 처리 및 재시도 로직을 포함합니다.
 *
 * Base URL: https://apis.data.go.kr/B551011/KorService2
 */

import { getTourApiKey, getTourApiKeyServer } from "@/lib/utils/env";
import type {
  AreaCodeParams,
  AreaCodeResponse,
  AreaBasedListParams,
  TourListResponse,
  SearchKeywordParams,
  DetailCommonParams,
  TourDetailResponse,
  DetailIntroParams,
  TourIntroResponse,
  DetailImageParams,
  TourImageResponse,
  DetailPetTourParams,
  PetTourInfoResponse,
} from "@/lib/types/tour";

/**
 * API Base URL
 */
const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

/**
 * 공통 파라미터
 */
const COMMON_PARAMS = {
  MobileOS: "ETC",
  MobileApp: "MyTrip",
  _type: "json",
} as const;

/**
 * API 호출 타임아웃 (밀리초)
 */
const TIMEOUT_MS = 10000;

/**
 * 최대 재시도 횟수
 */
const MAX_RETRIES = 3;

/**
 * 재시도 지연 시간 계산 (exponential backoff)
 */
function getRetryDelay(attempt: number): number {
  return Math.min(1000 * Math.pow(2, attempt), 5000);
}

/**
 * API 호출 래퍼 함수 (에러 처리 및 재시도 포함)
 */
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `API 호출 실패: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // API 응답 에러 체크
      if (data.response?.header?.resultCode !== "0000") {
        const resultMsg = data.response?.header?.resultMsg || "알 수 없는 오류";
        throw new Error(`API 오류: ${resultMsg}`);
      }

      return data as T;
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("알 수 없는 오류가 발생했습니다.");

      // 마지막 시도가 아니면 재시도
      if (attempt < retries) {
        const delay = getRetryDelay(attempt);
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `API 호출 실패 (시도 ${attempt + 1}/${retries + 1}), ${delay}ms 후 재시도...`,
            error
          );
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("API 호출 실패");
}

/**
 * 쿼리 파라미터 생성
 */
function buildQueryParams(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
}

/**
 * KATEC 좌표계를 WGS84로 변환
 * @param mapx KATEC 경도 (정수형)
 * @param mapy KATEC 위도 (정수형)
 * @returns WGS84 좌표 { lng: number, lat: number }
 */
export function convertKATECToWGS84(
  mapx: string | number,
  mapy: string | number
): { lng: number; lat: number } {
  const x = typeof mapx === "string" ? parseFloat(mapx) : mapx;
  const y = typeof mapy === "string" ? parseFloat(mapy) : mapy;

  return {
    lng: x / 10000000,
    lat: y / 10000000,
  };
}

/**
 * 지역코드 조회 (areaCode2)
 * @param params 지역코드 조회 파라미터
 * @returns 지역코드 목록
 */
export async function getAreaCode(
  params: AreaCodeParams = {}
): Promise<AreaCodeResponse> {
  const serviceKey =
    typeof window === "undefined"
      ? getTourApiKeyServer()
      : getTourApiKey();

  const queryParams = buildQueryParams({
    serviceKey,
    ...COMMON_PARAMS,
    areaCode: params.areaCode,
    numOfRows: params.numOfRows || 100,
    pageNo: params.pageNo || 1,
  });

  const url = `${BASE_URL}/areaCode2?${queryParams}`;

  if (process.env.NODE_ENV === "development") {
    console.log("[API] getAreaCode 호출:", url);
  }

  return fetchWithRetry<AreaCodeResponse>(url, {
    next: { revalidate: 3600 }, // 1시간 캐싱
  });
}

/**
 * 지역 기반 관광지 목록 조회 (areaBasedList2)
 * @param params 지역 기반 목록 조회 파라미터
 * @returns 관광지 목록
 */
export async function getAreaBasedList(
  params: AreaBasedListParams
): Promise<TourListResponse> {
  const serviceKey =
    typeof window === "undefined"
      ? getTourApiKeyServer()
      : getTourApiKey();

  const queryParams = buildQueryParams({
    serviceKey,
    ...COMMON_PARAMS,
    areaCode: params.areaCode,
    contentTypeId: params.contentTypeId,
    sigunguCode: params.sigunguCode,
    cat1: params.cat1,
    cat2: params.cat2,
    cat3: params.cat3,
    numOfRows: params.numOfRows || 20,
    pageNo: params.pageNo || 1,
  });

  const url = `${BASE_URL}/areaBasedList2?${queryParams}`;

  if (process.env.NODE_ENV === "development") {
    console.log("[API] getAreaBasedList 호출:", url);
  }

  return fetchWithRetry<TourListResponse>(url, {
    next: { revalidate: 300 }, // 5분 캐싱
  });
}

/**
 * 키워드 검색 (searchKeyword2)
 * @param params 키워드 검색 파라미터
 * @returns 검색 결과 목록
 */
export async function searchKeyword(
  params: SearchKeywordParams
): Promise<TourListResponse> {
  const serviceKey =
    typeof window === "undefined"
      ? getTourApiKeyServer()
      : getTourApiKey();

  const queryParams = buildQueryParams({
    serviceKey,
    ...COMMON_PARAMS,
    keyword: params.keyword,
    areaCode: params.areaCode,
    contentTypeId: params.contentTypeId,
    cat1: params.cat1,
    cat2: params.cat2,
    cat3: params.cat3,
    numOfRows: params.numOfRows || 20,
    pageNo: params.pageNo || 1,
  });

  const url = `${BASE_URL}/searchKeyword2?${queryParams}`;

  if (process.env.NODE_ENV === "development") {
    console.log("[API] searchKeyword 호출:", url);
  }

  return fetchWithRetry<TourListResponse>(url, {
    next: { revalidate: 300 }, // 5분 캐싱
  });
}

/**
 * 관광지 공통 정보 조회 (detailCommon2)
 * @param params 상세 정보 조회 파라미터
 * @returns 관광지 상세 정보
 */
export async function getDetailCommon(
  params: DetailCommonParams
): Promise<TourDetailResponse> {
  const serviceKey =
    typeof window === "undefined"
      ? getTourApiKeyServer()
      : getTourApiKey();

  const queryParams = buildQueryParams({
    serviceKey,
    ...COMMON_PARAMS,
    contentId: params.contentId,
  });

  const url = `${BASE_URL}/detailCommon2?${queryParams}`;

  if (process.env.NODE_ENV === "development") {
    console.log("[API] getDetailCommon 호출:", url);
  }

  return fetchWithRetry<TourDetailResponse>(url, {
    next: { revalidate: 3600 }, // 1시간 캐싱
  });
}

/**
 * 관광지 소개 정보 조회 (detailIntro2)
 * @param params 소개 정보 조회 파라미터
 * @returns 관광지 소개 정보
 */
export async function getDetailIntro(
  params: DetailIntroParams
): Promise<TourIntroResponse> {
  const serviceKey =
    typeof window === "undefined"
      ? getTourApiKeyServer()
      : getTourApiKey();

  const queryParams = buildQueryParams({
    serviceKey,
    ...COMMON_PARAMS,
    contentId: params.contentId,
    contentTypeId: params.contentTypeId,
  });

  const url = `${BASE_URL}/detailIntro2?${queryParams}`;

  if (process.env.NODE_ENV === "development") {
    console.log("[API] getDetailIntro 호출:", url);
  }

  return fetchWithRetry<TourIntroResponse>(url, {
    next: { revalidate: 3600 }, // 1시간 캐싱
  });
}

/**
 * 관광지 이미지 목록 조회 (detailImage2)
 * @param params 이미지 목록 조회 파라미터
 * @returns 관광지 이미지 목록
 */
export async function getDetailImage(
  params: DetailImageParams
): Promise<TourImageResponse> {
  const serviceKey =
    typeof window === "undefined"
      ? getTourApiKeyServer()
      : getTourApiKey();

  const queryParams = buildQueryParams({
    serviceKey,
    ...COMMON_PARAMS,
    contentId: params.contentId,
    imageYN: params.imageYN || "Y",
    subImageYN: params.subImageYN || "Y",
  });

  const url = `${BASE_URL}/detailImage2?${queryParams}`;

  if (process.env.NODE_ENV === "development") {
    console.log("[API] getDetailImage 호출:", url);
  }

  return fetchWithRetry<TourImageResponse>(url, {
    next: { revalidate: 3600 }, // 1시간 캐싱
  });
}

/**
 * 반려동물 동반 여행 정보 조회 (detailPetTour2)
 * @param params 반려동물 정보 조회 파라미터
 * @returns 반려동물 동반 여행 정보 (데이터가 없으면 null)
 */
export async function getDetailPetTour(
  params: DetailPetTourParams
): Promise<PetTourInfoResponse | null> {
  const serviceKey =
    typeof window === "undefined"
      ? getTourApiKeyServer()
      : getTourApiKey();

  const queryParams = buildQueryParams({
    serviceKey,
    ...COMMON_PARAMS,
    contentId: params.contentId,
  });

  const url = `${BASE_URL}/detailPetTour2?${queryParams}`;

  if (process.env.NODE_ENV === "development") {
    console.log("[API] getDetailPetTour 호출:", url);
  }

  try {
    const response = await fetchWithRetry<PetTourInfoResponse>(url, {
      next: { revalidate: 3600 }, // 1시간 캐싱
    });

    // 응답이 비어있거나 에러인 경우 null 반환
    const items = response.response?.body?.items?.item;
    if (!items || (Array.isArray(items) && items.length === 0)) {
      return null;
    }

    return response;
  } catch (error) {
    // 반려동물 정보가 없는 경우는 에러가 아닌 null 반환
    if (process.env.NODE_ENV === "development") {
      console.warn("[API] getDetailPetTour 데이터 없음:", error);
    }
    return null;
  }
}

