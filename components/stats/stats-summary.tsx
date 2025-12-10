/**
 * @file stats-summary.tsx
 * @description 통계 요약 카드 컴포넌트
 *
 * 전체 관광지 수, Top 3 지역, Top 3 타입을 카드 형태로 표시합니다.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { StatsSummary } from "@/lib/types/stats";
import { MapPin, TrendingUp, Calendar } from "lucide-react";

interface StatsSummaryProps {
  summary: StatsSummary | null;
  isLoading?: boolean;
}

export function StatsSummary({ summary, isLoading }: StatsSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 전체 관광지 수 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">전체 관광지</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summary.totalCount.toLocaleString()}개
          </div>
        </CardContent>
      </Card>

      {/* Top 1 지역 */}
      {summary.topRegions.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">1위 지역</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.topRegions[0].areaName}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.topRegions[0].count.toLocaleString()}개
            </p>
          </CardContent>
        </Card>
      )}

      {/* Top 1 타입 */}
      {summary.topTypes.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">1위 타입</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.topTypes[0].typeName}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.topTypes[0].count.toLocaleString()}개
            </p>
          </CardContent>
        </Card>
      )}

      {/* 마지막 업데이트 시간 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">업데이트</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {formatDate(summary.lastUpdated)}
          </div>
        </CardContent>
      </Card>

      {/* Top 2-3 지역 및 타입 (추가 카드) */}
      {summary.topRegions.length > 1 && (
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">상위 지역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {summary.topRegions.slice(1, 3).map((region, index) => (
                <div key={region.areaCode}>
                  <div className="text-lg font-semibold">
                    {index + 2}위. {region.areaName}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {region.count.toLocaleString()}개
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 2-3 타입 */}
      {summary.topTypes.length > 1 && (
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">상위 타입</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {summary.topTypes.slice(1, 3).map((type, index) => (
                <div key={type.contentTypeId}>
                  <div className="text-lg font-semibold">
                    {index + 2}위. {type.typeName}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {type.count.toLocaleString()}개
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

