"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { getPromoById, PROMOS_DATA } from "@/lib/promosData";
import {
  Train,
  ArrowLeft,
  Calendar,
  Copy,
  Check,
  ArrowRight,
  MapPin,
  Clock,
  Share2
} from "lucide-react";

export default function PromoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const promo = getPromoById(id);

  const [copied, setCopied] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  if (!promo) {
    return (
      <MainLayout hideFooter={false}>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
          <div className="w-24 h-24 relative mb-4">
            <Image
              src="/Maskot/maskot_bingung.webp"
              alt="Maskot KAI Bingung"
              width={96}
              height={96}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Promo Tidak Ditemukan
          </h1>
          <p className="text-sm text-gray-600 max-w-md mb-6">
            Penawaran promo yang Anda cari mungkin telah berakhir atau tautan tidak valid.
          </p>
          <Link
            href="/promo"
            className="px-5 py-2.5 bg-[#003C71] text-white font-bold text-sm rounded-sm hover:bg-[#002850] transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Daftar Promo</span>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const handleUsePromo = () => {
    handleCopyCode();
    const promoRouteMapping: Record<string, { origin: string; dest: string }> = {
      PARAHYANGAN: { origin: "GMR", dest: "BDO" },
      JOGJAISTIMEWA: { origin: "GMR", dest: "YK" },
      EXPLOREMALANG: { origin: "SBY", dest: "ML" },
      ARGOSALE: { origin: "GMR", dest: "SBY" },
      JATENGHEBAT: { origin: "SMT", dest: "SLO" },
      LODAYASOLO: { origin: "BDO", dest: "SLO" },
      METROJAKARTA: { origin: "BDO", dest: "GMR" },
      KAIHEMAT: { origin: "GMR", dest: "BDO" },
    };
    const route = promoRouteMapping[promo.code];
    const params = new URLSearchParams();
    params.set("promo", promo.code);
    if (route) {
      params.set("origin", route.origin);
      params.set("dest", route.dest);
    }
    router.push(`/?${params.toString()}`);
  };

  // Promo rekomendasi lainnya
  const relatedPromos = PROMOS_DATA.filter((p) => p.id !== promo.id).slice(0, 3);

  return (
    <MainLayout hideFooter={false}>
      <div className="min-h-screen bg-gray-50 pt-[88px] pb-24">
        
        {/* TOP BREADCRUMB / NAV BAR */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <Link
              href="/promo"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-600 hover:text-[#003C71] transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Semua Promo</span>
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#003C71] bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-sm transition-colors cursor-pointer"
            >
              <Share2 size={13} />
              <span>{shareToast ? "Tautan Tersalin!" : "Bagikan"}</span>
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          
          {/* HEADER HERO AREA PROMO (LEGA & LUAS) */}
          <div className="bg-white border border-gray-300 rounded-sm overflow-hidden shadow-sm mb-8">
            
            {/* Foto Destinasi Banner Besar */}
            <div className="relative h-72 sm:h-96 md:h-[420px] w-full overflow-hidden bg-slate-900">
              <img
                src={promo.image}
                alt={promo.route}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Gradasi Elegan */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              {/* Badges di Atas Foto */}
              <div className="absolute top-5 left-5 sm:left-8 flex flex-wrap items-center gap-2.5">
                {promo.badge && (
                  <span className="bg-[#F58220] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-sm shadow-md">
                    {promo.badge}
                  </span>
                )}
                <span className="bg-white/95 text-[#003C71] text-xs font-bold px-3 py-1.5 rounded-sm shadow-md flex items-center gap-2">
                  <Image
                    src="/Logo/logo_kai.webp"
                    alt="Logo KAI"
                    width={38}
                    height={16}
                    className="h-3.5 w-auto object-contain"
                  />
                  <span>Resmi KAI</span>
                </span>
              </div>

              {/* Teks Headline di Atas Foto (Bagian Bawah Banner) */}
              <div className="absolute bottom-6 sm:bottom-8 left-5 sm:left-8 right-5 sm:right-8 text-white">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#F58220] mb-2 flex items-center gap-2">
                  <MapPin size={15} />
                  <span>{promo.route}</span>
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
                  {promo.headline}
                </h1>
                <p className="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed">
                  {promo.tagline}
                </p>
              </div>
            </div>

            {/* Quick Specs Strip */}
            <div className="bg-[#003C71] text-white px-5 sm:px-8 py-4 flex flex-wrap items-center gap-6 border-t border-[#002a50]">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90">
                <Calendar size={16} className="text-[#F58220]" />
                <span>Masa Berlaku: <strong className="text-white font-bold">{promo.validUntil}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90">
                <Clock size={16} className="text-[#F58220]" />
                <span>{promo.minTransaction}</span>
              </div>
            </div>

          </div>

          {/* DUA KOLOM UTAMA: RINCIAN PROMO & KOTAK AKSI VOUCHER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            
            {/* KOLOM KIRI: INFO RINGKAS, RAPI & TANPA KOTAK */}
            <div className="lg:col-span-8 space-y-6 text-gray-700">
              
              {/* Deskripsi Promo */}
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">
                  Tentang Promo
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {promo.description || promo.tagline}
                </p>
              </div>

              {/* Rangkaian Kereta yang Berlaku */}
              <div className="pt-5 border-t border-gray-200">
                <h2 className="text-base font-bold text-gray-900 mb-2">
                  Kereta yang Berlaku
                </h2>
                <p className="text-sm sm:text-base font-semibold text-[#003C71]">
                  {promo.eligibleTrains}
                </p>
              </div>

              {/* Syarat & Ketentuan Ringkas */}
              <div className="pt-5 border-t border-gray-200">
                <h2 className="text-base font-bold text-gray-900 mb-3">
                  Syarat & Ketentuan
                </h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  {promo.terms.slice(0, 3).map((term, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">{term}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* KOLOM KANAN (KOTAK AKSI VOUCHER MENETAP / STICKY) */}
            <div className="lg:col-span-4 sticky top-28 space-y-5">
              
              {/* Box Voucher & Tombol CTA (Tanpa Border) */}
              <div className="bg-white rounded-sm p-6 shadow-sm text-center">
                
                <span className="inline-block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  Kode Promo Resmi
                </span>
                
                {/* Kode Voucher Besar Tanpa Border */}
                <div className="p-3.5 bg-gray-100 rounded-sm mb-4">
                  <span className="font-mono text-xl sm:text-2xl font-black text-[#003C71] tracking-wider block">
                    {promo.code}
                  </span>
                </div>

                {/* Tombol Salin Kode */}
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className={`w-full py-3 px-4 rounded-sm text-sm font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 mb-3 ${
                    copied
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-white text-gray-800 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-emerald-600" />
                      <span>Kode Berhasil Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="text-gray-600" />
                      <span>Salin Kode Voucher</span>
                    </>
                  )}
                </button>

                {/* Tombol Pakai Promo (Arahkan ke booking) */}
                <button
                  type="button"
                  onClick={handleUsePromo}
                  className="w-full py-3.5 px-4 bg-[#F58220] hover:bg-[#e07110] text-white font-bold text-sm sm:text-base rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Pakai Promo Sekarang</span>
                  <ArrowRight size={18} />
                </button>

                <p className="text-xs text-gray-500 mt-3">
                  Kode voucher akan otomatis terpasang di formulir pemesanan tiket Anda.
                </p>

              </div>

              {/* Maskot Info Box */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-sm p-4 flex items-center gap-3">
                <div className="w-14 h-14 relative flex-shrink-0">
                  <Image
                    src="/Maskot/maskot_lambai.webp"
                    alt="Maskot KAI"
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs text-[#003C71]">
                  <p className="font-bold">Butuh Bantuan Tiket?</p>
                  <p className="text-gray-600 mt-0.5">
                    Hubungi Contact Center KAI 121 atau kunjungi stasiun terdekat.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* PROMO MENARIK LAINNYA */}
          {relatedPromos.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Promo Menarik Lainnya
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Jelajahi penawaran tiket kereta api ke berbagai destinasi lainnya
                  </p>
                </div>
                <Link
                  href="/promo"
                  className="text-xs sm:text-sm font-bold text-[#003C71] hover:underline flex items-center gap-1"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPromos.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/promo/${rel.id}`}
                    className="bg-[#003C71] rounded-sm overflow-hidden border border-[#002a50] shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col group"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                      <img
                        src={rel.image}
                        alt={rel.route}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div
                        className="absolute bottom-0 left-0 right-0 h-5 bg-[#003C71]"
                        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
                      />
                    </div>
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between text-white">
                      <div>
                        <p className="text-[11px] font-semibold text-white/75 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Train size={12} className="text-[#F58220]" />
                          <span>{rel.route}</span>
                        </p>
                        <h3 className="text-base sm:text-lg font-bold tracking-tight text-white mb-2">
                          {rel.headline}
                        </h3>
                        <p className="text-xs text-white/80 leading-relaxed line-clamp-2">
                          {rel.tagline}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-end">
                        <span className="text-xs font-bold text-white group-hover:text-[#F58220] flex items-center gap-1 transition-colors">
                          <span>Buka Promo</span>
                          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </MainLayout>
  );
}
