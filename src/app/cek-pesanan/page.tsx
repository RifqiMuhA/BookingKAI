"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Search,
  Train,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Printer,
  Download,
  Mail,
  ArrowRight,
  User,
  QrCode,
  FileText,
  Calendar,
  CreditCard,
  CheckCheck
} from "lucide-react";
import { formatPrice } from "@/lib/mockData";

function CekPesananContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [bookingCode, setBookingCode] = useState(initialCode || "");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Data pesanan aktif (default mock berbasis flow sebelumnya jika ada)
  const [bookingData, setBookingData] = useState<any>(null);

  // Ambil data sesi jika user baru saja memesan
  useEffect(() => {
    try {
      const p = sessionStorage.getItem("booking_passengers");
      const b = sessionStorage.getItem("booking_booker");
      const s = sessionStorage.getItem("booking_selected_seats");

      const passengers = p ? JSON.parse(p) : [{ id: "p1", name: "RIFQI MUHADZIB AHDAN", idNumber: "3271021405980002" }];
      const booker = b ? JSON.parse(b) : { fullName: "RIFQI MUHADZIB AHDAN", email: "rifqi@email.com", phone: "081234567890" };
      const seats = s ? JSON.parse(s) : { p1: { carriageId: "EKS-1", seatId: "2D" } };

      const mockBooking = {
        code: "KAI-88A9W2",
        status: "LUNAS",
        transactionDate: "08 Sep 2026, 18:45 WIB",
        bookerName: booker.fullName || "RIFQI MUHADZIB AHDAN",
        bookerEmail: booker.email || "rifqi@email.com",
        bookerPhone: booker.phone || "0812-3456-7890",
        trainName: "ARGO WILIS",
        trainId: "9A",
        trainClass: "Eksekutif (AA)",
        date: "Kamis, 10 September 2026",
        originStation: "Surabaya Gubeng",
        originCode: "SGU",
        destStation: "Bandung",
        destCode: "BD",
        departureTime: "08:30 WIB",
        arrivalTime: "18:17 WIB",
        duration: "9j 47m",
        paymentMethod: "Transfer Bank BNI Virtual Account",
        vaNumber: "8277 0812 3456 7890",
        ticketPrice: 840000,
        serviceFee: 0,
        totalPrice: 840000,
        passengers: passengers.map((item: any, idx: number) => {
          const seat = seats[item.id] || { carriageId: "EKS-1", seatId: "2D" };
          return {
            name: item.name || `PENUMPANG ${idx + 1}`,
            idNumber: item.idNumber || "3271021405980002",
            type: "Dewasa",
            seat: `${seat.carriageId.split("-")[1] || seat.carriageId}, ${seat.seatId}`
          };
        })
      };

      setBookingData(mockBooking);

      // Jika ada kode di URL, langsung lakukan pencarian
      if (initialCode) {
        setBookingCode(initialCode.toUpperCase());
        setHasSearched(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, [initialCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = bookingCode.trim().toUpperCase();

    if (!cleanCode) {
      setSearchError("Silakan masukkan Kode Booking tiket Anda.");
      return;
    }

    setIsLoading(true);
    setSearchError("");

    setTimeout(() => {
      setIsLoading(false);
      setHasSearched(true);

      // Terima kode demo atau kode apapun berformat valid (min 6 karakter)
      if (cleanCode === "KAI-88A9W2" || cleanCode === "88A9W2" || cleanCode.length >= 6) {
        setBookingData((prev: any) => ({
          ...prev,
          code: cleanCode.startsWith("KAI-") ? cleanCode : `KAI-${cleanCode}`
        }));
        setSearchError("");
      } else {
        setSearchError("Kode booking tidak ditemukan. Pastikan 6 karakter kode pemesanan sesuai dengan email atau bukti pembayaran Anda.");
      }
    }, 500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-[88px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">

        {/* ===================== HERO CARD PENCARIAN TIKET (COLORED KAI PRIMARY NAVY) ===================== */}
        <div className="bg-[#003C71] text-white border border-[#002a50] rounded-sm overflow-hidden mb-8 shadow-md">
          {/* Garis Aksen Oranye Khas KAI */}
          <div className="h-1.5 w-full bg-[#F58220]" />

          <div className="p-5 sm:p-7">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
              
              {/* Kolom Kiri: Maskot & Pengantar */}
              <div className="flex items-center gap-4 lg:w-5/12 w-full border-b lg:border-b-0 lg:border-r border-white/20 pb-5 lg:pb-0 lg:pr-6">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 drop-shadow-md">
                  <Image
                    src="/Maskot/maskot_jalan.webp"
                    alt="Maskot KAI"
                    width={112}
                    height={112}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight tracking-tight">
                    Cek Pesanan Tiket Kereta
                  </h1>
                  <p className="text-xs text-white/80 mt-1 leading-relaxed">
                    Lihat status pemesanan, periksa nomor kursi gerbong, atau cetak boarding pass resmi KAI.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#003C71] bg-white px-2.5 py-1 rounded-sm shadow-xs">
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
                </div>
              </div>

              {/* Kolom Kanan: Formulir Pencarian */}
              <div className="flex-1 w-full">
                <form onSubmit={handleSearch} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                      Kode Booking <span className="text-[#F58220]">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="text"
                        value={bookingCode}
                        onChange={(e) => {
                          setBookingCode(e.target.value.toUpperCase());
                          if (searchError) setSearchError("");
                        }}
                        placeholder="Contoh: KAI-88A9W2"
                        className="flex-1 px-3.5 py-2.5 bg-white border border-gray-200 rounded-sm text-sm font-bold uppercase tracking-wider text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#F58220] transition-all shadow-inner"
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-[#F58220] hover:bg-[#E07015] text-white text-sm font-bold rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 flex-shrink-0"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Mencari...</span>
                          </>
                        ) : (
                          <>
                            <Search size={16} />
                            <span>Cari Pesanan</span>
                          </>
                        )}
                      </button>
                    </div>

                    <span className="text-[11px] text-white/75 block mt-2">
                      Masukkan 6 karakter kode pemesanan pada email atau bukti bayar Anda.
                    </span>
                  </div>

                  {/* Error Alert */}
                  {searchError && (
                    <div className="p-3 bg-red-900/40 border border-red-400/40 rounded-sm flex items-start gap-2.5 text-xs text-white">
                      <AlertCircle size={16} className="text-red-300 flex-shrink-0 mt-0.5" />
                      <span>{searchError}</span>
                    </div>
                  )}
                </form>
              </div>

            </div>
          </div>
        </div>

        {/* ===================== HASIL PENCARIAN TIKET (KARTU LENGKAP) ===================== */}
        {hasSearched && !searchError && bookingData ? (
          <div className="space-y-6">

            {/* Kartu Utama E-Tiket KAI */}
            <div className="bg-white border border-gray-300 rounded-sm overflow-hidden shadow-xs">
              
              {/* Header Kartu: Status Bar & Maskot Lambai */}
              <div className="bg-[#003C71] text-white px-5 sm:px-6 py-4 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Info Booking */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <Image
                        src="/Logo/logo_kai_putih.webp"
                        alt="Logo KAI"
                        width={64}
                        height={24}
                        className="h-5 w-auto object-contain"
                      />
                      <div className="h-4 w-px bg-white/30" />
                      <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                        E-Tiket Resmi Perjalanan
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-2xl sm:text-3xl font-black tracking-wider text-white">
                        {bookingData.code}
                      </span>
                      <button
                        onClick={() => handleCopy(bookingData.code)}
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1"
                        title="Salin Kode Booking"
                      >
                        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copied ? "Tersalin" : "Salin"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Status Badge & Maskot Lambai */}
                  <div className="flex items-center gap-3">
                    <div className="text-right sm:text-right">
                      <span className="text-[10px] text-white/70 block uppercase tracking-wider">Status Pembayaran</span>
                      <span className="inline-block px-3 py-1 bg-emerald-500 text-white font-black text-xs rounded-sm tracking-wide shadow-xs mt-0.5">
                        {bookingData.status}
                      </span>
                    </div>
                    <div className="hidden sm:block w-14 h-14 relative flex-shrink-0">
                      <Image
                        src="/Maskot/maskot_lambai.webp"
                        alt="Maskot KAI"
                        width={56}
                        height={56}
                        className="w-full h-full object-contain drop-shadow"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Baris Strip Kereta & Tanggal */}
              <div className="bg-[#001F3F] text-white px-5 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Train size={16} className="text-[#F58220]" />
                  <span className="font-bold text-sm text-white">
                    {bookingData.trainName} ({bookingData.trainId})
                  </span>
                  <span className="text-white/60">•</span>
                  <span className="text-[#F58220] font-semibold">{bookingData.trainClass}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar size={14} className="text-[#F58220]" />
                  <span className="font-medium text-white">{bookingData.date}</span>
                </div>
              </div>

              {/* Body: Rute & Timeline Stasiun */}
              <div className="p-5 sm:p-6 border-b border-gray-200 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                  
                  {/* Keberangkatan */}
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Berangkat
                    </span>
                    <p className="text-2xl font-black text-gray-900 leading-none">
                      {bookingData.departureTime}
                    </p>
                    <p className="text-sm font-bold text-[#003C71] mt-1.5">
                      {bookingData.originStation} ({bookingData.originCode})
                    </p>
                  </div>

                  {/* Garis Rute & Durasi */}
                  <div className="text-center flex flex-col items-center justify-center">
                    <span className="text-xs font-semibold text-gray-500 mb-1">
                      Estimasi: {bookingData.duration}
                    </span>
                    <div className="w-full flex items-center gap-2 max-w-[200px]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#003C71]" />
                      <div className="flex-1 border-t-2 border-dashed border-gray-300" />
                      <ArrowRight size={16} className="text-[#F58220] flex-shrink-0" />
                      <div className="flex-1 border-t-2 border-dashed border-gray-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F58220]" />
                    </div>
                    <span className="text-[11px] text-gray-500 mt-1 font-medium">Perjalanan Langsung</span>
                  </div>

                  {/* Kedatangan */}
                  <div className="sm:text-right">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Tiba
                    </span>
                    <p className="text-2xl font-black text-gray-900 leading-none">
                      {bookingData.arrivalTime}
                    </p>
                    <p className="text-sm font-bold text-[#003C71] mt-1.5">
                      {bookingData.destStation} ({bookingData.destCode})
                    </p>
                  </div>

                </div>
              </div>

              {/* Daftar Penumpang & Tempat Duduk */}
              <div className="p-5 sm:p-6 border-b border-gray-200 bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Daftar Penumpang & Tempat Duduk
                  </h3>
                  <span className="text-xs font-medium text-gray-500">
                    {bookingData.passengers.length} Penumpang
                  </span>
                </div>

                <div className="divide-y divide-gray-200 border border-gray-200 rounded-sm overflow-hidden bg-white">
                  {bookingData.passengers.map((p: any, idx: number) => (
                    <div key={idx} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-gray-100 border border-gray-300 rounded-sm text-[#003C71] font-black flex items-center justify-center text-xs flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">
                            {p.name}
                          </p>
                          <p className="text-gray-500 text-[11px] mt-0.5">
                            {p.type} • Nomor Identitas / NIK: <span className="font-mono text-gray-700">{p.idNumber}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className="text-gray-500 font-medium text-[11px]">Tempat Duduk:</span>
                        <span className="px-3 py-1 bg-orange-50 text-[#F58220] border border-orange-200 font-black text-xs rounded-sm">
                          {p.seat}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rincian Pembayaran & Informasi Pemesan */}
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                
                {/* Info Pemesan */}
                <div className="border border-gray-200 rounded-sm p-4 bg-gray-50/40">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5 pb-2 border-b border-gray-200 flex items-center gap-1.5">
                    <User size={14} className="text-[#003C71]" />
                    <span>Data Kontak Pemesan</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nama Pemesan</span>
                      <span className="font-bold text-gray-900">{bookingData.bookerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Alamat Email</span>
                      <span className="font-medium text-gray-800">{bookingData.bookerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nomor Telepon</span>
                      <span className="font-medium text-gray-800">{bookingData.bookerPhone}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-500">Waktu Pembayaran</span>
                      <span className="text-gray-700">{bookingData.transactionDate}</span>
                    </div>
                  </div>
                </div>

                {/* Rincian Tarif & Metode */}
                <div className="border border-gray-200 rounded-sm p-4 bg-gray-50/40">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5 pb-2 border-b border-gray-200 flex items-center gap-1.5">
                    <CreditCard size={14} className="text-[#003C71]" />
                    <span>Rincian Pembayaran</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Metode Bayar</span>
                      <span className="font-bold text-[#003C71]">{bookingData.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tarif Tiket ({bookingData.passengers.length} Penumpang)</span>
                      <span className="font-medium text-gray-800">{formatPrice(bookingData.ticketPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Biaya Layanan & Admin</span>
                      <span className="font-bold text-emerald-600">Gratis (Rp0)</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-sm">
                      <span className="font-bold text-gray-900">Total Pembayaran</span>
                      <span className="font-black text-base text-[#003C71]">
                        {formatPrice(bookingData.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Toolbar Kartu */}
              <div className="px-5 sm:px-6 py-4 bg-gray-100 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText size={16} className="text-[#003C71] flex-shrink-0" />
                  <span>E-Tiket resmi KAI dapat ditunjukkan langsung dari layar smartphone saat boarding di stasiun.</span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
                  <button
                    onClick={handleSendEmail}
                    className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Mail size={14} className="text-[#003C71]" />
                    <span>{emailSent ? "Terkirim ke Email!" : "Kirim ke Email"}</span>
                  </button>

                  <button
                    onClick={() => setShowPrintModal(true)}
                    className="px-4 py-2 bg-[#003C71] hover:bg-[#002850] text-white font-bold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Download size={14} />
                    <span>Unduh PDF</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        ) : hasSearched && searchError ? (
          /* ===================== NOT FOUND STATE (DENGAN MASKOT BINGUNG) ===================== */
          <div className="bg-white border border-gray-300 rounded-sm p-8 text-center shadow-xs">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <Image
                src="/Maskot/maskot_bingung.webp"
                alt="Maskot KAI Bingung"
                width={96}
                height={96}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Kode Booking Tidak Ditemukan
            </h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed mb-5">
              Kami tidak dapat menemukan pesanan dengan kode <span className="font-bold text-gray-900">&ldquo;{bookingCode}&rdquo;</span>. Pastikan kode terdiri dari 6 karakter huruf/angka yang sesuai dengan bukti pembayaran Anda.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setHasSearched(false);
                  setSearchError("");
                }}
                className="px-5 py-2.5 bg-[#003C71] hover:bg-[#002850] text-white text-xs font-bold rounded-sm cursor-pointer transition-colors shadow-xs"
              >
                Cari Lagi
              </button>
            </div>
          </div>
        ) : (
          /* ===================== ASISTEN MASKOT PANDUAN KODE BOOKING (SPEECH BUBBLE & FLOATING MASCOT) ===================== */
          <div className="pt-2 pb-6 px-1">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 max-w-3xl mx-auto">
              
              {/* Maskot KAI Bingung - Berdiri Bebas dengan Bayangan Lantai */}
              <div className="relative flex-shrink-0 flex flex-col items-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md transition-transform hover:scale-105 duration-200">
                  <Image
                    src="/Maskot/maskot_bingung.webp"
                    alt="Maskot KAI Bingung"
                    width={112}
                    height={112}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
                {/* Bayangan lantai maskot */}
                <div className="w-16 h-1.5 bg-gray-300/70 rounded-full blur-[1px] -mt-1" />
              </div>

              {/* Balon Ucapan (Speech Bubble) Maskot */}
              <div className="relative flex-1 bg-white border border-gray-200 rounded-sm p-4 sm:p-5 shadow-xs w-full">
                {/* Segitiga Arah Balon ke Maskot (Desktop: Kiri, Mobile: Atas) */}
                <div className="hidden sm:block absolute top-6 -left-2 w-0 h-0 border-t-[7px] border-t-transparent border-r-[8px] border-r-white border-b-[7px] border-b-transparent filter drop-shadow-[-1px_0_0_rgba(229,231,235,1)]" />
                <div className="block sm:hidden absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-b-[8px] border-b-white border-r-[7px] border-r-transparent filter drop-shadow-[0_-1px_0_rgba(229,231,235,1)]" />

                {/* Headline Balon */}
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5">
                  Di mana saya bisa mendapatkan kode booking?
                </h3>

                {/* Teks Petunjuk */}
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Kode booking terdiri dari 6 karakter kombinasi huruf dan angka (contoh: <span className="font-bold text-[#003C71] font-mono">KAI-88A9W2</span>) yang tertera pada bukti transfer atau email konfirmasi KAI.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ===================== MODAL CETAK TIKET (KOTAK DENGAN SUDUT KECIL) ===================== */}
        {showPrintModal && bookingData && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-gray-300 rounded-sm w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              
              {/* Header Modal */}
              <div className="bg-[#003C71] text-white px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src="/Logo/logo_kai_putih.webp"
                    alt="Logo KAI"
                    width={64}
                    height={24}
                    className="h-5 w-auto object-contain"
                  />
                  <div className="h-4 w-px bg-white/30 mx-1" />
                  <span className="font-bold text-sm tracking-wide">
                    E-Tiket Resmi Boarding Pass
                  </span>
                </div>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="text-white/80 hover:text-white text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Isi E-Tiket */}
              <div className="p-5 space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                      KODE BOOKING
                    </span>
                    <span className="text-2xl font-black text-[#003C71] tracking-wider">
                      {bookingData.code}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-sm uppercase">
                    {bookingData.status}
                  </span>
                </div>

                <div className="bg-gray-50 p-3.5 border border-gray-200 rounded-sm">
                  <div className="flex justify-between items-center font-bold text-sm text-gray-900 mb-1">
                    <span>{bookingData.trainName} ({bookingData.trainId})</span>
                    <span className="text-xs text-[#003C71]">{bookingData.trainClass}</span>
                  </div>
                  <div className="text-gray-600 text-xs">
                    <span>{bookingData.date}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-gray-200">
                    <div>
                      <span className="font-bold text-base text-gray-900 block">{bookingData.departureTime}</span>
                      <span className="text-[11px] text-gray-600 font-semibold">{bookingData.originStation} ({bookingData.originCode})</span>
                    </div>
                    <ArrowRight size={16} className="text-[#F58220]" />
                    <div className="text-right">
                      <span className="font-bold text-base text-gray-900 block">{bookingData.arrivalTime}</span>
                      <span className="text-[11px] text-gray-600 font-semibold">{bookingData.destStation} ({bookingData.destCode})</span>
                    </div>
                  </div>
                </div>

                {/* Penumpang & Kursi */}
                <div className="border border-gray-200 rounded-sm p-3.5 space-y-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Data Penumpang & Nomor Kursi
                  </span>
                  {bookingData.passengers.map((p: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-gray-800">{p.name}</span>
                        <span className="text-gray-500 block text-[10px]">NIK: {p.idNumber}</span>
                      </div>
                      <span className="font-bold text-[#F58220] bg-orange-50 px-2.5 py-0.5 border border-orange-200 rounded-sm text-xs">
                        Kursi {p.seat}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Dummy Barcode Gate Stasiun */}
                <div className="p-3.5 bg-gray-50 border border-dashed border-gray-300 rounded-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white border border-gray-300 rounded-sm flex items-center justify-center flex-shrink-0">
                      <QrCode size={42} className="text-gray-800" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Barcode Gate Boarding</span>
                      <span className="text-[11px] text-gray-500 block">Scan langsung di pintu gate stasiun</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">Total Tarif</span>
                    <span className="font-bold text-sm text-[#003C71]">{formatPrice(bookingData.totalPrice)}</span>
                  </div>
                </div>

              </div>

              {/* Footer Modal */}
              <div className="bg-gray-100 px-5 py-3 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-sm hover:bg-gray-50 cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-[#003C71] hover:bg-[#002850] text-white text-xs font-bold rounded-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer size={14} />
                  <span>Cetak Dokumen</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CekPesananPage() {
  return (
    <MainLayout hideFooter={false}>
      <Suspense fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-sm font-semibold text-[#003C71]">Memuat Halaman Cek Pesanan...</div>
        </div>
      }>
        <CekPesananContent />
      </Suspense>
    </MainLayout>
  );
}
