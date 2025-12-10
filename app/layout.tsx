import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Trip - 한국 관광지 정보 서비스",
  description: "전국 관광지 정보를 검색하고 지도에서 확인하세요",
  openGraph: {
    title: "My Trip - 한국 관광지 정보 서비스",
    description: "전국 관광지 정보를 검색하고 지도에서 확인하세요",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Trip - 한국 관광지 정보 서비스",
    description: "전국 관광지 정보를 검색하고 지도에서 확인하세요",
  },
};

/**
 * Clerk 한국어 로컬라이제이션 설정
 *
 * @clerk/localizations 패키지의 koKR을 기본으로 사용하고,
 * 필요시 커스텀 에러 메시지와 텍스트를 추가합니다.
 *
 * 모범 사례:
 * - 기본 koKR 로컬라이제이션을 확장하여 사용
 * - 사용자 친화적인 한국어 에러 메시지 제공
 * - 주요 컴포넌트 텍스트 커스터마이징 가능
 *
 * 참고: https://clerk.com/docs/guides/customizing-clerk/localization
 */
const koreanLocalization = {
  ...koKR,
  // 주요 컴포넌트 텍스트 커스터마이징 (필요시)
  signUp: {
    ...koKR.signUp,
    // 회원가입 시작 화면
    start: {
      ...koKR.signUp?.start,
      // subtitle은 기본 koKR 사용, 필요시 커스터마이징 가능
      // subtitle: '{{applicationName}}에 가입하세요',
    },
  },
  signIn: {
    ...koKR.signIn,
    // 로그인 화면 텍스트 커스터마이징 (필요시)
    // start: {
    //   subtitle: '{{applicationName}}에 로그인하세요',
    // },
  },
  // 한국어 에러 메시지 커스터마이징
  unstable__errors: {
    ...koKR.unstable__errors,
    // 접근 불가 에러 메시지
    not_allowed_access:
      "접근 권한이 없습니다. 회사 이메일 도메인을 허용 목록에 추가하려면 관리자에게 문의하세요.",
    // 기타 자주 사용되는 에러 메시지들
    form_identifier_not_found: "입력하신 이메일 주소를 찾을 수 없습니다.",
    form_password_incorrect: "비밀번호가 올바르지 않습니다.",
    form_code_incorrect: "인증 코드가 올바르지 않습니다.",
    form_param_format_invalid: "입력 형식이 올바르지 않습니다.",
    form_param_nil: "필수 입력 항목이 누락되었습니다.",
    form_password_length_too_short: "비밀번호가 너무 짧습니다. 최소 8자 이상 입력해주세요.",
    form_password_pwned:
      "이 비밀번호는 보안상 안전하지 않습니다. 다른 비밀번호를 사용해주세요.",
    form_password_size_in_bytes:
      "비밀번호가 너무 깁니다. 더 짧은 비밀번호를 사용해주세요.",
    form_password_validation_failed: "비밀번호가 요구사항을 만족하지 않습니다.",
    form_username_invalid_length: "사용자 이름 길이가 올바르지 않습니다.",
    identification_deleted: "이 계정은 삭제되었습니다.",
    session_exists: "이미 로그인되어 있습니다.",
    session_not_found: "세션을 찾을 수 없습니다. 다시 로그인해주세요.",
    session_token_expired: "세션이 만료되었습니다. 다시 로그인해주세요.",
    user_already_exists: "이 이메일 주소로 이미 가입된 계정이 있습니다.",
    user_locked: "계정이 잠겨 있습니다. 잠시 후 다시 시도하거나 관리자에게 문의하세요.",
    user_not_found: "사용자를 찾을 수 없습니다.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={koreanLocalization}>
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SyncUserProvider>
            <Navbar />
            {children}
            <Toaster />
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
