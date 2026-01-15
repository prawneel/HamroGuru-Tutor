import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HamroGuru - Find Your Expert Mentor in Nepal",
  description: "Connect with verified local tutors and experts across Nepal. Personalized learning for Math, Science, Languages, and more with HamroGuru.",
  keywords: ["HamroGuru", "Tutors Nepal", "Find Teacher Nepal", "Online Tuition Nepal", "Home Tutors Kathmandu", "Nepal Education", "Mentorship Nepal"],
  authors: [{ name: "HamroGuru Team" }],
  icons: {
    icon: "/favicon.ico", // Assuming a standard favicon or will provide a placeholder
  },
  openGraph: {
    title: "HamroGuru - Find Your Expert Mentor in Nepal",
    description: "Verified tutors and experts across Nepal for personalized learning.",
    url: "https://hamroguru.com",
    siteName: "HamroGuru",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HamroGuru - Find Your Expert Mentor in Nepal",
    description: "Verified tutors and experts across Nepal for personalized learning.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
