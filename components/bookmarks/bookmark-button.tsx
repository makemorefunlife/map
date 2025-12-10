/**
 * @file bookmark-button.tsx
 * @description 북마크 버튼 컴포넌트
 *
 * 관광지를 북마크하거나 북마크를 제거하는 기능을 제공합니다.
 */

"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { toast } from "sonner";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";

interface BookmarkButtonProps {
  contentId: string;
  className?: string;
}

export function BookmarkButton({
  contentId,
  className,
}: BookmarkButtonProps) {
  const { isSignedIn, userId } = useAuth();
  const supabase = useClerkSupabaseClient();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [userDbId, setUserDbId] = useState<string | null>(null);

  // Clerk user ID로 users 테이블에서 user_id 조회
  useEffect(() => {
    if (!isSignedIn || !userId) {
      setIsLoading(false);
      return;
    }

    const fetchUserDbId = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id")
          .eq("clerk_id", userId)
          .single();

        if (error || !data) {
          console.error("Error fetching user:", error);
          setIsLoading(false);
          return;
        }

        setUserDbId(data.id);
      } catch (error) {
        console.error("Error in fetchUserDbId:", error);
        setIsLoading(false);
      }
    };

    fetchUserDbId();
  }, [isSignedIn, userId, supabase]);

  // 북마크 상태 확인
  useEffect(() => {
    if (!isSignedIn || !userDbId) {
      setIsLoading(false);
      return;
    }

    const checkBookmark = async () => {
      try {
        const { data, error } = await supabase
          .from("bookmarks")
          .select("*")
          .eq("user_id", userDbId)
          .eq("content_id", contentId)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            // 북마크가 없는 경우
            setIsBookmarked(false);
          } else {
            console.error("Error checking bookmark:", error);
          }
        } else {
          setIsBookmarked(!!data);
        }
      } catch (error) {
        console.error("Error checking bookmark:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkBookmark();
  }, [contentId, isSignedIn, userDbId, supabase]);

  // 북마크 토글
  const handleToggle = async () => {
    if (!isSignedIn || !userDbId) {
      return; // SignInButton이 처리
    }

    setIsToggling(true);
    try {
      if (isBookmarked) {
        // 북마크 제거
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", userDbId)
          .eq("content_id", contentId);

        if (error) throw error;

        setIsBookmarked(false);
        toast.success("북마크가 제거되었습니다.");
      } else {
        // 북마크 추가
        const { error } = await supabase.from("bookmarks").insert({
          user_id: userDbId,
          content_id: contentId,
        });

        if (error) {
          // 이미 존재하는 경우 (UNIQUE 제약 위반)
          if (error.code === "23505") {
            setIsBookmarked(true);
            toast.success("이미 북마크에 추가되어 있습니다.");
          } else {
            throw error;
          }
        } else {
          setIsBookmarked(true);
          toast.success("북마크에 추가되었습니다.");
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "북마크 처리 중 오류가 발생했습니다."
      );
    } finally {
      setIsToggling(false);
    }
  };

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button variant="outline" size="sm" className={className}>
          <Star className="h-4 w-4" />
        </Button>
      </SignInButton>
    );
  }

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled className={className}>
        <Star className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant={isBookmarked ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isToggling}
      className={className}
    >
      <Star
        className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
      />
    </Button>
  );
}

