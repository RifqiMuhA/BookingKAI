"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, X } from "lucide-react";

interface TaskSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskNumber: 1 | 2 | 3;
  title?: string;
  description?: string;
}

export function TaskSuccessModal({
  isOpen,
  onClose,
  taskNumber,
  title,
  description,
}: TaskSuccessModalProps) {
  if (!isOpen) return null;

  // Default copy untuk masing-masing task
  const defaultData = {
    1: {
      title: "Registrasi & Login Berhasil",
      desc: "Akun baru telah aktif dan Anda berhasil masuk ke sistem.",
      nextStep: "untuk melanjutkan ke Task 2.",
    },
    2: {
      title: "Pemesanan Tiket Berhasil",
      desc: "Tiket kereta dan bukti pembayaran resmi telah terbit.",
      nextStep: "untuk melanjutkan ke Task 3.",
    },
    3: {
      title: "Promo Berhasil Digunakan",
      desc: "Promo diskon tiket telah aktif dan diterapkan ke daftar kereta.",
      nextStep: "untuk mengisi kuesioner evaluasi PSSUQ.",
    },
  }[taskNumber];

  const modalTitle = title || defaultData.title;
  const modalDesc = description || defaultData.desc;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[340px] sm:max-w-sm bg-white rounded-2xl shadow-2xl border-2 border-[#065f46] p-5 sm:p-6 sm:pb-7 flex flex-col items-center text-center animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>

        {/* Gambar Maskot KAI - Proporsional di Ponsel */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 my-1">
          <Image
            src="/Maskot/maskot_lambai.webp"
            alt="Maskot KAI"
            fill
            className="object-contain drop-shadow-md"
            priority
          />
        </div>

        {/* Badge Hijau Tua Task Selesai */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-[#064e3b] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
          <CheckCircle2 size={13} className="text-white shrink-0 sm:w-[14px] sm:h-[14px]" />
          <span>Task {taskNumber} Selesai</span>
        </div>

        {/* Judul & Deskripsi Simpel */}
        <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mb-1 leading-snug">
          {modalTitle}
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed mb-3.5 sm:mb-4 max-w-[280px]">
          {modalDesc}
        </p>

        {/* Kotak Highlight End Task Responsif */}
        <div className="w-full bg-emerald-50/90 border border-emerald-300/80 rounded-xl p-3 sm:p-3.5 text-[11px] sm:text-xs text-gray-800 leading-relaxed">
          <span>Silakan klik </span>
          <span className="inline-block px-2 py-0.5 bg-[#064e3b] text-white font-bold rounded shadow-xs tracking-wide mx-1 my-0.5">
            End Task
          </span>
          <span>pada panel Maze di pojok layar {defaultData.nextStep}</span>
        </div>
      </div>
    </div>
  );
}
