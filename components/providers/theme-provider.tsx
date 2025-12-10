/**
 * @file theme-provider.tsx
 * @description 테마 프로바이더 컴포넌트
 *
 * next-themes를 사용하여 다크 모드/라이트 모드 전환 기능을 제공합니다.
 */

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

