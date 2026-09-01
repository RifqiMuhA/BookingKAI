"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type FontSize = "normal" | "large";

interface AccessibilityContextType {
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: FontSize;
  toggleFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("normal");

  useEffect(() => {
    // Sync High Contrast
    if (isHighContrast) {
      document.documentElement.setAttribute("data-theme", "high-contrast");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isHighContrast]);

  useEffect(() => {
    // Sync Font Size
    if (fontSize === "large") {
      document.documentElement.classList.add("text-lg");
    } else {
      document.documentElement.classList.remove("text-lg");
    }
  }, [fontSize]);

  const toggleHighContrast = () => setIsHighContrast((prev) => !prev);
  const toggleFontSize = () => setFontSize((prev) => (prev === "normal" ? "large" : "normal"));

  return (
    <AccessibilityContext.Provider value={{ isHighContrast, toggleHighContrast, fontSize, toggleFontSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
