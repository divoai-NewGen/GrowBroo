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
  metadataBase: new URL("https://verdantdigital.com"),
  title: {
    default: "Verdant Digital | High-Growth Web Engineering & Digital Studio",
    template: "%s | Verdant Digital",
  },
  description:
    "We build thoughtful digital experiences, high-performance web applications, and scalable digital products that help modern businesses grow with confidence.",
  keywords: [
    "Web Development",
    "UI UX Design",
    "Next.js Development",
    "Digital Agency",
    "Modern Web Architecture",
    "E-commerce",
    "Tailwind CSS",
  ],
  authors: [{ name: "Verdant Digital Studio" }],
  creator: "Verdant Digital",
  publisher: "Verdant Digital",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Verdant Digital | Big Ideas. Built for Real Growth.",
    description:
      "Modern digital products, high-velocity frontend engineering, and conversion-focused design systems for ambitious ventures.",
    url: "https://verdantdigital.com",
    siteName: "Verdant Digital",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verdant Digital | Big Ideas. Built for Real Growth.",
    description:
      "Modern digital products, high-velocity frontend engineering, and conversion-focused design systems for ambitious ventures.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#003351",
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
      <body className="min-h-screen flex flex-col bg-white text-[#003351] selection:bg-[#02DEF1] selection:text-[#003351] antialiased">
        <SmoothScrollProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
