/**
 * @file stats.ts
 * @description 통계 대시보드 관련 타입 정의
 *
 * 관광지 통계 데이터를 시각화하기 위한 타입 정의입니다.
 */

/**
 * 지역별 통계 정보
 */
export interface RegionStats {
  areaCode: string; // 지역코드
  areaName: string; // 지역명
  count: number; // 관광지 개수
}

/**
 * 관광 타입별 통계 정보
 */
export interface TypeStats {
  contentTypeId: string; // 관광 타입 ID
  typeName: string; // 관광 타입 이름
  count: number; // 관광지 개수
}

/**
 * 통계 요약 정보
 */
export interface StatsSummary {
  totalCount: number; // 전체 관광지 수
  topRegions: RegionStats[]; // 상위 지역 (최대 3개)
  topTypes: TypeStats[]; // 상위 타입 (최대 3개)
  lastUpdated: string; // 마지막 업데이트 시간 (ISO string)
}

