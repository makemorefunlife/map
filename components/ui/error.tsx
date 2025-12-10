/**
 * @file error.tsx
 * @description 에러 메시지 컴포넌트
 *
 * 에러 상황을 사용자에게 표시하고 재시도 기능을 제공합니다.
 */

import { AlertCircle, AlertTriangle, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorProps {
  /**
   * 에러 메시지
   */
  message: string;
  /**
   * 재시도 함수
   */
  onRetry?: () => void;
  /**
   * 에러 타입
   * @default "error"
   */
  type?: "error" | "warning" | "info";
  /**
   * 추가 클래스명
   */
  className?: string;
}

const typeConfig = {
  error: {
    icon: AlertCircle,
    iconColor: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500",
  },
};

export function Error({
  message,
  onRetry,
  type = "error",
  className,
}: ErrorProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-6 rounded-lg border",
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn("h-5 w-5", config.iconColor)} />
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </Button>
      )}
    </div>
  );
}

