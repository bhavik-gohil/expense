import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ExpenseProvider } from "@/contexts/ExpenseContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Material 3 Expense Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ExpenseProvider>
          {children}
        </ExpenseProvider>
      </body>
    </html>
  );
}
