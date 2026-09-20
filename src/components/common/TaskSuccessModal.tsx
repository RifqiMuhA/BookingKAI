"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, X } from "lucide-react";

interface TaskSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskNumber: 1 | 2 | 3;
  title: string;
  description: string;
}

export function TaskSuccessModal({
  isOpen,
  onClose,
  taskNumber,
  title,
  description,
}: TaskSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl border-2 border-emerald-500 p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>

        {/* Gambar Maskot KAI */}
        <div className="relative w-28 h-28 mb-3">
          <Image
            src="/Maskot/maskot_lambai.webp"
            alt="Maskot KAI"
            fill
            className="object-contain drop-shadow-md"
            priority
          />
        </div>

        {/* Badge Hijau Task Selesai */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          <CheckCircle2 size={14} className="text-emerald-600" />
          <span>Task {taskNumber} Selesai</span>
        </div>

        {/* Judul & Deskripsi Simpel */}
        <h3 className="text-lg font-extrabold text-gray-900 mb-1">
          {title}
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed mb-5 max-w-xs">
          {description}
        </p>

        {/* Tombol Konfirmasi Selesai */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Tutup & Kembali ke Maze
        </button>
      </div>
    </div>
  );
}
