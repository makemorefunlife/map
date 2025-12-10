/**
 * @file analytics.tsx
 * @description 성능 모니터링 컴포넌트
 *
 * Web Vitals를 측정하고 성능 메트릭을 수집합니다.
 */

"use client";

import { useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { reportWebVitals } from "@/lib/utils/analytics";

export function Analytics() {
  useReportWebVitals((metric) => {
    reportWebVitals({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      rating: metric.rating as "good" | "needs-improvement" | "poor",
    });
  });

  return null;
}

