import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function MainLayout({ children, hideMainNavbar = false, hideFooter = false }: { children: React.ReactNode; hideMainNavbar?: boolean; hideFooter?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-muted)] text-[var(--color-text)] transition-colors duration-200">
      <Navbar hideMain={hideMainNavbar} />
      <main className="flex-1 w-full">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
