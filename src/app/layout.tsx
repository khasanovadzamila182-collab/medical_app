import type { Metadata } from "next";
import "./globals.css";
import { TelegramScript } from "@/components/TelegramScript";
import { BottomNav } from "@/components/BottomNav";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Mama-Expert — Протокол ОРВИ",
  description: "Помощник для мам: диагностика симптомов, расчёт дозировок, напоминания о приёме лекарств",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <TelegramScript />
        <Providers>
          <div className="app-container">
            {children}
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
