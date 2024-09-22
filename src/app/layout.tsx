import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from '@/_components/layouts/Header/Header';
import { Sidebar } from "@/_components/layouts/Sidebar/Sidebar"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "家計簿くん",
  description: "家計簿をつけることができるアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header/>
        <Sidebar/>
        {/* NOTE: このようにレイアウトを組むとchildrenが増えるたびにそのページでHeaderとSidebarに被らないようにしなければならない。何かいい方法はないか？ */}
        {children}
      </body>
    </html>
  );
}
