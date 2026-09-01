import type { Metadata } from "next";
import "./globals.css";
import "@fontsource-variable/zalando-sans";

export const metadata: Metadata = {
  title: "KAI Booking Redesign",
  description: "Redesign booking.kai.id with Next.js",
};

import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { FloatingActionStack } from "@/components/layout/FloatingActionStack";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <AccessibilityProvider>
            {children}
            <FloatingActionStack />
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
