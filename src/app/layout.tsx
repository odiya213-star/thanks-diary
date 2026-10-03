import type { Metadata } from "next";

import "./globals.css";

const siteUrl = "https://thanks-diary.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "하루감사",
  title: {
    default: "하루감사 | 매일 쓰는 온라인 감사일기",
    template: "%s | 하루감사",
  },
  description:
    "하루에 한 가지 고마운 순간을 기록하고 따뜻한 AI 답장을 받아보세요. 나만을 위한 온라인 감사일기 하루감사.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "하루감사",
    title: "하루감사 | 매일 쓰는 온라인 감사일기",
    description:
      "하루에 한 가지 고마운 순간을 기록하고 따뜻한 AI 답장을 받아보세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "하루감사 | 매일 쓰는 온라인 감사일기",
    description:
      "하루에 한 가지 고마운 순간을 기록하고 따뜻한 AI 답장을 받아보세요.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
