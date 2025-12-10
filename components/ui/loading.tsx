/**
 * @file loading.tsx
 * @description 로딩 스피너 컴포넌트
 *
 * 다양한 크기와 스타일의 로딩 스피너를 제공합니다.
 */

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  /**
   * 로딩 스피너 크기
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * 로딩 텍스트
   */
  text?: string;
  /**
   * 전체 화면 로딩 여부
   * @default false
   */
  fullScreen?: boolean;
  /**
   * 추가 클래스명
   */
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function Loading({
  size = "md",
  text,
  fullScreen = false,
  className,
}: LoadingProps) {
  const spinner = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className
      )}
    >
      <Loader2
        className={cn(
          "animate-spin text-primary",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}

