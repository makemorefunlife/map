/**
 * @file bookmark-list.tsx
 * @description 북마크 목록 컴포넌트
 *
 * 사용자의 북마크 목록을 표시하고 관리하는 컴포넌트입니다.
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { BookmarkCard } from "@/components/bookmarks/bookmark-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Star } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { TourItem } from "@/lib/types/tour";

interface Bookmark {
  id: string;
  user_id: string;
  content_id: string;
  created_at: string;
}

interface BookmarkListProps {
  bookmarks: Bookmark[];
  tourItems: TourItem[];
}

type SortOption = "latest" | "name" | "region";

export function BookmarkList({ bookmarks: initialBookmarks, tourItems: initialTourItems }: BookmarkListProps) {
  const router = useRouter();
  const supabase = useClerkSupabaseClient();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [tourItems, setTourItems] = useState<TourItem[]>(initialTourItems);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 정렬된 관광지 목록
  const sortedTours = useCallback(() => {
    const sorted = [...tourItems];
    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "region":
        return sorted.sort((a, b) =>
          (a.areacode || "").localeCompare(b.areacode || "")
        );
      case "latest":
      default:
        return sorted.sort((a, b) => {
          const bookmarkA = bookmarks.find(
            (b) => b.content_id === a.contentid
          );
          const bookmarkB = bookmarks.find(
            (b) => b.content_id === b.contentid
          );
          if (!bookmarkA || !bookmarkB) return 0;
          return (
            new Date(bookmarkB.created_at).getTime() -
            new Date(bookmarkA.created_at).getTime()
          );
        });
    }
  }, [tourItems, sortBy, bookmarks]);

  // 개별 북마크 삭제
  const handleDelete = async (contentId: string) => {
    if (!bookmarks.length) return;

    const userDbId = bookmarks[0].user_id;

    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", userDbId)
        .eq("content_id", contentId);

      if (error) throw error;

      setBookmarks((prev) =>
        prev.filter((b) => b.content_id !== contentId)
      );
      setTourItems((prev) => prev.filter((t) => t.contentid !== contentId));
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(contentId);
        return newSet;
      });
      toast.success("북마크가 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      toast.error("북마크 삭제 중 오류가 발생했습니다.");
    }
  };

  // 일괄 삭제
  const handleBulkDelete = async () => {
    if (!bookmarks.length || selectedIds.size === 0) return;

    const userDbId = bookmarks[0].user_id;

    try {
      const contentIds = Array.from(selectedIds);
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", userDbId)
        .in("content_id", contentIds);

      if (error) throw error;

      setBookmarks((prev) =>
        prev.filter((b) => !selectedIds.has(b.content_id))
      );
      setTourItems((prev) =>
        prev.filter((t) => !selectedIds.has(t.contentid))
      );
      setSelectedIds(new Set());
      setDeleteDialogOpen(false);
      toast.success(`${contentIds.length}개의 북마크가 삭제되었습니다.`);
    } catch (error) {
      console.error("Error bulk deleting bookmarks:", error);
      toast.error("북마크 삭제 중 오류가 발생했습니다.");
    }
  };

  // 체크박스 토글
  const toggleSelection = (contentId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contentId)) {
        newSet.delete(contentId);
      } else {
        newSet.add(contentId);
      }
      return newSet;
    });
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedIds.size === tourItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(tourItems.map((t) => t.contentid)));
    }
  };

  if (tourItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Star className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">북마크가 없습니다</h2>
        <p className="text-muted-foreground">
          관광지를 북마크하면 여기에 표시됩니다.
        </p>
        <Button onClick={() => router.push("/")}>관광지 둘러보기</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 상단 컨트롤 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={selectedIds.size === tourItems.length && tourItems.length > 0}
            onCheckedChange={toggleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedIds.size > 0
              ? `${selectedIds.size}개 선택됨`
              : "전체 선택"}
          </span>
          {selectedIds.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              선택 삭제
            </Button>
          )}
        </div>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">최신순</SelectItem>
            <SelectItem value="name">이름순</SelectItem>
            <SelectItem value="region">지역별</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 관광지 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedTours().map((tour) => (
          <BookmarkCard
            key={tour.contentid}
            tour={tour}
            isSelected={selectedIds.has(tour.contentid)}
            onSelect={toggleSelection}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>북마크 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              선택한 {selectedIds.size}개의 북마크를 삭제하시겠습니까?
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
