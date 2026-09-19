"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Phone,
  Mail,
  Building2,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  Train,
} from "lucide-react";

export default function HubungiKamiPage() {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bookingCode: "",
    category: "tiket",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        bookingCode: "",
        category: "tiket",
        message: "",
      });
    }, 800);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-white text-gray-900 pt-[72px] sm:pt-[84px] selection:bg-[#003C71] selection:text-white">
        
        {/* ============================================================ */}
        {/* HERO BANNER — Matches Reference: Photo-rich, Not Too Blue */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden bg-slate-950 text-white border-b border-gray-200">
          {/* Background Image: background_cs.webp - Natural Photo Atmosphere */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/Background/background_cs.webp"
              alt="Customer Service KAI"
              fill
              className="object-cover object-center opacity-85"
              priority
            />
            {/* Natural gradient overlay: dark left for text legibility, revealing real photo colors on right */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/25" />
          </div>

          {/* Subtle Ambient Blue & Orange Glow Orbs */}
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

            {/* Page Title */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Hubungi Kami
            </h1>
          </div>
        </section>

        {/* ============================================================ */}
        {/* MAIN SECTION — Layanan Pelanggan (Matching Reference Cards) */}
        {/* ============================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Layanan Pelanggan
            </h2>
          </div>

          {/* 4 Cards Grid - Matches Screenshot Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* Card 1: CALL CENTER */}
            <a
              href="tel:121"
              className="bg-[#F4F6F9] hover:bg-[#EBF0F7] rounded-xl p-6 transition-all border border-gray-200/60 flex flex-col justify-between min-h-[160px] group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-white shadow-xs flex items-center justify-center text-[#003C71] mb-5 border border-gray-100">
                <Phone size={20} strokeWidth={2.2} />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase block mb-1">
                  CALL CENTER
                </span>
                <span className="text-base font-bold text-gray-900 block group-hover:text-[#003C71] transition-colors">
                  121 / (021) 121
                </span>
              </div>
            </a>

            {/* Card 2: WHATSAPP */}
            <a
              href="https://wa.me/6281122233121"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F4F6F9] hover:bg-[#EBF0F7] rounded-xl p-6 transition-all border border-gray-200/60 flex flex-col justify-between min-h-[160px] group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-white shadow-xs flex items-center justify-center text-[#003C71] mb-5 border border-gray-100">
                {/* WhatsApp SVG Icon */}
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase block mb-1">
                  WHATSAPP
                </span>
                <span className="text-base font-bold text-gray-900 block group-hover:text-[#003C71] transition-colors">
                  +62 811 2223 3121
                </span>
              </div>
            </a>

            {/* Card 3: EMAIL */}
            <a
              href="mailto:cs@kai.id"
              className="bg-[#F4F6F9] hover:bg-[#EBF0F7] rounded-xl p-6 transition-all border border-gray-200/60 flex flex-col justify-between min-h-[160px] group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-white shadow-xs flex items-center justify-center text-[#003C71] mb-5 border border-gray-100">
                <Mail size={20} strokeWidth={2.2} />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase block mb-1">
                  EMAIL
                </span>
                <span className="text-base font-bold text-gray-900 block group-hover:text-[#003C71] transition-colors">
                  cs@kai.id
                </span>
              </div>
            </a>

            {/* Card 4: MEDIA SOSIAL */}
            <div className="bg-[#F4F6F9] rounded-xl p-6 border border-gray-200/60 flex flex-col justify-between min-h-[160px]">
              {/* Row of Social Circle Icons */}
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                {/* Facebook */}
                <a
                  href="https://facebook.com/keretaapikita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white shadow-xs flex items-center justify-center text-[#003C71] hover:bg-[#003C71] hover:text-white transition-colors border border-gray-100"
                  title="Facebook KAI121"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.7 5H18V0h-3.8C10.8 0 9 1.6 9 4.6V8z" />
                  </svg>
                </a>

                {/* X / Twitter */}
                <a
                  href="https://x.com/kai121"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white shadow-xs flex items-center justify-center text-[#003C71] hover:bg-[#003C71] hover:text-white transition-colors border border-gray-100"
                  title="X (Twitter) @KAI121"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/kai121_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white shadow-xs flex items-center justify-center text-[#003C71] hover:bg-[#003C71] hover:text-white transition-colors border border-gray-100"
                  title="Instagram @kai121_"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com/@kai121_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white shadow-xs flex items-center justify-center text-[#003C71] hover:bg-[#003C71] hover:text-white transition-colors border border-gray-100"
                  title="TikTok @kai121_"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.02 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@KeretaApiKitaOfficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white shadow-xs flex items-center justify-center text-[#003C71] hover:bg-[#003C71] hover:text-white transition-colors border border-gray-100"
                  title="YouTube KAI"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
              <div>
                <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase block mb-1">
                  MEDIA SOSIAL
                </span>
                <span className="text-base font-bold text-gray-900 block">
                  KAI121_
                </span>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* SECTION 2: FORMULIR PENGADUAN & KANTOR PUSAT */}
          {/* ============================================================ */}
          <div className="mt-16 sm:mt-20 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
              
              {/* Kolom Kiri: Formulir Kirim Pesan (7 cols) */}
              <div className="lg:col-span-7">
                <div className="mb-6">
                  <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider block mb-1">
                    Formulir Aspirasi & Bantuan
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Kirim Pesan atau Pertanyaan
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Sampaikan keluhan, pertanyaan jadwal, atau saran perbaikan layanan kepada manajemen KAI.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 size={24} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-base font-bold text-emerald-900 mb-1">
                      Pesan Anda Berhasil Terkirim
                    </h4>
                    <p className="text-sm text-emerald-700 mb-4 max-w-md mx-auto">
                      Terima kasih atas laporan Anda. Tim Customer Service KAI akan meninjau dan merespons pesan Anda melalui email maksimal dalam 1x24 jam kerja.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-5 py-2.5 bg-[#003C71] text-white text-sm font-bold rounded-md hover:bg-[#002B52] transition-colors cursor-pointer"
                    >
                      Kirim Pesan Lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Nama sesuai KTP"
                          className="w-full px-3.5 py-2.5 bg-white rounded-md border border-gray-300 focus:border-[#003C71] focus:ring-1 focus:ring-[#003C71] text-sm text-gray-900 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Alamat Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="contoh@email.com"
                          className="w-full px-3.5 py-2.5 bg-white rounded-md border border-gray-300 focus:border-[#003C71] focus:ring-1 focus:ring-[#003C71] text-sm text-gray-900 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="08xxxxxxxxxx"
                          className="w-full px-3.5 py-2.5 bg-white rounded-md border border-gray-300 focus:border-[#003C71] focus:ring-1 focus:ring-[#003C71] text-sm text-gray-900 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Kode Booking <span className="text-gray-400 font-normal">(Jika ada)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.bookingCode}
                          onChange={(e) => setFormData({ ...formData, bookingCode: e.target.value })}
                          placeholder="Misal: KAI-88A9W2"
                          className="w-full px-3.5 py-2.5 bg-white rounded-md border border-gray-300 focus:border-[#003C71] focus:ring-1 focus:ring-[#003C71] text-sm text-gray-900 uppercase outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Kategori Layanan <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white rounded-md border border-gray-300 focus:border-[#003C71] focus:ring-1 focus:ring-[#003C71] text-sm text-gray-900 outline-none transition-all cursor-pointer"
                      >
                        <option value="tiket">Pertanyaan Pemesanan & Jadwal Tiket</option>
                        <option value="pembayaran">Kendala Pembayaran & Status Transaksi</option>
                        <option value="reschedule">Reschedule & Pengembalian Dana (Refund)</option>
                        <option value="lostfound">Barang Tertinggal di Kereta / Stasiun</option>
                        <option value="saran">Kritik, Saran & Aspirasi Penumpang</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Isi Pesan / Pertanyaan <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tuliskan secara jelas kendala atau pertanyaan yang ingin Anda sampaikan..."
                        className="w-full px-3.5 py-2.5 bg-white rounded-md border border-gray-300 focus:border-[#003C71] focus:ring-1 focus:ring-[#003C71] text-sm text-gray-900 outline-none transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-3 bg-[#003C71] hover:bg-[#002B52] text-white text-sm font-bold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Mengirim Pesan...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Kirim Pesan Sekarang</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Kolom Kanan: Layanan Stasiun & Kantor Pusat (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Info Card: CS Stasiun */}
                <div className="bg-[#F8F9FA] rounded-xl p-6 border border-gray-200/70">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#003C71] text-white flex items-center justify-center">
                      <Train size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">
                        Customer Service on Station
                      </h4>
                      <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-sm">
                        Buka Setiap Hari (08.00 - 20.00 WIB)
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                    Loket layanan pelanggan langsung tersedia di seluruh stasiun besar, termasuk Stasiun Gambir, Pasar Senen, Bandung, Cirebon, Semarang Tawang, Purwokerto, Yogyakarta, Solo Balapan, Surabaya Gubeng, dan Malang.
                  </p>
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Clock size={14} className="text-[#003C71]" />
                    <span>Layanan tatap muka, pembatalan darurat, &amp; validasi tiket manual.</span>
                  </div>
                </div>

                {/* Info Card: Kantor Pusat KAI */}
                <div className="bg-[#F8F9FA] rounded-xl p-6 border border-gray-200/70">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#003C71] text-white flex items-center justify-center">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">
                        Kantor Pusat PT Kereta Api Indonesia (Persero)
                      </h4>
                      <span className="text-xs text-gray-500 font-medium">
                        Kantor Manajemen &amp; Administrasi
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-[#003C71] flex-shrink-0 mt-0.5" />
                      <span>
                        Jl. Perintis Kemerdekaan No. 1, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40117
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-[#003C71] flex-shrink-0" />
                      <span>(022) 4230031 / 4230039</span>
                    </div>
                  </div>
                </div>

                {/* Link ke FAQ jika hanya ingin jawaban cepat */}
                <div className="p-5 rounded-xl border border-blue-200/60 bg-blue-50/40 flex items-center justify-between gap-4">
                  <div>
                    <h5 className="text-sm font-bold text-[#003C71]">
                      Punya Pertanyaan Tiket &amp; Jadwal?
                    </h5>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Lihat jawaban instan di Pusat Pertanyaan FAQ kami.
                    </p>
                  </div>
                  <Link
                    href="/faq"
                    className="px-3.5 py-2 bg-[#003C71] hover:bg-[#002B52] text-white text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Buka FAQ
                  </Link>
                </div>

              </div>

            </div>
          </div>

        </section>

      </div>
    </MainLayout>
  );
}
