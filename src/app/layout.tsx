import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { DataProvider } from "@/context/DataProvider"
import { Toaster } from "sonner"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Director OS",
  description: "Sistema de gestión integral",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <DataProvider>
            <div className="flex min-h-screen bg-background text-foreground">
              {/* Sidebar para Desktop - Ancho w-16 (Iconos) */}
              <div className="hidden w-16 md:block">
                <Sidebar className="fixed w-16 h-full border-r border-[#1f1f1f]" />
              </div>

              {/* Contenido Principal */}
              <div className="flex-1 flex flex-col md:pl-16">
                <Header />
                <main className="flex-1 px-4 py-4 space-y-4">
                  {children}
                </main>
              </div>
            </div>
            <Toaster richColors />
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
