import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@mantine/core/styles.css';
import { ColorSchemeScript } from '@mantine/core';
import ClientProviders from "@/components/providers/ClientProviders";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Employee Hierarchy",
  description: "Organization employee hierarchy management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <ClientProviders>
          <Sidebar>{children}</Sidebar>
        </ClientProviders>
      </body>
    </html>
  );
}
