import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "../components/CustomCursor";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Berecouf",
  description: "Vente d'illustations en ligne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}>
        <div className="relative overflow-hidden min-h-screen text-white">
          {/* FOND GRADIENT */}
          <div className="pointer-events-none absolute inset-0 z-[-1] bg-gradient-to-b from-black via-neutral-900 to-fuchsia-600" />

          <CustomCursor />
          {children}
        </div>
      </body>
    </html>
  );
}
