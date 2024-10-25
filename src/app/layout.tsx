import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/_components/layouts/Header/Header";
import { Box } from "@mui/material";
import { auth } from "@/auth";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isSignedIn = Boolean(session?.user.id);
  const userName = session?.user.name;
  const userImage = session?.user.image;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ height: "100vh" }}
      >
        <Header
          isSignedIn={isSignedIn}
          userName={userName}
          userImage={userImage}
        />

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
