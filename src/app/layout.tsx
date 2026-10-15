import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://growbroo.com"),
  title: {
    default: "GrowBroo | Scale Your Business Online - Web Engineering & Digital Studio",
    template: "%s | GrowBroo",
  },
  description:
    "GrowBroo engineers high-performance web products, scalable digital systems, and bespoke digital experiences to scale your business online.",
  keywords: [
    "GrowBroo",
    "Scale Your Business Online",
    "Web Development",
    "UI UX Design",
    "Next.js Development",
    "Digital Agency",
    "Modern Web Architecture",
    "E-commerce",
  ],
  authors: [{ name: "GrowBroo Digital Studio" }],
  creator: "GrowBroo",
  publisher: "GrowBroo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "GrowBroo | Scale Your Business Online",
    description:
      "Modern digital products, high-velocity frontend engineering, and conversion-focused systems for ambitious ventures.",
    url: "https://growbroo.com",
    siteName: "GrowBroo",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowBroo | Scale Your Business Online",
    description:
      "Modern digital products, high-velocity frontend engineering, and conversion-focused systems for ambitious ventures.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#006B21",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} scroll-smooth`} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-white text-[#050505] selection:bg-[#39E900] selection:text-[#050505] antialiased">
        <SmoothScrollProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
