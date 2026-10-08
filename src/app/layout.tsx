import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "RoseFacture",
  description: "SaaS de facturation pour entrepreneurs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn(inter.variable, "font-sans")}>
      <body className="antialiased text-gray-900 bg-[#F9FAFB]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
