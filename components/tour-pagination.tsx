/**
 * @file tour-pagination.tsx
 * @description 관광지 목록 페이지네이션 컴포넌트
 *
 * 무한 스크롤 또는 페이지 번호 선택 방식의 페이지네이션을 제공합니다.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TourPaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  isLoading?: boolean;
  onLoadMore?: () => void;
  useInfiniteScroll?: boolean;
}

export function TourPagination({
  currentPage,
  totalCount,
  pageSize,
  isLoading = false,
  onLoadMore,
  useInfiniteScroll = true,
}: TourPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasMore = currentPage < totalPages;

  // 무한 스크롤: Intersection Observer
  useEffect(() => {
    if (!useInfiniteScroll || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [useInfiniteScroll, hasMore, isLoading]);

  // Intersection 감지 시 다음 페이지 로드
  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, isLoading, onLoadMore]);

  // 페이지 변경
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (useInfiniteScroll) {
    // 무한 스크롤 방식
    return (
      <>
        {hasMore && (
          <div ref={loadMoreRef} className="py-8 text-center">
            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>더 불러오는 중...</span>
              </div>
            )}
          </div>
        )}
        {!hasMore && totalCount > 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            모든 관광지를 불러왔습니다.
          </div>
        )}
      </>
    );
  }

  // 페이지 번호 선택 방식
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        이전
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 10) {
            pageNum = i + 1;
          } else if (currentPage <= 5) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 4) {
            pageNum = totalPages - 9 + i;
          } else {
            pageNum = currentPage - 5 + i;
          }

          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              disabled={isLoading}
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
      >
        다음
      </Button>

      <span className="text-sm text-muted-foreground ml-4">
        {currentPage} / {totalPages} 페이지
      </span>
    </div>
  );
}

