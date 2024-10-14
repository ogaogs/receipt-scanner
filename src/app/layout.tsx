import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/_components/layouts/Header/Header";
import { Box } from "@mui/material";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ height: "100vh" }}
      >
        <Header />

        <Box
          height="100%"
          paddingTop={8}
          sx={{
            backgroundColor: "#DDDDDD",
          }}
        >
          {children}
        </Box>
      </body>
    </html>
  );
}
