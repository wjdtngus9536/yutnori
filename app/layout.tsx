import type { Metadata } from "next";
import { Geist, Geist_Mono, Gowun_Dodum } from "next/font/google";
import "./globals.css";

const yutnoriFont = Gowun_Dodum({
  weight: '400',
  
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
