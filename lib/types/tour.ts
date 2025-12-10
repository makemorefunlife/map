/**
 * @file tour.ts
 * @description 한국관광공사 API 관광지 관련 타입 정의
 *
 * 한국관광공사 공공 API 응답 구조에 맞춘 TypeScript 타입 정의입니다.
 * API 응답은 중첩된 구조를 가지고 있으며, 실제 데이터는 response.body.items.item 배열에 있습니다.
 */

/**
 * 관광 타입 ID 유니온 타입
 */
export type ContentTypeId = 12 | 14 | 15 | 25 | 28 | 32 | 38 | 39;

/**
 * 관광 타입 이름 매핑
 */
export const CONTENT_TYPE_NAMES: Record<ContentTypeId, string> = {
  12: "관광지",
  14: "문화시설",
  15: "축제/행사",
  25: "여행코스",
  28: "레포츠",
  32: "숙박",
  38: "쇼핑",
  39: "음식점",
};

/**
 * 지역코드 타입
 */
export type AreaCode = string;

/**
 * 관광지 목록 항목 (areaBasedList2, searchKeyword2 응답)
 */
export interface TourItem {
  contentid: string; // 콘텐츠 ID
  contenttypeid: string; // 콘텐츠 타입 ID
  title: string; // 제목
  addr1: string; // 주소
  addr2?: string; // 상세주소
  areacode: string; // 지역코드
  sigungucode?: string; // 시군구코드
  mapx: string; // 경도 (KATEC 좌표계, 정수형)
  mapy: string; // 위도 (KATEC 좌표계, 정수형)
  firstimage?: string; // 대표이미지1
  firstimage2?: string; // 대표이미지2
  tel?: string; // 전화번호
  cat1?: string; // 대분류
  cat2?: string; // 중분류
  cat3?: string; // 소분류
  modifiedtime: string; // 수정일
  createdtime?: string; // 생성일
  overview?: string; // 개요 (간단한 설명)
}

/**
 * 관광지 상세 정보 (detailCommon2 응답)
 */
export interface TourDetail {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1: string;
  addr2?: string;
  zipcode?: string;
  tel?: string;
  homepage?: string;
  overview?: string; // 개요 (긴 설명)
  firstimage?: string;
  firstimage2?: string;
  mapx: string;
  mapy: string;
  areacode?: string;
  sigungucode?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  createdtime?: string;
  modifiedtime?: string;
}

/**
 * 관광지 소개 정보 (detailIntro2 응답)
 * contentTypeId에 따라 필드가 다르므로 공통 필드만 정의
 */
export interface TourIntro {
  contentid: string;
  contenttypeid: string;
  // 공통 필드
  infocenter?: string; // 문의처
  parking?: string; // 주차 가능
  chkpet?: string; // 반려동물 동반 가능
  // 타입별 필드 (옵셔널)
  usetime?: string; // 이용시간
  restdate?: string; // 휴무일
  useseason?: string; // 이용시기
  usecost?: string; // 이용요금
  accomcount?: string; // 수용인원
  expagerange?: string; // 체험가능연령
  expguide?: string; // 체험안내
  heritage1?: string; // 세계문화유산
  heritage2?: string; // 세계자연유산
  heritage3?: string; // 세계기록유산
  infocenterlodging?: string; // 숙박 문의처
  checkintime?: string; // 체크인 시간
  checkouttime?: string; // 체크아웃 시간
  roomcount?: string; // 객실 수
  roomtype?: string; // 객실 유형
  subfacility?: string; // 부대시설
  reservationlodging?: string; // 예약 안내
  reservationurl?: string; // 예약 URL
  scalelodging?: string; // 규모
  // 기타 타입별 필드들...
}

/**
 * 관광지 이미지 정보 (detailImage2 응답)
 */
export interface TourImage {
  contentid: string;
  originimgurl: string; // 원본 이미지 URL
  imgname: string; // 이미지명
  serialnum?: string; // 일련번호
  smallimageurl?: string; // 썸네일 이미지 URL
}

/**
 * 반려동물 동반 여행 정보 (detailPetTour2 응답)
 */
export interface PetTourInfo {
  contentid: string;
  contenttypeid: string;
  chkpetleash?: string; // 애완동물 목줄 착용 여부
  chkpetsize?: string; // 애완동물 크기
  chkpetplace?: string; // 입장 가능 장소 (실내/실외)
  chkpetfee?: string; // 추가 요금
  petinfo?: string; // 기타 반려동물 정보
  parking?: string; // 주차장 정보
}

/**
 * 지역코드 정보 (areaCode2 응답)
 */
export interface AreaCodeItem {
  code: string; // 지역코드
  name: string; // 지역명
  rnum?: number; // 순번
}

/**
 * API 응답 메타데이터
 */
export interface ApiResponseMeta {
  totalCount: number; // 전체 개수
  pageNo: number; // 현재 페이지 번호
  numOfRows: number; // 페이지당 항목 수
  resultCode?: string; // 결과 코드
  resultMsg?: string; // 결과 메시지
}

/**
 * 관광지 목록 API 응답 구조
 */
export interface TourListResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: TourItem[] | TourItem | null;
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

/**
 * 관광지 상세 API 응답 구조
 */
export interface TourDetailResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: TourDetail[] | TourDetail | null;
      };
    };
  };
}

/**
 * 관광지 소개 API 응답 구조
 */
export interface TourIntroResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: TourIntro[] | TourIntro | null;
      };
    };
  };
}

/**
 * 관광지 이미지 API 응답 구조
 */
export interface TourImageResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: TourImage[] | TourImage | null;
      };
    };
  };
}

/**
 * 반려동물 정보 API 응답 구조
 */
export interface PetTourInfoResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: PetTourInfo[] | PetTourInfo | null;
      };
    };
  };
}

/**
 * 지역코드 API 응답 구조
 */
export interface AreaCodeResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: AreaCodeItem[] | AreaCodeItem | null;
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

/**
 * API 요청 파라미터 타입
 */
export interface AreaCodeParams {
  areaCode?: string; // 상위 지역코드 (시/도 조회 시 생략)
  numOfRows?: number; // 기본값 100
  pageNo?: number; // 기본값 1
}

export interface AreaBasedListParams {
  areaCode?: string; // 지역코드 (전체 조회 시 생략)
  contentTypeId?: ContentTypeId; // 관광 타입 ID
  numOfRows?: number; // 기본값 20
  pageNo?: number; // 기본값 1
  sigunguCode?: string; // 시군구코드 (선택)
  cat1?: string; // 대분류 (선택)
  cat2?: string; // 중분류 (선택)
  cat3?: string; // 소분류 (선택)
}

export interface SearchKeywordParams {
  keyword: string; // 검색어
  areaCode?: string; // 지역 필터
  contentTypeId?: ContentTypeId; // 타입 필터
  numOfRows?: number; // 기본값 20
  pageNo?: number; // 기본값 1
  cat1?: string; // 대분류 (선택)
  cat2?: string; // 중분류 (선택)
  cat3?: string; // 소분류 (선택)
}

export interface DetailCommonParams {
  contentId: string; // 관광지 ID
}

export interface DetailIntroParams {
  contentId: string; // 관광지 ID
  contentTypeId: ContentTypeId; // 관광 타입 ID
}

export interface DetailImageParams {
  contentId: string; // 관광지 ID
  imageYN?: "Y" | "N"; // 이미지 포함 여부
  subImageYN?: "Y" | "N"; // 서브 이미지 포함 여부
}

export interface DetailPetTourParams {
  contentId: string; // 관광지 ID
}

