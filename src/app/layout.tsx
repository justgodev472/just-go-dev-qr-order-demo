import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { OrderProvider } from "@/context/OrderContext";

export const metadata: Metadata = {
  title: "JustGoDev QR Order • Contactless Dining",
  description:
    "Mobile-first contactless table ordering system for restaurants and cafes by JustGoDev. Trilingual (Lao, Thai, English) with OnePay QR and Real-time Kitchen Tracking.",
  icons: {
    icon: "/jgd-latets-logo.png",
    shortcut: "/jgd-latets-logo.png",
    apple: "/jgd-latets-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lo" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <OrderProvider>{children}</OrderProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
