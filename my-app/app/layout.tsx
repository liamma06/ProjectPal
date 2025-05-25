import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Project Pal",
  description: "Project Pal - Your AI Assistant for Project Management",
  icons: {
    icon: "/Project Pal.svg",
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
        className={`${inter.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
