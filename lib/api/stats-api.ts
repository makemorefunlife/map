/**
 * @file stats-api.ts
 * @description 통계 데이터 수집 API
 *
 * 지역별, 타입별 관광지 통계를 수집하는 함수들을 제공합니다.
 */

import { getAreaBasedList } from "./tour-api";
import { getAreaCode } from "./tour-api";
import type { RegionStats, TypeStats, StatsSummary } from "@/lib/types/stats";
import { CONTENT_TYPE_NAMES, type ContentTypeId } from "@/lib/types/tour";

/**
 * 지역별 관광지 개수 집계
 */
export async function getRegionStats(): Promise<RegionStats[]> {
  try {
    // 지역 코드 목록 가져오기
    const areaCodeResponse = await getAreaCode();
    const areaCodes = areaCodeResponse.response?.body?.items?.item;
    
    if (!areaCodes) {
      return [];
    }

    const areaCodeList = Array.isArray(areaCodes) ? areaCodes : [areaCodes];

    // 각 지역별로 API 호출 (병렬 처리)
    const statsPromises = areaCodeList.map(async (area) => {
      try {
        const response = await getAreaBasedList({
          areaCode: area.code,
          numOfRows: 1,
          pageNo: 1,
        });
        
        const totalCount = response.response?.body?.totalCount || 0;
        
        return {
          areaCode: area.code,
          areaName: area.name,
          count: totalCount,
        };
      } catch (error) {
        console.error(`Error fetching stats for area ${area.code}:`, error);
        return {
          areaCode: area.code,
          areaName: area.name,
          count: 0,
        };
      }
    });

    const stats = await Promise.all(statsPromises);
    
    // 개수 기준 내림차순 정렬
    return stats.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Error fetching region stats:", error);
    return [];
  }
}

/**
 * 타입별 관광지 개수 집계
 */
export async function getTypeStats(): Promise<TypeStats[]> {
  try {
    // 각 타입별로 API 호출 (병렬 처리)
    const contentTypeIds = Object.keys(CONTENT_TYPE_NAMES).map(Number) as ContentTypeId[];
    const statsPromises = contentTypeIds.map(async (contentTypeId) => {
      try {
        const response = await getAreaBasedList({
          contentTypeId,
          numOfRows: 1,
          pageNo: 1,
        });
        
        const totalCount = response.response?.body?.totalCount || 0;
        
        return {
          contentTypeId: contentTypeId.toString(),
          typeName: CONTENT_TYPE_NAMES[contentTypeId] || `타입 ${contentTypeId}`,
          count: totalCount,
        };
      } catch (error) {
        console.error(`Error fetching stats for type ${contentTypeId}:`, error);
        return {
          contentTypeId: contentTypeId.toString(),
          typeName: CONTENT_TYPE_NAMES[contentTypeId] || `타입 ${contentTypeId}`,
          count: 0,
        };
      }
    });

    const stats = await Promise.all(statsPromises);
    
    // 개수 기준 내림차순 정렬
    return stats.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Error fetching type stats:", error);
    return [];
  }
}

/**
 * 전체 통계 요약
 */
export async function getStatsSummary(): Promise<StatsSummary> {
  try {
    // 병렬로 지역 및 타입 통계 수집
    const [regionStats, typeStats] = await Promise.all([
      getRegionStats(),
      getTypeStats(),
    ]);

    // 전체 관광지 수 계산 (지역별 합계)
    const totalCount = regionStats.reduce((sum, stat) => sum + stat.count, 0);

    // Top 3 지역
    const topRegions = regionStats.slice(0, 3).map((stat) => ({
      areaCode: stat.areaCode,
      areaName: stat.areaName,
      count: stat.count,
    }));

    // Top 3 타입
    const topTypes = typeStats.slice(0, 3).map((stat) => ({
      contentTypeId: stat.contentTypeId,
      typeName: stat.typeName,
      count: stat.count,
    }));

    return {
      totalCount,
      topRegions,
      topTypes,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching stats summary:", error);
    return {
      totalCount: 0,
      topRegions: [],
      topTypes: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

