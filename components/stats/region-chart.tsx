/**
 * @file region-chart.tsx
 * @description 지역별 관광지 분포 차트 (Bar Chart)
 *
 * 각 시/도별 관광지 개수를 막대 그래프로 표시합니다.
 */

"use client";

import { useRouter } from "next/navigation";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { RegionStats } from "@/lib/types/stats";

interface RegionChartProps {
  data: RegionStats[];
  isLoading?: boolean;
}

export function RegionChart({ data, isLoading }: RegionChartProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="w-full h-[400px] space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-muted-foreground">
        데이터가 없습니다.
      </div>
    );
  }

  // 상위 10개 지역만 표시
  const displayData = data.slice(0, 10).map((item) => ({
    name: item.areaName,
    count: item.count,
    areaCode: item.areaCode,
  }));

  const chartConfig: ChartConfig = {
    count: {
      label: "관광지 개수",
      color: "hsl(var(--chart-1))",
    },
  };

  const handleBarClick = (data: any) => {
    if (data?.activePayload?.[0]?.payload?.areaCode) {
      const areaCode = data.activePayload[0].payload.areaCode;
      router.push(`/?areaCode=${areaCode}`);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">지역별 관광지 분포</h3>
        <p className="text-sm text-muted-foreground">
          상위 10개 지역의 관광지 개수
        </p>
      </div>
      <ChartContainer
        config={chartConfig}
        className="h-[400px] w-full"
        aria-label="지역별 관광지 분포 차트"
      >
        <BarChart
          data={displayData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          onClick={handleBarClick}
          role="img"
          aria-label="지역별 관광지 개수 막대 그래프"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
            aria-label="지역명"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            aria-label="관광지 개수"
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
          />
          <Bar
            dataKey="count"
            fill="var(--color-count)"
            radius={[4, 4, 0, 0]}
            onClick={(data) => {
              if (data.areaCode) {
                router.push(`/?areaCode=${data.areaCode}`);
              }
            }}
            style={{ cursor: "pointer" }}
          />
        </BarChart>
      </ChartContainer>
      <p className="text-xs text-muted-foreground text-center">
        막대를 클릭하면 해당 지역의 관광지 목록을 볼 수 있습니다.
      </p>
    </div>
  );
}

