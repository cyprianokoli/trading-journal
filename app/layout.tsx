import type { Metadata } from "next";

import { Sidebar } from "@/components/layout/sidebar";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Lucid Futures Journal",
  description: "Trading journal for futures traders importing Tradovate CSV exports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-[var(--font-body)]">
        <div className="mx-auto grid min-h-screen max-w-[1600px] gap-4 px-3 py-3 sm:px-4 sm:py-4 lg:grid-cols-[320px,1fr] lg:gap-6 lg:px-6 lg:py-6">
          <Sidebar />
          <main className="space-y-4 lg:space-y-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
