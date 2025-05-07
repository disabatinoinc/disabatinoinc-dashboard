import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./clientLayout";
import SnackbarProviderWrapper from "@/components/shared/SnackbarProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DiSabatinoinc Dashboard",
  description: "Dashboard displaying project data for DiSabatino Inc.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ backgroundColor: "#030712", color: "white" }}
      >
        <SnackbarProviderWrapper>
          <ClientLayout>{children}</ClientLayout>
        </SnackbarProviderWrapper>
      </body>
    </html>
  );
}
