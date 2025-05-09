import { NextUIProvider } from "@nextui-org/react";
import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const noto = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Go",
  description: "TrainLCDの経路検索サービス",
  appleWebApp: {
    title: "Go",
    statusBarStyle: "black-translucent",
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={noto.className}>
        <Suspense>
          <NextUIProvider>{children}</NextUIProvider>
        </Suspense>
      </body>
    </html>
  );
}
