import type { Metadata } from "next";
import { Gowun_Dodum } from "next/font/google";
import "./globals.css";

const yutnoriFont = Gowun_Dodum({
  weight: '400',
  subsets: ["latin"], // 여기에 서브셋 추가
  preload: true,
});

export const metadata: Metadata = {
  title: "윷놀이",
  description: "SPA으로 팀전과 빽도 잡기 업기 가능한 윷놀이 만들기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${yutnoriFont.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
