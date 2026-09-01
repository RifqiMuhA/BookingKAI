"use client";

import * as React from "react"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Prevent scrolling on body when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/60 p-0 sm:p-4">
      {/* Overlay click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
      
      {/* Modal/BottomSheet Content */}
      <div 
        className="w-full sm:max-w-lg bg-[var(--color-bg-card)] text-[var(--color-text)] rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden transition-all transform origin-bottom sm:origin-center"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[var(--color-bg)]">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 rounded-full hover:bg-gray-100 text-[var(--color-text-secondary)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 bg-[var(--color-bg)] max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
