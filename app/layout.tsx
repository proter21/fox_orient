import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import MyFooter from "@/components/MyFooter";
import MyNavbar from "@/components/MyNavbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FoxOrient",
  description:
    "Интернет приложение за организация на състезания по спортно радиозасичане",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <body className={`${geistSans.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <main className="min-h-screen">
            <MyNavbar />
            {children}
            <MyFooter />
          </main>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
