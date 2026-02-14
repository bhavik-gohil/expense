import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import { AutoExport } from "@/components/AutoExport";

import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Okane",
  description: "Expense Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex justify-center no-scrollbar relative overflow-x-hidden bg-page`}
      >
        <div
          className="w-full max-w-2xl min-h-screen relative border-x border-border-color bg-page shadow-xl text-text-main"
        >
          <ExpenseProvider>
            <AutoExport />
            {children}
          </ExpenseProvider>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
