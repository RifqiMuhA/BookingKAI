"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Search,
  X,
  Plus,
  Minus,
  ArrowUpRight,
  Phone,
  MessageSquare,
  Building2,
  ChevronRight,
  Train,
  CheckCircle2,
  HelpCircle
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "tiket" | "pembayaran" | "perubahan" | "bagasi" | "promo";
  categoryLabel: string;
  question: string;
  answer: string;
  highlights?: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "tiket",
    categoryLabel: "Pemesanan & Tiket",
    question: "Kapan periode pemesanan tiket kereta api mulai dibuka?",
    answer: "Tiket kereta api antarkota reguler dapat dipesan mulai H-45 kalender sebelum tanggal keberangkatan hingga 1 jam sebelum jam keberangkatan kereta. Untuk periode angkutan khusus (seperti Libur Lebaran, Natal, dan Tahun Baru), jadwal pembukaan pemesanan diumumkan tersendiri mengikuti kebijakan resmi PT Kereta Api Indonesia.",
    highlights: ["Mulai H-45 kalender", "Hingga 1 jam sebelum keberangkatan"]
  },
  {
    id: "faq-2",
    category: "tiket",
    categoryLabel: "Pemesanan & Tiket",
    question: "Bagaimana ketentuan tiket untuk anak-anak dan bayi (infant)?",
    answer: "Anak usia di bawah 3 tahun (bayi/infant) tidak dikenakan biaya tiket (Rp0) dan tidak mendapatkan kursi tersendiri (dipangku oleh pendamping dewasa). Anak berusia 3 tahun ke atas wajib memiliki tiket tersendiri dengan tarif penuh normal dewasa.",
    highlights: ["Usia < 3 tahun: Gratis / Rp0 (dipangku)", "Usia ≥ 3 tahun: Tarif normal 1 kursi"]
  },
  {
    id: "faq-3",
    category: "tiket",
    categoryLabel: "Pemesanan & Tiket",
    question: "Berapa batas maksimal tiket yang dapat dibeli dalam satu transaksi?",
    answer: "Dalam satu kode reservasi / transaksi pemesanan daring, Anda dapat memesan tiket hingga maksimal 10 penumpang dewasa dan 10 penumpang bayi. Setiap penumpang wajib menyertakan identitas NIK/KTP atau nomor paspor yang valid.",
    highlights: ["Maksimal 10 penumpang per transaksi"]
  },
  {
    id: "faq-4",
    category: "pembayaran",
    categoryLabel: "Pembayaran",
    question: "Berapa lama batas waktu pembayaran setelah reservasi tiket dibuat?",
    answer: "Batas waktu pelunasan adalah 60 menit untuk metode Transfer Virtual Account (BCA, BNI, Mandiri, BRI, BTN) dan Gerai Ritel (Indomaret, Alfamart). Untuk pembayaran instan QRIS, batas waktu penyelesaian transaksi adalah 15 menit. Jika pembayaran tidak diselesaikan dalam batas waktu tersebut, tiket otomatis dibatalkan sistem.",
    highlights: ["Virtual Account: 60 Menit", "QRIS: 15 Menit"]
  },
  {
    id: "faq-5",
    category: "pembayaran",
    categoryLabel: "Pembayaran",
    question: "Apakah dikenakan biaya administrasi atau biaya layanan tambahan?",
    answer: "Pemesanan tiket melalui portal resmi ini tidak mengenakan biaya pemesanan tambahan (Gratis biaya layanan tiket). Biaya transaksi transfer bank mengacu pada ketentuan Virtual Account standar perbankan terkait (Rp4.000) atau gerai retail (Rp5.000).",
    highlights: ["Biaya layanan portal: Rp0 (Gratis)"]
  },
  {
    id: "faq-6",
    category: "perubahan",
    categoryLabel: "Perubahan & Refund",
    question: "Apakah jadwal keberangkatan kereta dapat diubah (reschedule)?",
    answer: "Bisa. Pengubahan jadwal (reschedule) dapat diproses paling lambat 2 jam sebelum keberangkatan kereta melalui stasiun atau aplikasi resmi KAI. Perubahan jadwal dikenakan biaya administrasi sebesar 25% dari tarif tiket lama di luar bea pesan.",
    highlights: ["Maksimal 2 jam sebelum berangkat", "Biaya administrasi 25%"]
  },
  {
    id: "faq-7",
    category: "perubahan",
    categoryLabel: "Perubahan & Refund",
    question: "Bagaimana ketentuan pembatalan tiket dan pengembalian dana (refund)?",
    answer: "Pembatalan tiket dapat diajukan paling lambat 2 jam sebelum jadwal keberangkatan. Dana pengembalian tiket sebesar 75% dari tarif tiket (dipotong biaya pembatalan 25%) akan dikirimkan melalui transfer ke rekening bank pemesan dalam estimasi 30 hingga 45 hari kerja.",
    highlights: ["Batas pembatalan 2 jam sebelum jadwal", "Pengembalian 75% harga tiket"]
  },
  {
    id: "faq-8",
    category: "bagasi",
    categoryLabel: "Boarding & Bagasi",
    question: "Apakah penumpang wajib mencetak boarding pass fisik di stasiun?",
    answer: "Tidak wajib. Anda dapat langsung menunjukkan E-Boarding Pass yang tersimpan di smartphone beserta kartu identitas asli (KTP/Paspor). Di stasiun yang telah mendukung Face Recognition Boarding Gate, Anda cukup memindai wajah tanpa perlu mencetak tiket fisik.",
    highlights: ["E-Boarding Pass didukung penuh", "Fasilitas Face Recognition tersedia"]
  },
  {
    id: "faq-9",
    category: "bagasi",
    categoryLabel: "Boarding & Bagasi",
    question: "Berapa ketentuan berat dan dimensi bagasi cuma-cuma penumpang?",
    answer: "Setiap penumpang diperbolehkan membawa bagasi cuma-cuma tanpa biaya maksimal seberat 20 kg dengan volume maksimal 100 dm³ (dimensi ukuran maksimal 70 cm x 48 cm x 30 cm). Kelebihan berat bagasi akan dikenakan tarif bea bagasi saat verifikasi di stasiun.",
    highlights: ["Berat maks. 20 kg", "Dimensi maks. 70 x 48 x 30 cm"]
  },
  {
    id: "faq-10",
    category: "promo",
    categoryLabel: "Ketentuan Khusus",
    question: "Bagaimana cara menggunakan dan mengklaim kode promo tiket?",
    answer: "Kode promo dapat diaktifkan pada kolom voucher di halaman beranda atau halaman pembayaran. Pastikan stasiun asal dan tujuan perjalanan sesuai dengan rute syarat promo. Potongan harga promo langsung dipotong otomatis dari tarif normal tiket.",
    highlights: ["Otomatis diterapkan saat rute sesuai", "Kuota harian berlaku"]
  },
  {
    id: "faq-11",
    category: "promo",
    categoryLabel: "Ketentuan Khusus",
    question: "Dokumen identitas apa saja yang sah digunakan untuk boarding?",
    answer: "Identitas yang sah untuk penumpang dewasa adalah KTP-el asli, Paspor, atau SIM yang masih berlaku. Untuk Warga Negara Asing (WNA) wajib menggunakan Paspor asli. Untuk penumpang anak di bawah 17 tahun dapat menunjukkan Kartu Identitas Anak (KIA) atau Kartu Keluarga (KK).",
    highlights: ["KTP-el / Paspor / SIM aktif", "Anak: KIA atau Kartu Keluarga"]
  }
];

const CATEGORIES = [
  { key: "all", label: "Semua Topik" },
  { key: "tiket", label: "Pemesanan & Tiket" },
  { key: "pembayaran", label: "Pembayaran" },
  { key: "perubahan", label: "Ubah Jadwal & Refund" },
  { key: "bagasi", label: "Boarding & Bagasi" },
  { key: "promo", label: "Ketentuan Khusus" },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "faq-1": true, // Default buka item pertama
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        (item.highlights && item.highlights.some((h) => h.toLowerCase().includes(q)));
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-white text-gray-900 pt-[72px] sm:pt-[84px] selection:bg-[#003C71] selection:text-white">
        
        {/* ============================================================ */}
        {/* HERO SECTION — Awwwards Editorial Navy Hero */}
        {/* ============================================================ */}
        <section className="bg-[#001F3F] text-white border-b border-white/10 relative overflow-hidden">
          {/* Subtle architectural grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 sm:pb-16 relative z-10">
            {/* Top Minimal Index Header */}
            <div className="flex items-center justify-between gap-4 mb-6 text-xs font-semibold tracking-wider text-blue-200 uppercase">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F58220]" />
                Pusat Bantuan Resmi KAI
              </span>
              <span className="hidden sm:inline font-mono text-[11px] text-white/50">
                [ DOC. 2026 / KAI-FAQ ]
              </span>
            </div>

            {/* Editorial Title */}
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-white mb-4">
                Pertanyaan yang Sering Diajukan.
              </h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-xl font-normal leading-relaxed">
                Informasi ringkas, jelas, dan terverifikasi mengenai pemesanan tiket, ketentuan bagasi, hingga prosedur pengembalian dana.
              </p>
            </div>

            {/* Integrated Minimalist Search Bar */}
            <div className="mt-8 max-w-2xl">
              <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-sm border border-white/20 focus-within:border-white focus-within:bg-white/15 transition-all">
                <Search size={18} className="absolute left-3.5 text-gray-300 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari topik (misal: bagasi, reschedule, refund, anak, batas waktu)..."
                  className="w-full pl-11 pr-10 py-3.5 bg-transparent text-white placeholder-gray-400 text-xs sm:text-sm font-medium outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 p-1 rounded-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Hapus pencarian"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status bar kecil di bawah search */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 px-1">
                <span>Menampilkan <strong className="text-white font-bold">{filteredFAQs.length}</strong> dari {FAQ_DATA.length} pertanyaan</span>
                {searchQuery && (
                  <span className="text-[var(--color-accent)] font-semibold">
                    Filter kata kunci: &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CATEGORY BAR — Horizontal Editorial Minimalist Tabs */}
        {/* ============================================================ */}
        <div className="sticky top-[72px] sm:top-[84px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-3">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer select-none ${
                      isActive
                        ? "bg-[#003C71] text-white shadow-2xs"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MAIN ACCORDION SECTION — Editorial Fine-Hairline Style */}
        {/* ============================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          
          {filteredFAQs.length === 0 ? (
            /* Empty state jika hasil cari nihil */
            <div className="py-16 text-center border border-dashed border-gray-200 rounded-sm bg-gray-50/50 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <HelpCircle size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Topik Tidak Ditemukan
              </h3>
              <p className="text-xs text-gray-500 mb-4 px-4">
                Tidak ada pertanyaan yang sesuai dengan kata kunci &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-4 py-2 bg-[#003C71] text-white text-xs font-bold rounded-sm hover:bg-[#002B52] transition-colors cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            /* Editorial List */
            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {filteredFAQs.map((item, index) => {
                const isOpen = !!openItems[item.id];
                const indexNumber = String(index + 1).padStart(2, "0");

                return (
                  <div
                    key={item.id}
                    className={`transition-colors duration-200 ${
                      isOpen ? "bg-blue-50/20" : "hover:bg-gray-50/80"
                    }`}
                  >
                    {/* Accordion Trigger */}
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="w-full py-5 sm:py-6 px-2 sm:px-4 text-left flex items-start justify-between gap-4 cursor-pointer group"
                    >
                      <div className="flex items-start gap-4 sm:gap-6 min-w-0">
                        {/* Number Index (Editorial touch) */}
                        <span className="font-mono text-xs sm:text-sm font-semibold text-gray-400 group-hover:text-[#003C71] transition-colors pt-0.5 select-none">
                          {indexNumber}
                        </span>

                        <div className="min-w-0">
                          {/* Category Tag */}
                          <span className="inline-block text-[10px] font-bold text-[#003C71] tracking-wider uppercase mb-1.5">
                            {item.categoryLabel}
                          </span>
                          {/* Question */}
                          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 group-hover:text-[#003C71] transition-colors leading-snug">
                            {item.question}
                          </h3>
                        </div>
                      </div>

                      {/* Expand / Collapse Icon */}
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-sm flex items-center justify-center flex-shrink-0 transition-all border ${
                          isOpen
                            ? "bg-[#003C71] text-white border-[#003C71] rotate-45"
                            : "bg-white text-gray-500 border-gray-200 group-hover:border-[#003C71] group-hover:text-[#003C71]"
                        }`}
                      >
                        <Plus size={16} strokeWidth={2.5} />
                      </div>
                    </button>

                    {/* Accordion Body */}
                    {isOpen && (
                      <div className="pl-8 sm:pl-16 pr-4 sm:pr-12 pb-6 pt-1">
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal mb-3.5 max-w-3xl">
                          {item.answer}
                        </p>

                        {/* Point Highlights */}
                        {item.highlights && item.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {item.highlights.map((h, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#003C71] bg-[#003C71]/5 border border-[#003C71]/15 px-2.5 py-1 rounded-sm"
                              >
                                <CheckCircle2 size={12} className="text-[#003C71]" strokeWidth={2.5} />
                                <span>{h}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ============================================================ */}
          {/* BOTTOM DOCK — Editorial Direct Support Strip */}
          {/* ============================================================ */}
          <div className="mt-14 sm:mt-20 pt-10 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider block mb-1">
                  Butuh Bantuan Lebih Lanjut?
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#003C71] tracking-tight">
                  Hubungi Layanan Pelanggan KAI
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md">
                Tim layanan pelanggan KAI121 siap melayani pertanyaan tiket, bantuan boarding, dan kendala transaksi selama 24 jam sehari.
              </p>
            </div>

            {/* 3 Minimalist Support Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Card 1: Contact Center */}
              <a
                href="tel:121"
                className="group p-4 sm:p-5 rounded-sm bg-gray-50 hover:bg-[#003C71] border border-gray-200 hover:border-[#003C71] transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-sm bg-white group-hover:bg-white/10 text-[#003C71] group-hover:text-white flex items-center justify-center border border-gray-200 group-hover:border-white/20 transition-colors">
                    <Phone size={15} strokeWidth={2.2} />
                  </div>
                  <ArrowUpRight size={15} className="text-gray-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-blue-200 block">
                    Telepon 24 Jam
                  </span>
                  <span className="text-sm font-bold text-gray-900 group-hover:text-white block mt-0.5">
                    Call Center 121
                  </span>
                  <span className="text-[11px] text-gray-500 group-hover:text-gray-300 block mt-0.5">
                    (021) 121
                  </span>
                </div>
              </a>

              {/* Card 2: WhatsApp */}
              <a
                href="https://wa.me/6281112111121"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 sm:p-5 rounded-sm bg-gray-50 hover:bg-[#003C71] border border-gray-200 hover:border-[#003C71] transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-sm bg-white group-hover:bg-white/10 text-[#003C71] group-hover:text-white flex items-center justify-center border border-gray-200 group-hover:border-white/20 transition-colors">
                    <MessageSquare size={15} strokeWidth={2.2} />
                  </div>
                  <ArrowUpRight size={15} className="text-gray-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-blue-200 block">
                    Pesan Cepat
                  </span>
                  <span className="text-sm font-bold text-gray-900 group-hover:text-white block mt-0.5">
                    WhatsApp KAI121
                  </span>
                  <span className="text-[11px] text-gray-500 group-hover:text-gray-300 block mt-0.5">
                    0811-1211-1121
                  </span>
                </div>
              </a>

              {/* Card 3: Loket Stasiun */}
              <div className="p-4 sm:p-5 rounded-sm bg-gray-50 border border-gray-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-sm bg-white text-[#003C71] flex items-center justify-center border border-gray-200">
                    <Building2 size={15} strokeWidth={2.2} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm">
                    Stasiun
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Bantuan Langsung
                  </span>
                  <span className="text-sm font-bold text-gray-900 block mt-0.5">
                    Customer Service On Station
                  </span>
                  <span className="text-[11px] text-gray-500 block mt-0.5">
                    Tersedia di seluruh stasiun besar
                  </span>
                </div>
              </div>
            </div>

          </div>

        </section>

      </div>
    </MainLayout>
  );
}
