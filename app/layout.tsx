import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./components/NextAuthProvider";
import BottomNav from "./components/BottomNav";
import FloatingSearch from "./components/FloatingSearch";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Netekflix",
  description: "Streaming Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
          <BottomNav />
        </NextAuthProvider>
      </body>
    </html>
  );
}
