import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
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
  title: {
    template: '%s | clearly.gift - Share your wishlist, keep the surprise',
    default: 'clearly.gift - Share your wishlist, keep the surprise',
  },
  description: "Create beautiful, clutter-free wish lists that friends and family can view and claim gifts from - no sign-up required for them.",
  keywords: ["wishlist", "gift list", "gift sharing", "presents", "birthday", "holidays", "wedding registry"],
  authors: [{ name: "clearly.gift" }],
  creator: "clearly.gift",
  publisher: "clearly.gift",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://clearly.gift'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'clearly.gift - Share your wishlist, keep the surprise',
    description: "Create beautiful, clutter-free wish lists that friends and family can view and claim gifts from - no sign-up required for them.",
    siteName: 'clearly.gift',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'clearly.gift - Share your wishlist, keep the surprise',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'clearly.gift - Share your wishlist, keep the surprise',
    description: "Create beautiful, clutter-free wish lists that friends and family can view and claim gifts from - no sign-up required for them.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
