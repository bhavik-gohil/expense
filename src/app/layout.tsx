import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AutoExport } from "@/components/AutoExport";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ExpenseProvider>
            <AutoExport />
            {children}
          </ExpenseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
