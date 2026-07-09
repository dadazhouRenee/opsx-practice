import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MES 管理系统",
  description: "轻量级制造执行系统 MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
