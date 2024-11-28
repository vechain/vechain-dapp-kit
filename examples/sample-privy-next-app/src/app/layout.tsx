'use client';

import localFont from "next/font/local";
import "./globals.css";
import dynamic from "next/dynamic";

const SocialLoginWrapper = dynamic(async () => (await import('./components/SocialLoginWrapper')).SocialLoginWrapper, {
  ssr: false
});

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
  });
  
  const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
  });

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <head>
          <title>Privy Next JS</title>
        </head>
        <body>
          <SocialLoginWrapper>
            {children}
          </SocialLoginWrapper>
        </body>
      </html>
    );
}
