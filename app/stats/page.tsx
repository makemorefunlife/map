/**
 * @file page.tsx
 * @description 통계 대시보드 페이지
 *
 * 지역별, 타입별 관광지 통계를 차트로 시각화하여 표시합니다.
 */

import { Suspense } from "react";
import { StatsSummary } from "@/components/stats/stats-summary";
import { RegionChart } from "@/components/stats/region-chart";
import { TypeChart } from "@/components/stats/type-chart";
import { Error } from "@/components/ui/error";
import { Loading } from "@/components/ui/loading";
import {
  getStatsSummary,
  getRegionStats,
  getTypeStats,
} from "@/lib/api/stats-api";

// 통계 데이터 캐싱 설정 (1시간)
export const revalidate = 3600;

async function StatsData() {
  try {
    // 병렬로 모든 통계 데이터 수집
    const [summary, regionStats, typeStats] = await Promise.all([
      getStatsSummary(),
      getRegionStats(),
      getTypeStats(),
    ]);

    return (
      <div className="space-y-8">
        {/* 통계 요약 카드 */}
        <StatsSummary summary={summary} />

        {/* 지역별 분포 차트 */}
        <div className="rounded-lg border bg-card p-6">
          <RegionChart data={regionStats} />
        </div>

        {/* 타입별 분포 차트 */}
        <div className="rounded-lg border bg-card p-6">
          <TypeChart data={typeStats} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading stats:", error);
    return (
      <Error
        message="통계 데이터를 불러오는 중 오류가 발생했습니다."
        onRetry={() => window.location.reload()}
      />
    );
  }
}

export default function StatsPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">통계 대시보드</h1>
        <p className="text-muted-foreground">
          전국 관광지 데이터를 지역별, 타입별로 분석한 통계입니다.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading text="통계 데이터를 불러오는 중..." />
          </div>
        }
      >
        <StatsData />
      </Suspense>
    </main>
  );
}

