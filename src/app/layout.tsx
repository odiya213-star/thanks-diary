import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "하루감사 — 나만의 감사일기",
  description: "하루의 고마운 순간을 차곡차곡 기록하는 감사일기",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
