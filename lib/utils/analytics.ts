/**
 * @file analytics.ts
 * @description 성능 모니터링 및 분석 유틸리티
 *
 * Web Vitals 측정 및 성능 모니터링 기능을 제공합니다.
 */

/**
 * Web Vitals 메트릭 타입
 */
export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating: "good" | "needs-improvement" | "poor";
}

/**
 * Web Vitals 메트릭을 측정하고 로깅합니다.
 * 프로덕션에서는 분석 서비스로 전송할 수 있습니다.
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  // 개발 환경에서만 콘솔에 출력
  if (process.env.NODE_ENV === "development") {
    console.log("[Web Vitals]", {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
    });
  }

  // 프로덕션에서는 여기에 분석 서비스로 전송
  // 예: Google Analytics, Vercel Analytics 등
  if (process.env.NODE_ENV === "production") {
    // 예시: Google Analytics 4
    // gtag("event", metric.name, {
    //   value: Math.round(metric.value),
    //   metric_id: metric.id,
    //   metric_value: metric.value,
    //   metric_delta: metric.delta,
    // });
  }
}

/**
 * 에러를 로깅합니다.
 * 프로덕션에서는 에러 추적 서비스로 전송할 수 있습니다.
 */
export function reportError(error: Error, context?: Record<string, any>) {
  console.error("[Error]", error, context);

  // 프로덕션에서는 여기에 에러 추적 서비스로 전송
  // 예: Sentry, LogRocket 등
  if (process.env.NODE_ENV === "production") {
    // 예시: Sentry
    // Sentry.captureException(error, {
    //   extra: context,
    // });
  }
}

