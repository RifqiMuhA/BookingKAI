"use client";

import React, { useState, useMemo, Suspense, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Tag,
  Copy,
  Check,
  Search,
  Calendar,
  Sparkles,
  ArrowRight,
  Info,
  Train,
  CreditCard,
  Percent,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronDown,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { PromoItem, PROMOS_DATA } from "@/lib/promosData";

// Opsi Kota Populer & Kota Lainnya
const POPULAR_CITIES = [
  { id: "Bandung", label: "Bandung" },
  { id: "Yogyakarta", label: "Yogyakarta" },
  { id: "Surabaya", label: "Surabaya" },
];

const OTHER_CITIES = [
  { id: "Jakarta", label: "Jakarta" },
  { id: "Malang", label: "Malang" },
  { id: "Semarang", label: "Semarang" },
  { id: "Solo", label: "Solo" },
  { id: "Cirebon", label: "Cirebon" },
  { id: "Purwokerto", label: "Purwokerto" },
  { id: "Banyuwangi", label: "Banyuwangi" },
];

// Opsi Waktu Promo
const TIME_OPTIONS = [
  { id: "semua", label: "Semua Waktu", maxDays: 9999 },
  { id: "1-minggu", label: "1 Minggu Terakhir", maxDays: 7 },
  { id: "1-bulan", label: "1 Bulan Terakhir", maxDays: 30 },
  { id: "3-bulan", label: "3 Bulan Terakhir", maxDays: 90 },
  { id: "6-bulan", label: "6 Bulan Terakhir", maxDays: 180 },
];

function PromoPageContent() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("semua");
  const [selectedTime, setSelectedTime] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");

  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
        setIsTimeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dapatkan label kota yang sedang aktif
  const selectedCityLabel = useMemo(() => {
    if (selectedCity === "semua") return "Semua Kota";
    const all = [...POPULAR_CITIES, ...OTHER_CITIES];
    const found = all.find((c) => c.id.toLowerCase() === selectedCity.toLowerCase());
    return found ? found.label : selectedCity;
  }, [selectedCity]);

  // Dapatkan label waktu yang sedang aktif
  const selectedTimeLabel = useMemo(() => {
    const found = TIME_OPTIONS.find((t) => t.id === selectedTime);
    return found ? found.label : "Semua Waktu";
  }, [selectedTime]);

  // State pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Filter promo berdasarkan kota, waktu rilis, dan pencarian teks
  const filteredPromos = useMemo(() => {
    const timeOption = TIME_OPTIONS.find((t) => t.id === selectedTime) || TIME_OPTIONS[0];

    return PROMOS_DATA.filter((promo) => {
      // 1. Filter Kota (semua atau kota tertentu; jika promo berlaku "semua", tetap tampil)
      const matchCity =
        selectedCity === "semua" ||
        promo.city.toLowerCase() === selectedCity.toLowerCase() ||
        promo.city === "semua";

      // 2. Filter Waktu Promo (1 minggu, 1 bulan, 3 bulan, 6 bulan)
      const matchTime = promo.daysAgo <= timeOption.maxDays;

      // 3. Filter Pencarian Query
      const matchQuery =
        searchQuery.trim() === "" ||
        promo.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promo.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promo.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promo.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promo.code.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCity && matchTime && matchQuery;
    });
  }, [selectedCity, selectedTime, searchQuery]);

  // Reset page jika filter atau search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCity, selectedTime, searchQuery]);

  // Hitung total halaman & slice item untuk halaman aktif
  const totalPages = Math.ceil(filteredPromos.length / ITEMS_PER_PAGE) || 1;
  const paginatedPromos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPromos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPromos, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-[88px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">

        {/* HERO CARD PROMO */}
        <div className="bg-[#003C71] text-white border border-[#002a50] rounded-sm overflow-hidden mb-8 shadow-md">
          <div className="h-1.5 w-full bg-[#F58220]" />
          <div className="p-5 sm:p-7">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
              <div className="flex items-center gap-4 lg:w-7/12 w-full border-b lg:border-b-0 lg:border-r border-white/20 pb-5 lg:pb-0 lg:pr-6">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 drop-shadow-md">
                  <Image src="/Maskot/maskot_lambai.webp" alt="Maskot KAI" width={96} height={96} className="w-full h-full object-contain" priority />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight tracking-tight">Promo & Penawaran Spesial KAI</h1>
                  <p className="text-xs text-white/80 mt-1 leading-relaxed">Temukan tarif hemat ke destinasi impian di seluruh Indonesia dengan kenyamanan perjalanan kereta api resmi KAI.</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#003C71] bg-white px-2.5 py-1 rounded-sm shadow-xs">
                      <Image src="/Logo/logo_kai.webp" alt="Logo KAI" width={38} height={16} className="h-3.5 w-auto object-contain" />
                      <span>Resmi KAI</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:w-5/12 w-full">
                <label className="block text-xs font-semibold text-white/90 mb-1.5">Cari Rute atau Destinasi Promo</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Contoh: Bandung, Yogyakarta, Surabaya..."
                    className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-xs px-3.5 py-2.5 pl-9 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F58220] transition-all"
                  />
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-xs">✕</button>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/70 mt-2">
                  <span>Pilih filter kota dan waktu di bawah</span>
                  <span className="font-semibold text-[#F58220]">{filteredPromos.length} Promo Ditemukan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== FILTER PROMO ===================== */}
        <div className="bg-white border border-gray-200 rounded-sm p-4 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Kiri: Info Jumlah Promo */}
            <div className="text-sm text-gray-700">
              Menampilkan <span className="font-bold text-[#003C71]">{filteredPromos.length}</span> promo tiket kereta
              {selectedCity !== "semua" && (
                <span className="text-gray-500"> tujuan <span className="font-semibold text-gray-900">{selectedCityLabel}</span></span>
              )}
            </div>

            {/* Kanan: Dropdown Filter Kota & Waktu */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              
              {/* Dropdown 1: Kota Tujuan (Melebar Luas & Background Kategori Berwarna) */}
              <div className="relative w-full sm:w-60" ref={cityRef}>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Kota Tujuan
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCityOpen(!isCityOpen);
                    setIsTimeOpen(false);
                  }}
                  className={`w-full bg-white border ${
                    isCityOpen ? "border-[#003C71] ring-2 ring-[#003C71]/15" : "border-gray-300 hover:border-[#003C71]"
                  } text-gray-800 text-xs py-2 px-3 rounded-sm cursor-pointer transition-all flex items-center justify-between shadow-2xs select-none`}
                >
                  <span className="truncate font-bold text-gray-900">{selectedCityLabel}</span>
                  <ChevronDown
                    size={15}
                    className={`text-gray-400 transition-transform duration-200 shrink-0 ml-2 ${
                      isCityOpen ? "rotate-180 text-[#003C71]" : ""
                    }`}
                  />
                </button>

                {/* Popover Melebar dengan Pewarnaan Background Kategori */}
                {isCityOpen && (
                  <div className="absolute top-[calc(100%+4px)] left-0 sm:left-auto sm:right-0 sm:w-84 bg-white border border-gray-300 rounded-sm shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="max-h-80 overflow-y-auto">
                      {/* Opsi Semua Kota */}
                      <div
                        onClick={() => {
                          setSelectedCity("semua");
                          setIsCityOpen(false);
                        }}
                        className={`px-4 py-2.5 cursor-pointer flex items-center justify-between text-xs transition-colors border-b border-gray-200 ${
                          selectedCity === "semua"
                            ? "bg-[#003C71] text-white font-bold"
                            : "text-gray-800 font-semibold hover:bg-gray-100"
                        }`}
                      >
                        <span>Semua Kota</span>
                        {selectedCity === "semua" && <Check size={14} className="text-white" />}
                      </div>

                      {/* SECTION 1: KOTA POPULER (Background Amber Hangat) */}
                      <div className="bg-amber-50/50">
                        <div className="bg-amber-100/90 px-4 py-1.5 text-[11px] font-bold text-amber-900 border-b border-amber-200/80 tracking-wider">
                          KOTA POPULER
                        </div>
                        <div className="divide-y divide-amber-100/70">
                          {POPULAR_CITIES.map((c) => {
                            const isSelected = selectedCity.toLowerCase() === c.id.toLowerCase();
                            return (
                              <div
                                key={c.id}
                                onClick={() => {
                                  setSelectedCity(c.id);
                                  setIsCityOpen(false);
                                }}
                                className={`px-4 py-2.5 cursor-pointer flex items-center justify-between text-xs transition-colors ${
                                  isSelected
                                    ? "bg-[#003C71] text-white font-bold"
                                    : "text-gray-900 font-medium hover:bg-amber-100/70"
                                }`}
                              >
                                <span>{c.label}</span>
                                {isSelected && <Check size={14} className="text-white" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* SECTION 2: KOTA LAINNYA (Background Slate Rapi) */}
                      <div className="bg-slate-50/60 border-t border-gray-200">
                        <div className="bg-slate-100 px-4 py-1.5 text-[11px] font-bold text-slate-700 border-b border-slate-200 tracking-wider">
                          KOTA LAINNYA
                        </div>
                        <div className="divide-y divide-gray-100">
                          {OTHER_CITIES.map((c) => {
                            const isSelected = selectedCity.toLowerCase() === c.id.toLowerCase();
                            return (
                              <div
                                key={c.id}
                                onClick={() => {
                                  setSelectedCity(c.id);
                                  setIsCityOpen(false);
                                }}
                                className={`px-4 py-2.5 cursor-pointer flex items-center justify-between text-xs transition-colors ${
                                  isSelected
                                    ? "bg-[#003C71] text-white font-bold"
                                    : "text-gray-800 font-medium hover:bg-blue-50/70"
                                }`}
                              >
                                <span>{c.label}</span>
                                {isSelected && <Check size={14} className="text-white" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Dropdown 2: Periode Promo */}
              <div className="relative w-full sm:w-52" ref={timeRef}>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Periode Promo
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsTimeOpen(!isTimeOpen);
                    setIsCityOpen(false);
                  }}
                  className={`w-full bg-white border ${
                    isTimeOpen ? "border-[#003C71] ring-2 ring-[#003C71]/15" : "border-gray-300 hover:border-[#003C71]"
                  } text-gray-800 text-xs py-2 px-3 rounded-sm cursor-pointer transition-all flex items-center justify-between shadow-2xs select-none`}
                >
                  <span className="truncate font-bold text-gray-900">{selectedTimeLabel}</span>
                  <ChevronDown
                    size={15}
                    className={`text-gray-400 transition-transform duration-200 shrink-0 ml-2 ${
                      isTimeOpen ? "rotate-180 text-[#003C71]" : ""
                    }`}
                  />
                </button>

                {/* Popover Waktu Promo */}
                {isTimeOpen && (
                  <div className="absolute top-[calc(100%+4px)] left-0 sm:left-auto sm:right-0 sm:w-60 bg-white border border-gray-300 rounded-sm shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="bg-gray-100 px-4 py-1.5 text-[11px] font-bold text-gray-700 border-b border-gray-200 tracking-wider">
                      PILIH PERIODE
                    </div>
                    <div className="divide-y divide-gray-100 text-xs">
                      {TIME_OPTIONS.map((t) => {
                        const isSelected = selectedTime === t.id;
                        return (
                          <div
                            key={t.id}
                            onClick={() => {
                              setSelectedTime(t.id);
                              setIsTimeOpen(false);
                            }}
                            className={`px-4 py-2.5 cursor-pointer flex items-center justify-between transition-colors ${
                              isSelected
                                ? "bg-[#003C71] text-white font-bold"
                                : "text-gray-800 font-medium hover:bg-blue-50/70"
                            }`}
                          >
                            <span>{t.label}</span>
                            {isSelected && <Check size={14} className="text-white shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Tombol Reset jika ada filter aktif */}
              {(selectedCity !== "semua" || selectedTime !== "semua" || searchQuery) && (
                <div className="w-full sm:w-auto self-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity("semua");
                      setSelectedTime("semua");
                      setSearchQuery("");
                    }}
                    className="w-full sm:w-auto h-[35px] px-3.5 text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                    title="Reset semua filter"
                  >
                    <X size={13} />
                    <span>Reset</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

        {filteredPromos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedPromos.map((promo) => (
                <Link
                  key={promo.id}
                  href={`/promo/${promo.id}`}
                  className="bg-[#003C71] rounded-sm overflow-hidden border border-[#002a50] shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col group cursor-pointer block"
                >
                  {/* Foto Destinasi Atas dengan Efek Miring */}
                  <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-800">
                    <img
                      src={promo.image}
                      alt={promo.route}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {promo.badge && (
                      <div className="absolute top-3.5 left-3.5 bg-white/95 text-[#003C71] text-xs font-black px-2.5 py-1 rounded-sm shadow-sm tracking-wide uppercase">
                        {promo.badge}
                      </div>
                    )}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-6 bg-[#003C71]"
                      style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
                    />
                  </div>

                  {/* Konten Bawah: Tipografi Nyaman & Tidak Terlalu Kecil */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between text-white">
                    <div>
                      {/* Rute Perjalanan */}
                      <p className="text-xs sm:text-sm font-bold text-white/80 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Train size={14} className="text-[#F58220]" />
                        <span>{promo.route}</span>
                      </p>

                      {/* Headline Promo */}
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2.5 leading-snug">
                        {promo.headline}
                      </h3>

                      {/* Tagline Ringkas */}
                      <p className="text-xs sm:text-sm text-white/85 leading-relaxed line-clamp-2">
                        {promo.tagline}
                      </p>
                    </div>

                    {/* Tombol Menuju Halaman Rincian */}
                    <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-end">
                      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#F58220] flex items-center gap-1.5 transition-colors">
                        <span>Buka Rincian Promo</span>
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Kontrol Pagination Boxy & Rapi */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 pb-8 border-t border-gray-200 mb-12">
                <p className="text-xs text-gray-500 order-2 sm:order-1">
                  Menampilkan <span className="font-semibold text-gray-800">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="font-semibold text-gray-800">{Math.min(currentPage * ITEMS_PER_PAGE, filteredPromos.length)}</span> dari <span className="font-semibold text-gray-800">{filteredPromos.length}</span> promo
                </p>

                <div className="inline-flex items-center gap-1.5 order-1 sm:order-2">
                  {/* Tombol Sebelumnya */}
                  <button
                    type="button"
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage((prev) => prev - 1);
                        window.scrollTo({ top: 220, behavior: "smooth" });
                      }
                    }}
                    disabled={currentPage === 1}
                    className={`h-9 px-3 text-xs font-bold rounded-sm border flex items-center gap-1 transition-colors ${
                      currentPage === 1
                        ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
                        : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
                    }`}
                  >
                    <ChevronLeft size={14} />
                    <span>Sebelumnya</span>
                  </button>

                  {/* Tombol Halaman Angka */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 220, behavior: "smooth" });
                          }}
                          className={`w-9 h-9 text-xs font-bold rounded-sm border transition-colors cursor-pointer flex items-center justify-center ${
                            isActive
                              ? "bg-[#003C71] text-white border-[#003C71] shadow-2xs"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tombol Selanjutnya */}
                  <button
                    type="button"
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage((prev) => prev + 1);
                        window.scrollTo({ top: 220, behavior: "smooth" });
                      }
                    }}
                    disabled={currentPage === totalPages}
                    className={`h-9 px-3 text-xs font-bold rounded-sm border flex items-center gap-1 transition-colors ${
                      currentPage === totalPages
                        ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
                        : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
                    }`}
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white border border-gray-300 rounded-sm p-8 text-center shadow-xs mb-10">
            <div className="w-16 h-16 mx-auto mb-3 relative opacity-80">
              <Image
                src="/Maskot/maskot_bingung.webp"
                alt="Maskot KAI Bingung"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Promo Tidak Ditemukan
            </h3>
            <p className="text-xs text-gray-600 max-w-sm mx-auto mb-4">
              Tidak ada rute promo yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCity("semua");
                setSelectedTime("semua");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-[#003C71] text-white text-xs font-bold rounded-sm hover:bg-[#002850] transition-colors cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        )}



      </div>
    </div>
  );
}

export default function PromoPage() {
  return (
    <MainLayout hideFooter={false}>
      <Suspense
        fallback={
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-sm font-semibold text-[#003C71]">
              Memuat Halaman Promo...
            </div>
          </div>
        }
      >
        <PromoPageContent />
      </Suspense>
    </MainLayout>
  );
}
