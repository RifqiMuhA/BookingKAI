"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Search,
  X,
  Plus,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "umum" | "tiket" | "pembayaran" | "reschedule" | "bagasi" | "ketentuan";
  categoryLabel: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "umum",
    categoryLabel: "Umum",
    question: "Apa saja layanan kereta api yang dapat dipesan melalui portal ini?",
    answer:
      "Portal pemesanan resmi ini melayani pembelian tiket kereta api antarkota untuk seluruh kelas perjalanan (Eksekutif, Bisnis, Ekonomi, Luxury, Panoramic, dan Compartment Suites) ke seluruh rute di Pulau Jawa dan Sumatra.",
  },
  {
    id: "faq-2",
    category: "umum",
    categoryLabel: "Umum",
    question: "Apakah pemesanan tiket kereta di portal ini dikenakan biaya layanan tambahan?",
    answer:
      "Tidak ada biaya layanan tiket tambahan (Rp0 biaya pemesanan). Total harga tiket yang Anda bayarkan sesuai dengan tarif resmi PT Kereta Api Indonesia. Biaya transaksi hanya mengikuti ketentuan standar perbankan Virtual Account atau gerai retail pilihan Anda.",
  },
  {
    id: "faq-3",
    category: "tiket",
    categoryLabel: "Pemesanan & Tiket",
    question: "Kapan periode pemesanan tiket kereta api mulai dibuka?",
    answer:
      "Tiket kereta api antarkota reguler dapat dipesan mulai H-45 kalender sebelum tanggal keberangkatan hingga 1 jam sebelum jam keberangkatan kereta. Untuk periode angkutan khusus (seperti Libur Lebaran, Natal, dan Tahun Baru), jadwal pemesanan diumumkan tersendiri mengikuti kebijakan resmi KAI.",
  },
  {
    id: "faq-4",
    category: "tiket",
    categoryLabel: "Pemesanan & Tiket",
    question: "Bagaimana ketentuan tiket untuk penumpang anak-anak dan bayi (infant)?",
    answer:
      "Anak usia di bawah 3 tahun (bayi/infant) tidak dikenakan biaya tiket (Rp0) dan tidak memperoleh nomor kursi tersendiri (dipangku oleh pendamping dewasa). Anak berusia 3 tahun ke atas wajib memiliki tiket sendiri dengan tarif normal dewasa.",
  },
  {
    id: "faq-5",
    category: "tiket",
    categoryLabel: "Pemesanan & Tiket",
    question: "Berapa batas maksimal tiket yang dapat dibeli dalam satu transaksi reservasi?",
    answer:
      "Dalam satu kode reservasi / transaksi pemesanan daring, Anda dapat memesan tiket hingga maksimal 10 penumpang dewasa dan 10 penumpang bayi. Setiap penumpang wajib menyertakan identitas NIK/KTP atau paspor yang sah.",
  },
  {
    id: "faq-6",
    category: "pembayaran",
    categoryLabel: "Pembayaran",
    question: "Berapa lama batas waktu pembayaran setelah kode booking dibuat?",
    answer:
      "Batas waktu pelunasan adalah 60 menit untuk metode Transfer Virtual Account (BCA, BNI, Mandiri, BRI, BTN) dan Gerai Ritel (Indomaret, Alfamart). Untuk pembayaran instan QRIS, batas waktu penyelesaian transaksi adalah 15 menit. Jika melebihi batas waktu tersebut, pesanan otomatis dibatalkan sistem.",
  },
  {
    id: "faq-7",
    category: "pembayaran",
    categoryLabel: "Pembayaran",
    question: "Metode pembayaran apa saja yang didukung untuk pembelian tiket?",
    answer:
      "Kami menerima Transfer Virtual Account seluruh bank utama di Indonesia (BCA, Mandiri, BNI, BRI, BTN), pembayaran instan QRIS (GoPay, OVO, Dana, ShopeePay, BCA Mobile, Livin'), serta pembayaran tunai melalui kasir minimarket Indomaret dan Alfamart.",
  },
  {
    id: "faq-8",
    category: "reschedule",
    categoryLabel: "Reschedule & Refund",
    question: "Apakah jadwal keberangkatan kereta dapat diubah (reschedule)?",
    answer:
      "Bisa. Pengubahan jadwal (reschedule) dapat diproses paling lambat 2 jam sebelum keberangkatan kereta melalui stasiun atau aplikasi resmi Access by KAI. Perubahan jadwal dikenakan biaya administrasi sebesar 25% dari tarif tiket lama di luar bea pesan.",
  },
  {
    id: "faq-9",
    category: "reschedule",
    categoryLabel: "Reschedule & Refund",
    question: "Bagaimana ketentuan pembatalan tiket dan pengembalian dana (refund)?",
    answer:
      "Pembatalan tiket dapat diajukan paling lambat 2 jam sebelum jadwal keberangkatan. Dana pengembalian tiket sebesar 75% dari tarif tiket (dipotong biaya pembatalan 25%) akan ditransfer langsung ke rekening bank pemesan dalam estimasi 30 hingga 45 hari kerja.",
  },
  {
    id: "faq-10",
    category: "bagasi",
    categoryLabel: "Boarding & Bagasi",
    question: "Apakah penumpang wajib mencetak boarding pass fisik di stasiun?",
    answer:
      "Tidak wajib. Anda dapat langsung menunjukkan E-Boarding Pass yang tersimpan di smartphone beserta kartu identitas asli (KTP/Paspor). Di stasiun yang telah mendukung Face Recognition Boarding Gate, Anda cukup memindai wajah tanpa perlu menunjukkan tiket fisik maupun kartu identitas.",
  },
  {
    id: "faq-11",
    category: "bagasi",
    categoryLabel: "Boarding & Bagasi",
    question: "Berapa ketentuan berat dan dimensi bagasi cuma-cuma yang diizinkan?",
    answer:
      "Setiap penumpang berhak membawa bagasi cuma-cuma tanpa biaya maksimal seberat 20 kg dengan volume maksimal 100 dm³ (dimensi ukuran maksimal 70 cm x 48 cm x 30 cm). Kelebihan berat bagasi akan dikenakan tarif bea bagasi saat pemeriksaan di stasiun keberangkatan.",
  },
  {
    id: "faq-12",
    category: "ketentuan",
    categoryLabel: "Ketentuan Khusus",
    question: "Dokumen identitas resmi apa saja yang dapat digunakan untuk proses boarding?",
    answer:
      "Identitas yang sah untuk penumpang dewasa adalah KTP-el asli, Paspor, atau SIM yang masih berlaku. Untuk Warga Negara Asing (WNA) wajib menggunakan Paspor asli. Untuk penumpang anak di bawah 17 tahun dapat menunjukkan Kartu Identitas Anak (KIA) atau Kartu Keluarga (KK).",
  },
  {
    id: "faq-13",
    category: "ketentuan",
    categoryLabel: "Ketentuan Khusus",
    question: "Bagaimana cara memasukkan dan mengaktifkan kode voucher promo?",
    answer:
      "Kode voucher promo dapat dimasukkan pada kolom voucher di halaman beranda saat pencarian jadwal atau pada halaman ringkasan pembayaran. Potongan harga promo langsung memotong total pembayaran tiket secara otomatis apabila rute dan kuota memenuhi syarat.",
  },
];

const CATEGORIES = [
  { key: "all", label: "Semua Topik" },
  { key: "umum", label: "Umum" },
  { key: "tiket", label: "Pemesanan & Tiket" },
  { key: "pembayaran", label: "Pembayaran" },
  { key: "reschedule", label: "Reschedule & Refund" },
  { key: "bagasi", label: "Boarding & Bagasi" },
  { key: "ketentuan", label: "Ketentuan Khusus" },
];

const PLACEHOLDER_PROMPTS = [
  "Cari batas waktu pembayaran...",
  "Cari reschedule jadwal kereta...",
  "Cari ketentuan refund & pembatalan...",
  "Cari batas berat bagasi gratis...",
  "Cari tiket anak dan infant...",
  "Cari face recognition boarding...",
];

// Helper function untuk highlight kata pencarian
function highlightMatches(text: string, query: string): React.ReactNode {
  if (!query || !query.trim()) return text;
  const trimmed = query.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        className="bg-amber-300 text-gray-950 font-bold px-1 py-0.5 rounded-xs"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "faq-1": true,
  });

  // Animasi slide-up teks placeholder berganti-ganti secara berkala
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const [slideStyle, setSlideStyle] = useState<string>("translate-y-0 opacity-100");

  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Slide up & fade out
      setSlideStyle("-translate-y-3 opacity-0 transition-all duration-300 ease-in");

      setTimeout(() => {
        // 2. Set next prompt and place below
        setCurrentPromptIdx((prev) => (prev + 1) % PLACEHOLDER_PROMPTS.length);
        setSlideStyle("translate-y-3 opacity-0 transition-none");

        // 3. Slide in to center
        setTimeout(() => {
          setSlideStyle("translate-y-0 opacity-100 transition-all duration-300 ease-out");
        }, 50);
      }, 300);
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isSearching = searchQuery.trim().length > 0;

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-white text-gray-900 pt-[72px] sm:pt-[84px] selection:bg-[#003C71] selection:text-white">
        
        {/* ============================================================ */}
        {/* HERO SECTION — Natural Photo Background with Subtle Orbs */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden bg-slate-950 text-white border-b border-gray-200">
          {/* Background Image: background_cs.webp - natural photo with balanced vignette */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/Background/background_cs.webp"
              alt="Background Customer Service KAI"
              fill
              className="object-cover object-center opacity-85"
              priority
            />
            {/* Subtle natural gradient: dark on left for text legibility, clear on right */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />
          </div>

          {/* Top Left Blue Glow Orb (subtle ambient) */}
          <div className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-[#003C71] rounded-full blur-[140px] opacity-45 pointer-events-none z-1" />

          {/* Bottom Right Orange Glow Orb (subtle ambient) */}
          <div className="absolute -bottom-24 -right-24 w-[450px] h-[450px] bg-[#F58220] rounded-full blur-[140px] opacity-35 pointer-events-none z-1" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-14 relative z-10">
            {/* Official KAI Badge (Consistent with Cek Pesanan) */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-[#003C71] bg-white px-3 py-1.5 rounded-sm shadow-sm">
                <Image
                  src="/Logo/logo_kai.webp"
                  alt="Logo KAI"
                  width={42}
                  height={18}
                  className="h-4 w-auto object-contain"
                />
                <span>Resmi KAI</span>
              </span>
            </div>

            {/* Title */}
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                Pertanyaan yang Sering Diajukan
              </h1>
            </div>

            {/* Search Input with Animated Slide-Up Placeholder */}
            <div className="mt-7 max-w-2xl">
              <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-sm border border-white/25 focus-within:border-white focus-within:bg-white/15 transition-all overflow-hidden">
                <Search size={20} className="absolute left-4 text-gray-300 pointer-events-none z-10" />

                {/* Animated Slide-Up Placeholder Text */}
                {!searchQuery && (
                  <div className="absolute left-12 right-12 pointer-events-none overflow-hidden h-7 flex items-center z-0">
                    <span
                      className={`text-base text-gray-300/90 font-normal whitespace-nowrap will-change-transform ${slideStyle}`}
                    >
                      {PLACEHOLDER_PROMPTS[currentPromptIdx]}
                    </span>
                  </div>
                )}

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-11 py-3.5 bg-transparent text-white text-base font-medium outline-none z-10"
                />

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 p-1 rounded-sm text-gray-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer z-20"
                    title="Hapus pencarian"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Live Search Status */}
              {isSearching && (
                <div className="flex items-center justify-between text-sm text-gray-200 mt-3 px-1">
                  <span>
                    Ditemukan <strong className="text-white font-bold">{filteredFAQs.length}</strong> pertanyaan relevan
                  </span>
                  <span className="text-amber-300 font-semibold">
                    Menyorot kata kunci: &ldquo;{searchQuery}&rdquo;
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* MAIN SECTION — 2 Columns with Reference Sidebar Style */}
        {/* ============================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-14 items-start">
            
            {/* Sticky Left Sidebar: Topik (Matches Screenshot Reference) */}
            <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 md:sticky md:top-[100px] z-20">
              <div className="mb-3 px-3">
                <span className="text-sm font-bold uppercase tracking-wider text-gray-500">
                  TOPIK
                </span>
              </div>

              <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`relative w-full text-left px-4 py-3.5 rounded-md text-base transition-all flex items-center cursor-pointer whitespace-nowrap md:whitespace-normal ${
                        isActive
                          ? "bg-[#EBF0F7] text-[#003C71] font-bold"
                          : "text-gray-700 hover:text-[#003C71] hover:bg-gray-100/80 font-semibold"
                      }`}
                    >
                      {/* Left indicator bar on active item */}
                      {isActive && (
                        <span className="absolute left-0 top-2.5 bottom-2.5 w-1.5 bg-[#003C71] rounded-r-sm" />
                      )}
                      <span className={isActive ? "pl-2" : ""}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Right Column: FAQ Accordion List with Highlighting */}
            <div className="flex-1 min-w-0 w-full">
              {filteredFAQs.length === 0 ? (
                /* Empty state jika pencarian tidak cocok (Pakai Maskot Resmi KAI Bingung) */
                <div className="py-14 text-center border border-dashed border-gray-200 rounded-sm bg-gray-50/60 max-w-md mx-auto">
                  <div className="w-28 h-28 mx-auto mb-4 relative drop-shadow-sm">
                    <Image
                      src="/Maskot/maskot_bingung.webp"
                      alt="Topik Tidak Ditemukan"
                      width={112}
                      height={112}
                      className="w-full h-full object-contain"
                      priority
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Topik Tidak Ditemukan
                  </h3>
                  <p className="text-sm text-gray-500 mb-5 px-6 leading-relaxed">
                    Tidak ada pertanyaan yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="px-5 py-2.5 bg-[#003C71] text-white text-sm font-bold rounded-sm hover:bg-[#002B52] transition-colors cursor-pointer shadow-xs"
                  >
                    Reset Pencarian
                  </button>
                </div>
              ) : (
                /* List Pertanyaan & Jawaban */
                <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
                  {filteredFAQs.map((item, index) => {
                    // Ketika user sedang mencari, otomatis buka accordion agar kata yang di-highlight langsung terlihat
                    const isOpen = isSearching ? true : !!openItems[item.id];
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
                          className="w-full py-5 px-3 sm:px-5 text-left flex items-start justify-between gap-4 cursor-pointer group"
                        >
                          <div className="flex items-start gap-4 sm:gap-5 min-w-0">
                            {/* Number Index */}
                            <span className="font-mono text-base font-bold text-gray-400 group-hover:text-[#003C71] transition-colors pt-0.5 select-none">
                              {indexNumber}
                            </span>

                            <div className="min-w-0">
                              {/* Question with highlighted search query */}
                              <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#003C71] transition-colors leading-snug">
                                {highlightMatches(item.question, searchQuery)}
                              </h3>
                            </div>
                          </div>

                          {/* Expand / Collapse Icon */}
                          <div
                            className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 transition-all border ${
                              isOpen
                                ? "bg-[#003C71] text-white border-[#003C71] rotate-45"
                                : "bg-white text-gray-500 border-gray-200 group-hover:border-[#003C71] group-hover:text-[#003C71]"
                            }`}
                          >
                            <Plus size={16} strokeWidth={2.5} />
                          </div>
                        </button>

                        {/* Accordion Body with highlighted search query */}
                        {isOpen && (
                          <div className="pl-10 sm:pl-16 pr-4 sm:pr-10 pb-6 pt-1">
                            <p className="text-base text-gray-700 leading-relaxed font-normal max-w-3xl">
                              {highlightMatches(item.answer, searchQuery)}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
