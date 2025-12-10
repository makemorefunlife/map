/**
 * @file detail-gallery.tsx
 * @description 관광지 이미지 갤러리
 *
 * 관광지의 이미지 목록을 갤러리 형태로 표시합니다.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TourImage } from "@/lib/types/tour";

interface DetailGalleryProps {
  images: TourImage[];
  contentId: string;
}

export function DetailGallery({ images, contentId }: DetailGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  if (!images || images.length === 0) {
    return null;
  }

  // 이미지 URL 정규화
  const normalizeImageUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    return `https://${url}`;
  };

  const mainImage = images[0];
  const subImages = images.slice(1);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">이미지 갤러리</h2>

      {/* 대표 이미지 */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
        <Image
          src={normalizeImageUrl(mainImage.originimgurl)}
          alt={mainImage.imgname || "대표 이미지"}
          fill
          className="object-cover cursor-pointer"
          onClick={() => setSelectedImageIndex(0)}
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>

      {/* 서브 이미지 그리드 */}
      {subImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {subImages.map((image, index) => (
            <div
              key={image.serialnum || index}
              className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedImageIndex(index + 1)}
            >
              <Image
                src={normalizeImageUrl(image.originimgurl)}
                alt={image.imgname || `이미지 ${index + 2}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 200px"
              />
            </div>
          ))}
        </div>
      )}

      {/* 이미지 모달 */}
      <Dialog
        open={selectedImageIndex !== null}
        onOpenChange={(open) => !open && setSelectedImageIndex(null)}
      >
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>
                {selectedImageIndex !== null &&
                  images[selectedImageIndex]?.imgname}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedImageIndex(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="relative w-full aspect-video bg-muted">
            {selectedImageIndex !== null && (
              <>
                <Image
                  src={normalizeImageUrl(
                    images[selectedImageIndex].originimgurl
                  )}
                  alt={images[selectedImageIndex].imgname || "이미지"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                {/* 이전/다음 버튼 */}
                {images.length > 1 && (
                  <>
                    {selectedImageIndex > 0 && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        onClick={() =>
                          setSelectedImageIndex(selectedImageIndex - 1)
                        }
                      >
                        ←
                      </Button>
                    )}
                    {selectedImageIndex < images.length - 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        onClick={() =>
                          setSelectedImageIndex(selectedImageIndex + 1)
                        }
                      >
                        →
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <div className="p-4 text-center text-sm text-muted-foreground">
            {selectedImageIndex !== null &&
              `${selectedImageIndex + 1} / ${images.length}`}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

