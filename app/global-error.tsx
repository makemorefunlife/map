/**
 * @file global-error.tsx
 * @description 전역 에러 페이지 (루트 레이아웃 에러)
 *
 * 루트 레이아웃에서 발생한 에러를 처리합니다.
 * 이 파일은 반드시 "use client"를 사용해야 합니다.
 */

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 에러 추적 서비스로 전송)
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-background">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">심각한 오류가 발생했습니다</h1>
              <p className="text-muted-foreground">
                애플리케이션을 초기화하는 중 문제가 발생했습니다.
                페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">
                  오류 코드: {error.digest}
                </p>
              )}
            </div>
            <Button onClick={reset} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              다시 시도
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}

