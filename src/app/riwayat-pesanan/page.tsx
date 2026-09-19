"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Train,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  QrCode,
  Download,
  ExternalLink,
  ChevronRight,
  X
} from "lucide-react";

interface TicketItem {
  id: string;
  code: string;
  trainName: string;
  trainCode: string;
  trainClass: string;
  departureStation: string;
  departureStationCode: string;
  departureTime: string;
  departureDate: string;
  arrivalStation: string;
  arrivalStationCode: string;
  arrivalTime: string;
  arrivalDate: string;
  duration: string;
  passengerName: string;
  seatNumber: string;
  price: string;
  paymentMethod: string;
  status: "LUNAS" | "SELESAI" | "DIBATALKAN";
  isUpcoming: boolean;
}

export default function RiwayatPesananPage() {
  const { user, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<"semua" | "aktif" | "selesai">("semua");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);

  const userName = user?.name || "Rifqi Muhadzib Ahdan";

  const dummyTickets: TicketItem[] = [
    {
      id: "t-1",
      code: "KAI-88A9W2",
      trainName: "ARGO WILIS",
      trainCode: "9A",
      trainClass: "Eksekutif (AA)",
      departureStation: "Surabaya Gubeng",
      departureStationCode: "SGU",
      departureTime: "08:30 WIB",
      departureDate: "Kamis, 24 Sep 2026",
      arrivalStation: "Bandung",
      arrivalStationCode: "BD",
      arrivalTime: "18:17 WIB",
      arrivalDate: "Kamis, 24 Sep 2026",
      duration: "9j 47m",
      passengerName: userName,
      seatNumber: "Eksekutif 1 / 2D",
      price: "Rp840.000",
      paymentMethod: "BNI Virtual Account",
      status: "LUNAS",
      isUpcoming: true
    },
    {
      id: "t-2",
      code: "KAI-44B7X1",
      trainName: "TAKSAKA",
      trainCode: "68",
      trainClass: "Eksekutif (A)",
      departureStation: "Gambir",
      departureStationCode: "GMR",
      departureTime: "09:20 WIB",
      departureDate: "Sabtu, 05 Sep 2026",
      arrivalStation: "Yogyakarta",
      arrivalStationCode: "YK",
      arrivalTime: "16:45 WIB",
      arrivalDate: "Sabtu, 05 Sep 2026",
      duration: "7j 25m",
      passengerName: userName,
      seatNumber: "Eksekutif 3 / 8A",
      price: "Rp580.000",
      paymentMethod: "BCA Virtual Account",
      status: "SELESAI",
      isUpcoming: false
    },
    {
      id: "t-3",
      code: "KAI-12P9K0",
      trainName: "LODAYA",
      trainCode: "92",
      trainClass: "Ekonomi Premium (C)",
      departureStation: "Bandung",
      departureStationCode: "BD",
      departureTime: "07:05 WIB",
      departureDate: "Minggu, 16 Ags 2026",
      arrivalStation: "Solo Balapan",
      arrivalStationCode: "SLO",
      arrivalTime: "15:20 WIB",
      arrivalDate: "Minggu, 16 Ags 2026",
      duration: "8j 15m",
      passengerName: userName,
      seatNumber: "Ekonomi 2 / 12B",
      price: "Rp320.000",
      paymentMethod: "Mandiri Virtual Account",
      status: "SELESAI",
      isUpcoming: false
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredTickets = dummyTickets.filter((ticket) => {
    if (activeTab === "aktif") return ticket.isUpcoming;
    if (activeTab === "selesai") return !ticket.isUpcoming;
    return true;
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 pb-20 pt-[88px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">

          {/* Banner Header KAI */}
          <div className="bg-[#003C71] text-white border border-[#002a50] rounded-sm overflow-hidden shadow-xs">
            {/* Garis Aksen Oranye Khas KAI */}
            <div className="h-1.5 w-full bg-[#F58220]" />

            <div className="p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 drop-shadow-sm">
                  <Image
                    src="/Maskot/maskot_lambai.webp"
                    alt="Maskot KAI"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-[#F58220] text-white px-2.5 py-0.5 rounded-sm">
                      Daftar Pesanan
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#003C71] bg-white px-2.5 py-0.5 rounded-sm shadow-xs">
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
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Riwayat Pemesanan Tiket
                  </h1>
                  <p className="text-xs sm:text-sm text-white/85 mt-1">
                    Halo, <span className="font-bold text-[#F58220]">{userName}</span>! Berikut adalah riwayat perjalanan dan tiket kereta api Anda.
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 w-full md:w-auto shrink-0">
                <Link
                  href="/"
                  className="w-full text-center px-4 py-2.5 bg-[#F58220] hover:bg-[#d46a10] text-white text-xs font-bold rounded-sm transition-colors shadow-xs"
                >
                  + Pesan Tiket Baru
                </Link>
                <Link
                  href="/cek-pesanan"
                  className="w-full text-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-medium rounded-sm transition-colors"
                >
                  Cari Kode Lain
                </Link>
              </div>
            </div>
          </div>

          {/* Filter Tab Bar */}
          <div className="bg-white border border-gray-200 rounded-sm p-1.5 flex items-center gap-1 shadow-xs">
            <button
              onClick={() => setActiveTab("semua")}
              className={`px-4 py-2 text-xs font-bold rounded-sm transition-colors cursor-pointer ${
                activeTab === "semua"
                  ? "bg-[#003C71] text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              Semua Pesanan ({dummyTickets.length})
            </button>
            <button
              onClick={() => setActiveTab("aktif")}
              className={`px-4 py-2 text-xs font-bold rounded-sm transition-colors cursor-pointer ${
                activeTab === "aktif"
                  ? "bg-[#003C71] text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              Tiket Aktif ({dummyTickets.filter((t) => t.isUpcoming).length})
            </button>
            <button
              onClick={() => setActiveTab("selesai")}
              className={`px-4 py-2 text-xs font-bold rounded-sm transition-colors cursor-pointer ${
                activeTab === "selesai"
                  ? "bg-[#003C71] text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              Selesai ({dummyTickets.filter((t) => !t.isUpcoming).length})
            </button>
          </div>

          {/* List Kartu Riwayat Tiket */}
          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-sm p-12 text-center">
                <FileText size={36} className="text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#003C71]">Tidak ada riwayat pemesanan</h3>
                <p className="text-xs text-gray-500 mt-1">Anda belum memiliki tiket di kategori ini.</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs hover:border-[#003C71] transition-colors"
                >
                  {/* Top Bar Kartu: Kode Booking & Status */}
                  <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span>Kode Booking:</span>
                        <span className="font-bold text-[#003C71] font-mono tracking-wider">{ticket.code}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(ticket.code)}
                        className="text-xs text-gray-500 hover:text-[#003C71] p-1 rounded-sm hover:bg-gray-200 transition-colors cursor-pointer flex items-center gap-1"
                        title="Salin Kode Booking"
                      >
                        {copiedCode === ticket.code ? (
                          <Check size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {ticket.status === "LUNAS" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-black bg-emerald-600 text-white shadow-xs tracking-wide">
                          <CheckCircle2 size={13} className="text-white" />
                          <span>LUNAS / SIAP DIGUNAKAN</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-sm text-xs font-bold bg-gray-200 text-gray-700 border border-gray-300">
                          SELESAI
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Kartu: Info Perjalanan */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      {/* Bagian Rute & Kereta */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <Train size={16} className="text-[#003C71]" />
                          <span className="font-bold text-sm text-[#003C71]">{ticket.trainName} ({ticket.trainCode})</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-600 font-medium">{ticket.trainClass}</span>
                        </div>

                        {/* Jadwal dan Rute */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3 bg-gray-50/70 p-3 rounded-sm border border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500 font-medium">{ticket.departureDate}</p>
                            <p className="text-lg font-bold text-[#003C71] leading-tight mt-0.5">{ticket.departureTime}</p>
                            <p className="text-xs font-semibold text-gray-800">{ticket.departureStation} ({ticket.departureStationCode})</p>
                          </div>

                          <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-[11px] text-gray-500 font-medium">{ticket.duration}</span>
                            <div className="w-full flex items-center gap-1 my-1">
                              <div className="h-0.5 flex-1 bg-gray-300" />
                              <ArrowRight size={14} className="text-[#F58220] shrink-0" />
                            </div>
                            <span className="text-[10px] text-green-600 font-bold">Langsung</span>
                          </div>

                          <div className="sm:text-right">
                            <p className="text-xs text-gray-500 font-medium">{ticket.arrivalDate}</p>
                            <p className="text-lg font-bold text-[#003C71] leading-tight mt-0.5">{ticket.arrivalTime}</p>
                            <p className="text-xs font-semibold text-gray-800">{ticket.arrivalStation} ({ticket.arrivalStationCode})</p>
                          </div>
                        </div>

                        {/* Penumpang & Kursi */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-gray-600 pt-1">
                          <div>
                            <span className="text-gray-500">Penumpang: </span>
                            <span className="font-semibold text-gray-900">{ticket.passengerName}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Kursi: </span>
                            <span className="font-bold text-[#003C71]">{ticket.seatNumber}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Metode Bayar: </span>
                            <span className="font-medium text-gray-800">{ticket.paymentMethod}</span>
                          </div>
                        </div>
                      </div>

                      {/* Kolom Kanan: Harga & Tombol Aksi */}
                      <div className="lg:w-48 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
                        <div>
                          <p className="text-xs text-gray-500">Total Biaya</p>
                          <p className="text-lg font-bold text-[#F58220] leading-tight mt-0.5">{ticket.price}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Sudah termasuk asuransi & PPN</p>
                        </div>

                        <div className="space-y-2 mt-4">
                          <Link
                            href={`/cek-pesanan?code=${ticket.code}`}
                            className="w-full py-2 px-3 bg-[#003C71] hover:bg-[#002f59] text-white text-xs font-bold rounded-sm transition-colors text-center block"
                          >
                            Detail & E-Tiket
                          </Link>
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="w-full py-1.5 px-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <QrCode size={13} className="text-[#003C71]" />
                            <span>Boarding Pass</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {/* Modal Boarding Pass & QR Code Ringkas */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white w-full max-w-md rounded-sm overflow-hidden shadow-2xl border border-gray-300">
            {/* Header Modal */}
            <div className="bg-[#003C71] text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode size={18} className="text-[#F58220]" />
                <span className="font-bold text-sm">Boarding Pass Resmi KAI</span>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-white/80 hover:text-white p-1 rounded-sm cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* QR Code Dummy Box */}
              <div className="bg-gray-50 p-4 border border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center text-center">
                <div className="w-36 h-36 bg-white p-2 border border-gray-200 rounded-sm flex items-center justify-center shadow-xs">
                  <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedTicket.code}')` }} />
                </div>
                <p className="text-xs font-mono font-bold text-[#003C71] mt-2 tracking-widest">{selectedTicket.code}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Pindai QR ini pada scanner stasiun keberangkatan</p>
              </div>

              {/* Data Singkat */}
              <div className="space-y-2 text-xs border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Kereta & Kelas</span>
                  <span className="font-bold text-[#003C71]">{selectedTicket.trainName} • {selectedTicket.trainClass}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rute Perjalanan</span>
                  <span className="font-semibold text-gray-900">{selectedTicket.departureStationCode} &rarr; {selectedTicket.arrivalStationCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jadwal Keberangkatan</span>
                  <span className="font-semibold text-gray-900">{selectedTicket.departureDate} ({selectedTicket.departureTime})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nama Penumpang</span>
                  <span className="font-bold text-gray-900">{selectedTicket.passengerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nomor Kursi</span>
                  <span className="font-bold text-[#F58220]">{selectedTicket.seatNumber}</span>
                </div>
              </div>

              {/* Tombol Aksi Modal */}
              <div className="flex gap-2 pt-2">
                <Link
                  href={`/cek-pesanan?code=${selectedTicket.code}`}
                  className="flex-1 py-2 text-center bg-[#003C71] hover:bg-[#002f59] text-white text-xs font-bold rounded-sm transition-colors"
                >
                  Buka Halaman Lengkap
                </Link>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-sm hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
