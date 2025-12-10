/**
 * @file share-button.tsx
 * @description 공유 버튼 컴포넌트
 *
 * 현재 페이지 URL을 클립보드에 복사하는 기능을 제공합니다.
 */

"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonProps {
  url?: string;
  title?: string;
}

export function ShareButton({ url, title }: ShareButtonProps) {
  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;

    try {
      // Web Share API 사용 (지원되는 경우)
      if (navigator.share && window.isSecureContext) {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
        return;
      }

      // 클립보드 API 사용
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("URL이 복사되었습니다.");
      } else {
        // Fallback: 텍스트 선택
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast.success("URL이 복사되었습니다.");
      }
    } catch (error) {
      console.error("Share failed:", error);
      toast.error("공유에 실패했습니다.");
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
      <Share2 className="h-4 w-4" />
      공유
    </Button>
  );
}

