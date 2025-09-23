import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from '@/components/layout/ClientLayout'

export const metadata: Metadata = {
  title: "电商AI助手",
  description: "智能电商管理平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
