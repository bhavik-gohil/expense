import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AutoExport } from "@/components/AutoExport";

import { BottomNav } from "@/components/BottomNav";

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
      <body
        className={`${inter.className} min-h-screen flex justify-center no-scrollbar relative overflow-x-hidden`}
        style={{ backgroundColor: 'rgb(var(--bg-page))' }}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('m3_theme');
                  var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.removeAttribute('data-theme');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
        <ThemeProvider>
          {/* Main App Container - Solid/Clean */}
          <div
            className="w-full max-w-2xl min-h-screen relative border-x border-border-color bg-page shadow-xl"
            style={{ color: 'rgb(var(--text-main))' }}
          >
            <ExpenseProvider>
              <AutoExport />
              {children}
            </ExpenseProvider>
          </div>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
