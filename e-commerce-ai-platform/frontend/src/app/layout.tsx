import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { MainLayout } from '@/components/layout/MainLayout';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <title>电商AI自动化平台</title>
        <meta name="description" content="智能电商自动化管理平台" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}
