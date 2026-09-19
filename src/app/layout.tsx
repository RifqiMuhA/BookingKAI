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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function (m, a, z, e) { var s, t, u, v; try { t = m.sessionStorage.getItem('maze-us'); } catch (err) {} if (!t) { t = new Date().getTime(); try { m.sessionStorage.setItem('maze-us', t); } catch (err) {} } u = document.currentScript || (function () { var w = document.getElementsByTagName('script'); return w[w.length - 1]; })(); v = u && u.nonce; s = a.createElement('script'); s.src = z + '?apiKey=' + e; s.async = true; if (v) s.setAttribute('nonce', v); a.getElementsByTagName('head')[0].appendChild(s); m.mazeUniversalSnippetApiKey = e; })(window, document, 'https://snippet.maze.co/maze-universal-loader.js', 'c0239654-47e0-4e72-a951-6b00876e09c6');`,
          }}
        />
      </head>
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
