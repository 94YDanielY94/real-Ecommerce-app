import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Manrope,
  Figtree,
  Google_Sans_Flex,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toast"

export const metadata: Metadata = {
  metadataBase: new URL("https://real.com"), // Replace with your domain

  title: {
    default: "REAL | Electronics Store",
    template: "%s | REAL",
  },

  description:
    "REAL is your trusted online electronics store for laptops, smartphones, gaming accessories, audio devices, computer components, and the latest technology at competitive prices.",

  keywords: [
    "REAL",
    "electronics",
    "electronics store",
    "online shopping",
    "laptops",
    "smartphones",
    "gaming",
    "computer accessories",
    "headphones",
    "keyboards",
    "monitors",
    "tech store",
  ],

  applicationName: "REAL",

  authors: [
    {
      name: "Daniel",
    },
  ],

  creator: "Daniel",
  // publisher: "REAL",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "REAL | Electronics Store",
    description:
      "Shop the latest electronics, gadgets, and computer accessories at REAL.",
    url: "https://real.com",
    siteName: "REAL",
    images: [
      {
        url: "/og-image.png", // 1200x630
        width: 1200,
        height: 630,
        alt: "REAL Electronics Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "REAL | Electronics Store",
    description: "Discover the latest electronics and technology at REAL.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "shopping",
};
const figtreeHeading = Figtree({
  subsets: ["latin"],
  variable: "--font-heading",
});

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const googleFlex = Google_Sans_Flex({
  variable: "--font-google-flex",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        manrope.variable,
        figtreeHeading.variable,
        googleFlex.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
         <Toaster />
      </body>
    </html>
  );
}
