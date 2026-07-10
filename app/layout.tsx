import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ColorThemeProvider } from "@/lib/theme";

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
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <ColorThemeProvider>
            {children}
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
