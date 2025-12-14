import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EtsyProfit - See Your Real Etsy Profit After Fees",
  description: "Stop guessing what you actually keep from Etsy sales. Upload your CSV and see your real profit after all fees - transaction fees, payment processing, offsite ads, and shipping labels.",
  keywords: "etsy profit calculator, etsy fees, etsy seller tools, etsy fee calculator, etsy profit tracker",
  openGraph: {
    title: "EtsyProfit - See Your Real Etsy Profit",
    description: "Know exactly what you keep after Etsy takes their cut. Transaction fees, payment processing, offsite ads - we track it all.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
