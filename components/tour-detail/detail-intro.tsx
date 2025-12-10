/**
 * @file detail-intro.tsx
 * @description 관광지 운영 정보 섹션
 *
 * 관광지의 운영시간, 휴무일, 이용요금 등 운영 정보를 표시합니다.
 */

import {
  Clock,
  CalendarX,
  DollarSign,
  Car,
  Users,
  Sparkles,
  Baby,
  Heart,
} from "lucide-react";
import type { TourIntro, ContentTypeId } from "@/lib/types/tour";

interface DetailIntroProps {
  intro: TourIntro;
  contentTypeId: ContentTypeId;
}

interface InfoItem {
  icon: React.ReactNode;
  label: string;
  value: string | undefined;
}

export function DetailIntro({ intro, contentTypeId }: DetailIntroProps) {
  // 타입별로 표시할 정보 필드 결정
  const getInfoItems = (): InfoItem[] => {
    const items: InfoItem[] = [];

    // 운영시간 (타입별로 필드명이 다를 수 있음)
    if (intro.usetime) {
      items.push({
        icon: <Clock className="h-5 w-5" />,
        label: "운영시간",
        value: intro.usetime,
      });
    }

    // 휴무일
    if (intro.restdate) {
      items.push({
        icon: <CalendarX className="h-5 w-5" />,
        label: "휴무일",
        value: intro.restdate,
      });
    }

    // 이용요금
    if (intro.usecost) {
      items.push({
        icon: <DollarSign className="h-5 w-5" />,
        label: "이용요금",
        value: intro.usecost,
      });
    }

    // 주차 가능 여부
    if (intro.parking) {
      items.push({
        icon: <Car className="h-5 w-5" />,
        label: "주차",
        value: intro.parking,
      });
    }

    // 수용인원
    if (intro.accomcount) {
      items.push({
        icon: <Users className="h-5 w-5" />,
        label: "수용인원",
        value: `${intro.accomcount}명`,
      });
    }

    // 체험 프로그램
    if (intro.expguide) {
      items.push({
        icon: <Sparkles className="h-5 w-5" />,
        label: "체험 프로그램",
        value: intro.expguide,
      });
    }

    // 유모차 동반 가능
    if (intro.chkpet) {
      items.push({
        icon: <Baby className="h-5 w-5" />,
        label: "유모차 동반",
        value: intro.chkpet === "Y" ? "가능" : "불가",
      });
    }

    // 반려동물 동반 가능
    if (intro.chkpet) {
      items.push({
        icon: <Heart className="h-5 w-5" />,
        label: "반려동물 동반",
        value: intro.chkpet === "Y" ? "가능" : "불가",
      });
    }

    // 문의처
    if (intro.infocenter) {
      items.push({
        icon: <Clock className="h-5 w-5" />,
        label: "문의처",
        value: intro.infocenter,
      });
    }

    return items.filter((item) => item.value);
  };

  const infoItems = getInfoItems();

  if (infoItems.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-xl font-semibold mb-6">운영 정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="text-muted-foreground mt-0.5">{item.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">{item.label}</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

