import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components";
import "./globals.css";

export const metadata: Metadata = {
  title: "진료 스케줄러",
  description: "병원 내 의사별 진료 스케줄을 매달 자동으로 생성하고 관리하며, A4 PDF 출력을 지원",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
