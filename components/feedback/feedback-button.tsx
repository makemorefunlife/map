/**
 * @file feedback-button.tsx
 * @description 피드백 버튼 컴포넌트
 *
 * 사용자 피드백을 수집하는 버튼입니다.
 */

"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("피드백을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 여기에 실제 피드백 전송 로직 추가
      // 예: API 라우트로 전송하거나 외부 서비스 연동
      
      // 임시로 localStorage에 저장 (실제 구현 시 API로 전송)
      const feedbackData = {
        userId: userId || "anonymous",
        feedback: feedback.trim(),
        timestamp: new Date().toISOString(),
        url: window.location.href,
      };

      // 개발 환경에서만 콘솔에 출력
      if (process.env.NODE_ENV === "development") {
        console.log("[Feedback]", feedbackData);
      }

      // 실제 구현 시:
      // await fetch("/api/feedback", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(feedbackData),
      // });

      toast.success("피드백이 전송되었습니다. 감사합니다!");
      setFeedback("");
      setOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("피드백 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50"
          aria-label="피드백 보내기"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>피드백 보내기</DialogTitle>
          <DialogDescription>
            서비스 개선을 위한 의견을 남겨주세요. 버그 리포트나 기능 제안도 환영합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="feedback">피드백 내용</Label>
            <Textarea
              id="feedback"
              placeholder="의견을 입력해주세요..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !feedback.trim()}>
              {isSubmitting ? "전송 중..." : "전송"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

