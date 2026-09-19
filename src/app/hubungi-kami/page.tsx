"use client";

import React from "react";
import Image from "next/image";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";

export default function HubungiKamiPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/60 text-gray-900 pt-[72px] sm:pt-[84px] selection:bg-[#003C71] selection:text-white pb-24">
        
        {/* ============================================================ */}
        {/* HERO BANNER — Natural Photo Atmosphere (Not Too Blue) */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden bg-slate-950 text-white border-b border-gray-200">
          {/* Background Image: background_cs.webp - Natural Office Atmosphere */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/Background/background_cs.webp"
              alt="Customer Service KAI"
              fill
              className="object-cover object-center opacity-85"
              priority
            />
            {/* Natural gradient overlay: dark left for text legibility, clear on right */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/25" />
          </div>

          {/* Ambient Glow Orbs */}
          <div className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-[#003C71] rounded-full blur-[140px] opacity-40 pointer-events-none z-1" />
          <div className="absolute -bottom-24 -right-24 w-[450px] h-[450px] bg-[#F58220] rounded-full blur-[140px] opacity-30 pointer-events-none z-1" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-14 sm:pb-20 relative z-10">
            {/* Official KAI Badge */}
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
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Hubungi Kami
            </h1>
          </div>
        </section>

        {/* ============================================================ */}
        {/* MAIN SECTION — Layanan Pelanggan (Cards with Blue & Orange Artwork) */}
        {/* ============================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Layanan Pelanggan
            </h2>
          </div>

          {/* 4 Cards Grid with Blue & Orange Artwork Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* ==================== CARD 1: CALL CENTER ==================== */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-md hover:border-[#F58220]/50 transition-all duration-300 flex flex-col group">
              {/* Artwork Banner: Blue & Orange Theme */}
              <div className="h-40 w-full bg-gradient-to-br from-[#001F3F] via-[#003C71] to-[#00264d] relative overflow-hidden flex items-center justify-center">
                {/* Glowing Orbs */}
                <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#F58220] rounded-full blur-2xl opacity-45 group-hover:opacity-65 transition-opacity" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#005bb5] rounded-full blur-xl opacity-60" />
                
                {/* Soundwave lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 120">
                  <path d="M10 60 Q50 25 100 60 T190 60" fill="none" stroke="#F58220" strokeWidth="2.5" />
                  <path d="M10 75 Q50 45 100 75 T190 75" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                </svg>

                {/* Center Graphic */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F58220] to-[#FFA048] flex items-center justify-center text-white shadow-md">
                      <Phone size={20} strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#001F3F]/85 border border-[#F58220]/50 px-3 py-0.5 rounded-full shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F58220] animate-pulse" />
                    Telepon 24 Jam
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                      CALL CENTER
                    </span>
                    <a
                      href="tel:121"
                      className="text-gray-400 hover:text-[#003C71] transition-colors"
                      title="Panggil 121"
                    >
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                  <a
                    href="tel:121"
                    className="text-lg font-extrabold text-gray-900 hover:text-[#003C71] transition-colors block"
                  >
                    121 / (021) 121
                  </a>
                </div>
              </div>
            </div>

            {/* ==================== CARD 2: WHATSAPP ==================== */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-md hover:border-[#25D366]/50 transition-all duration-300 flex flex-col group">
              {/* Artwork Banner: Blue & Orange Theme */}
              <div className="h-40 w-full bg-gradient-to-br from-[#001F3F] via-[#003C71] to-[#00264d] relative overflow-hidden flex items-center justify-center">
                {/* Glowing Orbs */}
                <div className="absolute -top-6 -left-6 w-28 h-28 bg-[#F58220] rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#25D366] rounded-full blur-2xl opacity-35" />

                {/* Geometric Chat Bubbles Decor */}
                <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 200 120">
                  <circle cx="165" cy="35" r="22" fill="none" stroke="#F58220" strokeWidth="2" strokeDasharray="4 4" />
                  <circle cx="35" cy="85" r="18" fill="none" stroke="#25D366" strokeWidth="1.5" />
                </svg>

                {/* Center Graphic */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#25D366] to-[#1ebe5d] flex items-center justify-center text-white shadow-md">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                    </div>
                  </div>
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#001F3F]/85 border border-[#25D366]/50 px-3 py-0.5 rounded-full shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                    Pesan Cepat
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                      WHATSAPP
                    </span>
                    <a
                      href="https://wa.me/6281122233121"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#25D366] transition-colors"
                      title="Kirim Pesan WhatsApp"
                    >
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                  <a
                    href="https://wa.me/6281122233121"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-extrabold text-gray-900 hover:text-[#003C71] transition-colors block"
                  >
                    +62 811 2223 3121
                  </a>
                </div>
              </div>
            </div>

            {/* ==================== CARD 3: EMAIL ==================== */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-md hover:border-[#003C71]/50 transition-all duration-300 flex flex-col group">
              {/* Artwork Banner: Blue & Orange Theme */}
              <div className="h-40 w-full bg-gradient-to-br from-[#001F3F] via-[#003C71] to-[#00264d] relative overflow-hidden flex items-center justify-center">
                {/* Glowing Orbs */}
                <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#F58220] rounded-full blur-2xl opacity-45 group-hover:opacity-65 transition-opacity" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#005bb5] rounded-full blur-xl opacity-60" />

                {/* Envelope flight path */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 120">
                  <path d="M20 40 L100 85 L180 40" fill="none" stroke="#F58220" strokeWidth="2" strokeDasharray="5 4" />
                </svg>

                {/* Center Graphic */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#003C71] to-[#005bb5] border border-white/30 flex items-center justify-center text-[#F58220] shadow-md">
                      <Mail size={20} strokeWidth={2.3} className="text-white" />
                    </div>
                  </div>
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#001F3F]/85 border border-[#F58220]/50 px-3 py-0.5 rounded-full shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F58220]" />
                    Email Resmi
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                      EMAIL
                    </span>
                    <a
                      href="mailto:cs@kai.id"
                      className="text-gray-400 hover:text-[#003C71] transition-colors"
                      title="Kirim Email ke cs@kai.id"
                    >
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                  <a
                    href="mailto:cs@kai.id"
                    className="text-lg font-extrabold text-gray-900 hover:text-[#003C71] transition-colors block"
                  >
                    cs@kai.id
                  </a>
                </div>
              </div>
            </div>

            {/* ==================== CARD 4: MEDIA SOSIAL ==================== */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-md hover:border-[#F58220]/50 transition-all duration-300 flex flex-col group">
              {/* Artwork Banner: Blue & Orange Theme */}
              <div className="h-40 w-full bg-gradient-to-br from-[#001F3F] via-[#003C71] to-[#00264d] relative overflow-hidden flex items-center justify-center">
                {/* Glowing Orbs */}
                <div className="absolute -top-6 -left-6 w-28 h-28 bg-[#F58220] rounded-full blur-2xl opacity-45 group-hover:opacity-65 transition-opacity" />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#005bb5] rounded-full blur-xl opacity-60" />

                {/* Floating Social Elements */}
                <div className="relative z-10 flex items-center gap-2.5">
                  {/* Instagram Badge */}
                  <a
                    href="https://instagram.com/kai121_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F58220] via-[#E1306C] to-[#833AB4] flex items-center justify-center text-white shadow-md group-hover:-translate-y-1 transition-transform"
                    title="Instagram @kai121_"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* TikTok Badge */}
                  <a
                    href="https://tiktok.com/@kai121_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-black border border-white/20 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
                    title="TikTok @kai121_"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.02 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </a>

                  {/* YouTube Badge */}
                  <a
                    href="https://youtube.com/@KeretaApiKitaOfficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF0000] to-[#F58220] flex items-center justify-center text-white shadow-md group-hover:-translate-y-1 transition-transform"
                    title="YouTube KAI"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-xs font-bold tracking-wider text-gray-400 uppercase block mb-3">
                    MEDIA SOSIAL
                  </span>
                  <span className="text-lg font-extrabold text-gray-900 block">
                    KAI121_
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
