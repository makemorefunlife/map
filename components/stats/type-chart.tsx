/**
 * @file type-chart.tsx
 * @description 타입별 관광지 분포 차트 (Donut Chart)
 *
 * 관광 타입별 관광지 개수를 도넛 차트로 표시합니다.
 */

"use client";

import { useRouter } from "next/navigation";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { TypeStats } from "@/lib/types/stats";

interface TypeChartProps {
  data: TypeStats[];
  isLoading?: boolean;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
];

export function TypeChart({ data, isLoading }: TypeChartProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="w-full h-[400px] space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-full w-full rounded-full" />
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

  // 전체 개수 계산
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  // 차트 데이터 준비 (비율 포함)
  const chartData = data.map((item, index) => ({
    name: item.typeName,
    value: item.count,
    percentage: totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : "0",
    contentTypeId: item.contentTypeId,
    color: COLORS[index % COLORS.length],
  }));

  const chartConfig: ChartConfig = chartData.reduce((acc, item) => {
    acc[item.name] = {
      label: item.name,
      color: item.color,
    };
    return acc;
  }, {} as ChartConfig);

  const handlePieClick = (data: any) => {
    if (data?.contentTypeId) {
      router.push(`/?contentTypeId=${data.contentTypeId}`);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">타입별 관광지 분포</h3>
        <p className="text-sm text-muted-foreground">
          관광 타입별 관광지 비율 및 개수
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <ChartContainer
          config={chartConfig}
          className="h-[400px] w-full md:w-1/2"
          aria-label="타입별 관광지 분포 차트"
        >
          <PieChart role="img" aria-label="관광 타입별 비율 도넛 차트">
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid gap-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{data.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {data.value.toLocaleString()}개 ({data.percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={120}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              onClick={handlePieClick}
              style={{ cursor: "pointer" }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="w-full md:w-1/2 space-y-2">
          <h4 className="text-sm font-medium mb-4">타입별 상세 정보</h4>
          <div className="space-y-2">
            {chartData.map((item, index) => (
              <div
                key={item.contentTypeId}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                onClick={() => router.push(`/?contentTypeId=${item.contentTypeId}`)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {item.value.toLocaleString()}개
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        차트 섹션을 클릭하면 해당 타입의 관광지 목록을 볼 수 있습니다.
      </p>
    </div>
  );
}

