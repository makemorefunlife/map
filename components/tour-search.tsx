/**
 * @file tour-search.tsx
 * @description 관광지 검색 컴포넌트
 *
 * 키워드 검색 기능을 제공하는 검색창 컴포넌트입니다.
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface TourSearchProps {
  initialKeyword?: string;
  isLoading?: boolean;
}

export function TourSearch({
  initialKeyword = "",
  isLoading = false,
}: TourSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(initialKeyword);

  // URL의 keyword 파라미터와 동기화
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword") || "";
    setKeyword(urlKeyword);
  }, [searchParams]);

  // 검색 실행
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (keyword.trim()) {
      params.set("keyword", keyword.trim());
    } else {
      params.delete("keyword");
    }
    params.set("page", "1"); // 검색 시 첫 페이지로
    router.push(`/?${params.toString()}`);
  }, [keyword, router, searchParams]);

  // 엔터 키 처리
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  return (
    <div className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="관광지명, 주소, 설명으로 검색..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10"
          disabled={isLoading}
          aria-label="관광지 검색 입력"
        />
      </div>
      <Button
        onClick={handleSearch}
        disabled={isLoading}
        className="shrink-0"
        aria-label="검색 실행"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            검색 중...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            검색
          </>
        )}
      </Button>
    </div>
  );
}

