"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { MainLayout } from "@/components/layout/MainLayout";
import { getStationByCode, TRAIN_SCHEDULES, formatPrice, STATIONS } from "@/lib/mockData";
import { PriceCalendar } from "@/components/booking/PriceCalendar";
import { getPromoByCode, calculatePromoDiscount, isRouteEligibleForPromo } from "@/lib/promosData";
import { TaskSuccessModal } from "@/components/common/TaskSuccessModal";
import {
  ArrowRight,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Train,
  CalendarX,
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  ArrowLeftRight,
  Baby,
  Info,
  MapPin,
  Tag,
  Check,
  CheckCircle2
} from "lucide-react";

// Tipe data kereta setelah dikelompokkan
interface GroupedTrain {
  name: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: {
    Ekonomi?: { id: string; price: number; availableSeats: number };
    Bisnis?: { id: string; price: number; availableSeats: number };
    Eksekutif?: { id: string; price: number; availableSeats: number };
  };
}

// Faktor pengali harga dinamis berdasarkan hari dan tanggal
export function getDatePriceMultiplier(dateStr: string): number {
  if (!dateStr) return 1.0;
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return 1.0;

  const dayOfWeek = d.getDay(); // 0: Min, 1: Sen, 2: Sel, 3: Rab, 4: Kam, 5: Jum, 6: Sab
  const dayOfMonth = d.getDate();

  // Pola variasi harga berdasarkan demand KAI:
  // Selasa: baseline termurah (1.00)
  // Rabu: hari kerja hemat (1.02)
  // Senin: awal pekan (1.05)
  // Kamis: menjelang akhir pekan (1.10)
  // Sabtu: akhir pekan (1.18)
  // Jumat: puncak arus mudik akhir pekan (1.25)
  // Minggu: puncak arus balik akhir pekan (1.30)
  const dayFactors: Record<number, number> = {
    0: 1.30, // Minggu
    1: 1.05, // Senin
    2: 1.00, // Selasa
    3: 1.02, // Rabu
    4: 1.10, // Kamis
    5: 1.25, // Jumat
    6: 1.18, // Sabtu
  };

  const base = dayFactors[dayOfWeek] ?? 1.0;
  // Variasi halus tanggal agar tidak monoton per pekan
  // Tanggal 8 memiliki offset 0 sehingga 8 Sep tetap 1.00 (Rp 79.200)
  const dayOffset = ((dayOfMonth - 8) % 5) * 0.02;

  return Math.round((base + dayOffset) * 100) / 100;
}

export function adjustPriceForDate(basePrice: number, dateStr: string): number {
  const mult = getDatePriceMultiplier(dateStr);
  return Math.round((basePrice * mult) / 1000) * 1000;
}

export function getLowestPriceForDate(
  dateStr: string,
  promoCode?: string,
  originCode?: string,
  destCode?: string
): number {
  let min = Infinity;
  TRAIN_SCHEDULES.forEach(t => {
    // 1. Kelas utama
    const adjPrice = adjustPriceForDate(t.price, dateStr);
    const dMain = calculatePromoDiscount(adjPrice, promoCode, originCode, destCode);
    const effMain = dMain.discountAmount > 0 ? dMain.finalPrice : adjPrice;
    if (effMain < min) min = effMain;

    // 2. Mock kelas turunan (Ekonomi & Bisnis) untuk Eksekutif
    if (t.class === "Eksekutif") {
      const baseEko = Math.round((t.price * 0.4) / 1000) * 1000;
      const adjEko = adjustPriceForDate(baseEko, dateStr);
      const dEko = calculatePromoDiscount(adjEko, promoCode, originCode, destCode);
      const effEko = dEko.discountAmount > 0 ? dEko.finalPrice : adjEko;
      if (effEko < min) min = effEko;

      const baseBis = Math.round((t.price * 0.7) / 1000) * 1000;
      const adjBis = adjustPriceForDate(baseBis, dateStr);
      const dBis = calculatePromoDiscount(adjBis, promoCode, originCode, destCode);
      const effBis = dBis.discountAmount > 0 ? dBis.finalPrice : adjBis;
      if (effBis < min) min = effBis;
    }
  });
  return min === Infinity ? 0 : min;
}

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const originCode = searchParams.get("origin") || "";
  const destCode = searchParams.get("destination") || "";
  const dateStr = searchParams.get("date") || "";
  const passengers = parseInt(searchParams.get("passengers") || "1", 10);
  const infants = parseInt(searchParams.get("infants") || "0", 10);
  const tripType = searchParams.get("tripType") || "one-way";
  const returnDate = searchParams.get("returnDate") || "";
  const isReturnTrip = searchParams.get("isReturnTrip") === "true";
  const departTrainId = searchParams.get("departTrainId") || "";
  const departDateParam = searchParams.get("departDate") || "";
  const promoCode = searchParams.get("promo") || "";
  const activePromo = useMemo(() => getPromoByCode(promoCode), [promoCode]);
  const promoEligibility = useMemo(
    () => isRouteEligibleForPromo(promoCode, originCode, destCode),
    [promoCode, originCode, destCode]
  );

  const [showPromoSuccessModal, setShowPromoSuccessModal] = useState(false);

  useEffect(() => {
    if (promoCode && activePromo && promoEligibility.isEligible) {
      setShowPromoSuccessModal(true);
    }
  }, [promoCode, activePromo, promoEligibility.isEligible]);

  const formatLocalYYYYMMDD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "—";
    const d = new Date(dateString + "T00:00:00");
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const originStation = getStationByCode(originCode);
  const destStation = getStationByCode(destCode);

  const [selectedDate, setSelectedDate] = useState(dateStr || formatLocalYYYYMMDD(new Date()));
  const [isEditingSearch, setIsEditingSearch] = useState(false);

  const [editOrigin, setEditOrigin] = useState(originCode);
  const [editDest, setEditDest] = useState(destCode);
  const [editPassengers, setEditPassengers] = useState(passengers);
  const [editInfants, setEditInfants] = useState(infants);
  const [showPassengerEdit, setShowPassengerEdit] = useState(false);
  const [showEditInfantWarning, setShowEditInfantWarning] = useState(false);
  const [showOriginList, setShowOriginList] = useState(false);
  const [showDestList, setShowDestList] = useState(false);
  const [originSearch, setOriginSearch] = useState("");
  const [destSearch, setDestSearch] = useState("");

  const originFiltered = STATIONS.filter(s => {
    if (s.code === editDest) return false;
    if (!originSearch) return true;
    const q = originSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.city.toLowerCase().includes(q);
  });

  const destFiltered = STATIONS.filter(s => {
    if (s.code === editOrigin) return false;
    if (!destSearch) return true;
    const q = destSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.city.toLowerCase().includes(q);
  });
  
  // Set base date so selected date is in the middle of a 5-day view (so base = selected - 2)
  const initialBaseDate = new Date((dateStr || formatLocalYYYYMMDD(new Date())) + "T00:00:00");
  if (!isNaN(initialBaseDate.getTime())) {
    initialBaseDate.setDate(initialBaseDate.getDate() - 2);
  }
  const [baseDate, setBaseDate] = useState(formatLocalYYYYMMDD(initialBaseDate));
  const [showCalendar, setShowCalendar] = useState(false);
  const [editReturnDate, setEditReturnDate] = useState(searchParams.get("returnDate") || "");
  const [showReturnCalendar, setShowReturnCalendar] = useState(false);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  useEffect(() => {
    if (showEditInfantWarning) {
      const timer = setTimeout(() => setShowEditInfantWarning(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [showEditInfantWarning]);

  const [selectedTrain, setSelectedTrain] = useState<{
    trainName: string;
    depart: string;
    arrive: string;
    duration?: string;
    className: "Ekonomi" | "Bisnis" | "Eksekutif";
    price: number;
    originalPrice?: number;
    id: string;
  } | null>(null);

  const handlePrevDay = () => {
    const d = new Date(baseDate + "T00:00:00");
    d.setDate(d.getDate() - 5);
    setBaseDate(formatLocalYYYYMMDD(d));
  };

  const handleNextDay = () => {
    const d = new Date(baseDate + "T00:00:00");
    d.setDate(d.getDate() + 5);
    setBaseDate(formatLocalYYYYMMDD(d));
  };

  // Check if prev day is past
  const prevDate = new Date(baseDate + "T00:00:00");
  prevDate.setDate(prevDate.getDate() - 5);
  const todayForPrev = new Date();
  todayForPrev.setHours(0, 0, 0, 0);
  const isPrevPast = prevDate.getTime() < todayForPrev.getTime();

  // Group schedules to simulate multi-class trains
  const [groupedTrains, setGroupedTrains] = useState<GroupedTrain[]>([]);

  useEffect(() => {
    // Simulasi memuat data dengan harga dinamis sesuai tanggal terpilih
    const filtered = TRAIN_SCHEDULES;

    // Grouping buatan agar UI matriks terisi
    const groups: Record<string, GroupedTrain> = {};

    filtered.forEach(t => {
      const key = `${t.name}-${t.departureTime}`;
      if (!groups[key]) {
        groups[key] = {
          name: t.name,
          departureTime: t.departureTime,
          arrivalTime: t.arrivalTime,
          duration: t.duration,
          classes: {}
        };
      }

      // Masukkan kelas yang asli dari data dengan penyesuaian tanggal terpilih
      const adjustedPrice = adjustPriceForDate(t.price, selectedDate);
      groups[key].classes[t.class] = {
        id: t.id,
        price: adjustedPrice,
        availableSeats: t.availableSeats
      };

      // Mock kelas tambahan agar grid terlihat penuh seperti Eurostar
      if (t.class === "Eksekutif") {
        if (!groups[key].classes["Ekonomi"]) {
          const baseEko = Math.round((t.price * 0.4) / 1000) * 1000;
          groups[key].classes["Ekonomi"] = {
            id: t.id + "-EKO",
            price: adjustPriceForDate(baseEko, selectedDate),
            availableSeats: Math.floor(Math.random() * 50)
          };
        }
        if (!groups[key].classes["Bisnis"]) {
          const baseBis = Math.round((t.price * 0.7) / 1000) * 1000;
          groups[key].classes["Bisnis"] = {
            id: t.id + "-BIS",
            price: adjustPriceForDate(baseBis, selectedDate),
            availableSeats: Math.floor(Math.random() * 30)
          };
        }
      }
    });

    setGroupedTrains(Object.values(groups).sort((a, b) => a.departureTime.localeCompare(b.departureTime)));
    setSelectedTrain(null); // Reset pilihan jika tanggal berubah
  }, [selectedDate]);

  // Hitung harga termurah efektif untuk hari terpilih (memperhitungkan promo aktif & kelayakan rute)
  const currentDayLowestPrice = useMemo(() => {
    let min = Infinity;
    if (groupedTrains.length > 0) {
      groupedTrains.forEach(train => {
        Object.values(train.classes).forEach(c => {
          if (c) {
            const discountInfo = calculatePromoDiscount(c.price, promoCode, originCode, destCode);
            const eff = discountInfo.discountAmount > 0 ? discountInfo.finalPrice : c.price;
            if (eff < min) min = eff;
          }
        });
      });
    }

    if (min === Infinity) {
      return getLowestPriceForDate(selectedDate, promoCode, originCode, destCode);
    }

    return min;
  }, [groupedTrains, promoCode, originCode, destCode, selectedDate]);

  // Generate tab dates (generate 15 dates starting from baseDate so user can scroll)
  const dateTabs = Array.from({ length: 15 }).map((_, i) => {
    const d = new Date(baseDate + "T00:00:00");
    d.setDate(d.getDate() + i);
    const iso = formatLocalYYYYMMDD(d);

    // Ambil harga terendah tiket yang dinamis bervariasi per tanggal
    const lowestPrice = iso === selectedDate
      ? currentDayLowestPrice
      : getLowestPriceForDate(iso, promoCode, originCode, destCode);

    // Check if past date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = d.getTime() < today.getTime();

    return {
      date: iso,
      day: d.toLocaleDateString("id-ID", { weekday: "short" }),
      dateFormatted: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      lowestPrice,
      isPast
    };
  });

  // Reset selectedTrain and sync selectedDate when searchParams/step changes (e.g. going from outbound to return trip)
  useEffect(() => {
    if (dateStr && dateStr !== selectedDate) {
      setSelectedDate(dateStr);
      const newBase = new Date(dateStr + "T00:00:00");
      if (!isNaN(newBase.getTime())) {
        newBase.setDate(newBase.getDate() - 2);
        setBaseDate(formatLocalYYYYMMDD(newBase));
      }
    }
    setSelectedTrain(null);
  }, [isReturnTrip, dateStr, originCode, destCode]);

  const handleContinue = () => {
    if (!selectedTrain) return;

    if (tripType === "round-trip" && returnDate && !isReturnTrip) {
      // Simpan id tiket keberangkatan lalu reset pilihan tiket
      const currentSelectedId = selectedTrain.id;
      setSelectedTrain(null);

      // Pergi ke pencarian kepulangan (Return Trip)
      const params = new URLSearchParams({
        origin: destCode, // swap
        destination: originCode, // swap
        date: returnDate,
        departDate: selectedDate,
        returnDate: returnDate,
        passengers: String(passengers),
        infants: String(infants),
        tripType: "round-trip",
        isReturnTrip: "true",
        departTrainId: currentSelectedId,
        ...(promoCode ? { promo: promoCode } : {})
      });
      router.push(`/cari?${params.toString()}`);
    } else if (isReturnTrip) {
      // Lanjut isi data dengan ID keberangkatan dan kepulangan (origin & dest diteruskan)
      const promoQuery = promoCode ? `&promo=${encodeURIComponent(promoCode)}` : "";
      router.push(`/isi-data-penumpang?trainId=${departTrainId}&returnTrainId=${selectedTrain.id}&passengers=${passengers}&infants=${infants}&origin=${destCode}&destination=${originCode}${promoQuery}`);
    } else {
      // Sekali jalan (One-way)
      const promoQuery = promoCode ? `&promo=${encodeURIComponent(promoCode)}` : "";
      router.push(`/isi-data-penumpang?trainId=${selectedTrain.id}&passengers=${passengers}&infants=${infants}&origin=${originCode}&destination=${destCode}${promoQuery}`);
    }
  };

  const absoluteLowestPrice = currentDayLowestPrice;

  return (
    <div className="min-h-screen bg-[var(--color-bg-muted)] pb-32 lg:pb-12 pt-0 sm:pt-[32px]">
      {/* Modal Task 3 Selesai */}
      <TaskSuccessModal
        isOpen={showPromoSuccessModal}
        onClose={() => setShowPromoSuccessModal(false)}
        taskNumber={3}
        title="Promo Berhasil Digunakan"
        description="Promo diskon tiket telah aktif dan diterapkan ke daftar kereta. Silakan kembali ke Maze untuk mengisi kuesioner evaluasi PSSUQ."
      />

      {/* 1. Sticky Bar Pencarian Langsung Terbuka & Ramping */}
      <div className="sticky top-0 sm:top-[32px] z-40 bg-[var(--color-primary-dark)] text-white shadow-md border-t-0 sm:border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          {/* Form Edit Langsung Terbuka */}
          {/* Form Edit: 2 Baris Kompak di Mobile, 1 Baris di Desktop */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-1.5 sm:gap-2 bg-white p-1.5 rounded-lg md:rounded-md md:p-0 md:bg-transparent shadow-sm md:shadow-none h-auto md:h-[38px]">
            
            {/* Baris 1 di Mobile: Origin & Destination side-by-side */}
            <div className="flex flex-row items-stretch bg-white rounded-md w-full md:w-[360px] md:flex-initial border border-gray-200 md:border-none relative h-[38px]">
              
              {/* Origin */}
              <div className="flex-1 min-w-0 relative flex items-stretch h-full">
                <button 
                  onClick={() => { setShowOriginList(!showOriginList); setShowDestList(false); setShowPassengerEdit(false); }}
                  className="w-full text-left px-2.5 sm:px-3 py-1.5 border-r border-gray-200 text-black font-medium text-xs outline-none cursor-pointer flex justify-between items-center bg-white rounded-l-md hover:bg-gray-50 transition-colors h-full"
                >
                  <span className="truncate">{getStationByCode(editOrigin)?.city} - {getStationByCode(editOrigin)?.name}</span>
                  <ChevronDown size={12} className="text-gray-400 flex-shrink-0 ml-1" />
                </button>
                {showOriginList && (
                  <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl mt-1 overflow-hidden w-[280px] max-w-[calc(100vw-24px)]">
                    <div className="p-2 border-b border-gray-100">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Cari stasiun asal..."
                        value={originSearch}
                        onChange={e => setOriginSearch(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 outline-none focus:border-[var(--color-primary)] text-black"
                      />
                    </div>
                    <div className="max-h-[250px] overflow-y-auto pb-2">
                      {originFiltered.map(s => (
                        <button
                          key={s.id}
                          onClick={() => { setEditOrigin(s.code); setShowOriginList(false); }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[var(--color-info-bg)] cursor-pointer border-b border-gray-50 last:border-b-0"
                        >
                          <div className="font-semibold text-xs text-[var(--color-primary)]">{s.city} - {s.name}</div>
                          <div className="text-[10px] text-gray-400">{s.code}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Swap Button (selalu tampil baik mobile maupun desktop) */}
              <div className="flex items-center justify-center -mx-2.5 z-10 self-center">
                <button 
                  onClick={() => { const temp = editOrigin; setEditOrigin(editDest); setEditDest(temp); }}
                  className="w-6 h-6 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
                >
                  <ArrowLeftRight size={11} className="text-gray-500" />
                </button>
              </div>
              
              {/* Destination */}
              <div className="flex-1 min-w-0 relative flex items-stretch h-full">
                <button 
                  onClick={() => { setShowDestList(!showDestList); setShowOriginList(false); setShowPassengerEdit(false); }}
                  className="w-full text-left px-2.5 sm:px-3 pl-3.5 sm:pl-4 py-1.5 text-black font-medium text-xs outline-none cursor-pointer flex justify-between items-center bg-white rounded-r-md hover:bg-gray-50 transition-colors h-full"
                >
                  <span className="truncate">{getStationByCode(editDest)?.city} - {getStationByCode(editDest)?.name}</span>
                  <ChevronDown size={12} className="text-gray-400 flex-shrink-0 ml-1" />
                </button>
                {showDestList && (
                  <div className="absolute top-full right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl mt-1 overflow-hidden w-[280px] max-w-[calc(100vw-24px)]">
                    <div className="p-2 border-b border-gray-100">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Cari stasiun tujuan..."
                        value={destSearch}
                        onChange={e => setDestSearch(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 outline-none focus:border-[var(--color-primary)] text-black"
                      />
                    </div>
                    <div className="max-h-[250px] overflow-y-auto pb-2">
                      {destFiltered.map(s => (
                        <button
                          key={s.id}
                          onClick={() => { setEditDest(s.code); setShowDestList(false); }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[var(--color-info-bg)] cursor-pointer border-b border-gray-50 last:border-b-0"
                        >
                          <div className="font-semibold text-xs text-[var(--color-primary)]">{s.city} - {s.name}</div>
                          <div className="text-[10px] text-gray-400">{s.code}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Baris 2 di Mobile / Gabung Sebaris di Desktop: Date, Passengers, Button Cari */}
            <div className="flex items-stretch gap-1.5 sm:gap-2 w-full md:w-auto h-[38px]">
              {/* Date */}
              <div className="bg-white rounded-md flex-1 md:flex-initial md:w-auto flex-shrink-0 border border-gray-200 md:border-none overflow-hidden flex items-stretch h-full">
                <div className="flex divide-x divide-gray-200 w-full h-full">
                  {/* Depart */}
                  <button
                    onClick={() => setShowCalendar(true)}
                    className="flex-1 flex flex-col justify-center items-start px-2 sm:px-3 py-0.5 hover:bg-[var(--color-info-bg)] transition-colors cursor-pointer text-left group min-w-[80px] sm:min-w-[110px] h-full"
                  >
                    <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 tracking-wider flex items-center gap-1 leading-tight">
                      <Calendar size={9} />
                      BERANGKAT
                    </p>
                    <span className="text-black font-normal text-xs whitespace-nowrap leading-tight">
                      {new Date(selectedDate + "T00:00:00").toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}
                    </span>
                  </button>

                  {/* Return */}
                  {editReturnDate ? (
                    <div className="flex-1 flex items-stretch min-w-[95px] sm:min-w-[130px] h-full">
                      <button
                        onClick={() => setShowReturnCalendar(true)}
                        className="flex-1 flex flex-col justify-center items-start px-2 sm:px-3 py-0.5 hover:bg-orange-50 transition-colors cursor-pointer text-left group h-full"
                      >
                        <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 tracking-wider flex items-center gap-1 leading-tight">
                          <Calendar size={9} />
                          KEMBALI
                        </p>
                        <span className="text-black font-normal text-xs whitespace-nowrap leading-tight">
                          {new Date(editReturnDate + "T00:00:00").toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}
                        </span>
                      </button>
                      <button
                        onClick={() => setEditReturnDate("")}
                        className="px-2.5 sm:px-3 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-center border-l border-gray-100 h-full"
                        title="Hapus tanggal pulang"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowReturnCalendar(true)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-info-bg)] transition-colors cursor-pointer min-w-[70px] sm:min-w-[100px] h-full"
                    >
                      <span className="text-sm leading-none font-light">+</span>
                      <span className="text-xs truncate">Pulang</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Passengers */}
              <div className="relative w-28 sm:w-36 flex-shrink-0 flex items-stretch h-full">
                <button 
                  onClick={() => setShowPassengerEdit(!showPassengerEdit)}
                  className="bg-white rounded-md flex items-center justify-between px-2 sm:px-3 py-1.5 h-full w-full cursor-pointer border border-gray-200 md:border-none hover:bg-gray-50 transition-colors"
                >
                  <span className="text-black font-medium text-xs truncate">{editPassengers} Dws{editInfants > 0 ? `, ${editInfants} By` : ""}</span>
                  <ChevronDown size={12} className="text-gray-400 flex-shrink-0 ml-1" />
                </button>
                
                {showPassengerEdit && (
                  <div className="absolute top-full right-0 sm:left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 w-60 max-w-[calc(100vw-24px)] text-black">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="font-bold text-xs text-slate-800">Dewasa</div>
                        <div className="text-[10px] text-gray-500">&gt; 3 Tahun</div>
                      </div>
                      <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-white">
                        <button onClick={() => {
                          const newP = Math.max(1, editPassengers - 1);
                          setEditPassengers(newP);
                          if (editInfants > newP) setEditInfants(newP);
                          setShowEditInfantWarning(false);
                        }} className="px-2.5 py-0.5 bg-slate-100 hover:bg-blue-50 text-[var(--color-primary)] font-bold transition-colors cursor-pointer">−</button>
                        <span className="w-7 text-center text-xs font-bold text-[var(--color-primary-dark)]">{editPassengers}</span>
                        <button onClick={() => {
                          setEditPassengers(Math.min(6, editPassengers + 1));
                          setShowEditInfantWarning(false);
                        }} className="px-2.5 py-0.5 bg-slate-100 hover:bg-blue-50 text-[var(--color-primary)] font-bold transition-colors cursor-pointer">+</button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-xs text-slate-800">Bayi</div>
                        <div className="text-[10px] text-gray-500">&lt; 3 Tahun (Pangku)</div>
                      </div>
                      <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-white">
                        <button onClick={() => {
                          setEditInfants(i => Math.max(0, i - 1));
                          setShowEditInfantWarning(false);
                        }} className="px-2.5 py-0.5 bg-slate-100 hover:bg-blue-50 text-[var(--color-primary)] font-bold transition-colors cursor-pointer">−</button>
                        <span className="w-7 text-center text-xs font-bold text-[var(--color-primary-dark)]">{editInfants}</span>
                        <button onClick={() => {
                          if (editInfants >= editPassengers) {
                            setShowEditInfantWarning(true);
                          } else {
                            setEditInfants(i => i + 1);
                            setShowEditInfantWarning(false);
                          }
                        }} className="px-2.5 py-0.5 bg-slate-100 hover:bg-blue-50 text-[var(--color-primary)] font-bold transition-colors cursor-pointer">+</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cari Button */}
              <button 
                onClick={() => {
                  const searchParamsObj: any = {
                    origin: editOrigin,
                    destination: editDest,
                    date: selectedDate,
                    passengers: String(editPassengers),
                    infants: String(editInfants)
                  };
                  if (editReturnDate) {
                    searchParamsObj.tripType = "round-trip";
                    searchParamsObj.returnDate = editReturnDate;
                  }
                  const qs = new URLSearchParams(searchParamsObj).toString();
                  router.push(`/cari?${qs}`);
                }}
                className="bg-[var(--color-accent)] hover:bg-[#E07015] text-white font-bold px-3 sm:px-5 py-1.5 rounded-md transition-colors cursor-pointer flex-shrink-0 flex items-center justify-center text-xs h-full"
              >
                Cari
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-36 lg:pb-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          {/* Main Content Area (Left Column) */}
          <div className="flex-1 min-w-0 w-full">

            {/* Header Info & Date Strip (Eurostar style) */}
            <div className="mb-4 sm:mb-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-2.5 sm:mb-6 whitespace-nowrap overflow-x-auto hide-scrollbar">
                <span 
                  className="font-bold text-[var(--color-primary-dark)] cursor-pointer hover:underline flex-shrink-0 inline-flex items-center gap-1 sm:gap-1.5" 
                  onClick={() => router.push("/")}
                >
                  <CheckCircle2 size={14} strokeWidth={2.5} className="text-emerald-600 flex-shrink-0" />
                  <span>Pencarian</span>
                </span>
                <ChevronRight size={13} className="text-gray-400 flex-shrink-0" strokeWidth={2} />
                {isReturnTrip ? (
                  <>
                    <span 
                      className="font-bold text-[var(--color-primary-dark)] cursor-pointer hover:underline flex-shrink-0 inline-flex items-center gap-1 sm:gap-1.5"
                      onClick={() => router.back()}
                    >
                      <CheckCircle2 size={14} strokeWidth={2.5} className="text-emerald-600 flex-shrink-0" />
                      <span>Pilih Kereta Berangkat</span>
                    </span>
                    <ChevronRight size={13} className="text-gray-400 flex-shrink-0" strokeWidth={2} />
                    <span className="font-medium text-gray-500 flex-shrink-0">Pilih Kereta Pulang</span>
                  </>
                ) : (
                  <span className="font-medium text-gray-500 flex-shrink-0">Pilih Kereta</span>
                )}
              </div>

              {/* Big Title */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-lg sm:text-2xl md:text-3xl font-bold text-[var(--color-primary-dark)] mb-3 sm:mb-6 tracking-tight">
                <Train className="w-5 h-5 sm:w-8 sm:h-8 text-[var(--color-primary-dark)] flex-shrink-0" strokeWidth={2.5} />
                <span className="truncate">{originStation?.city || originCode}</span>
                <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" strokeWidth={2.5} />
                <span className="truncate">{destStation?.city || destCode}</span>
                {isReturnTrip && (
                  <span className="px-2 py-0.5 bg-[var(--color-info-bg)] text-[var(--color-primary)] text-xs sm:text-sm rounded-full font-bold tracking-normal">
                    Tiket Pulang
                  </span>
                )}
              </div>

              {/* Date Strip Container */}
              <div className="bg-white rounded-md shadow-sm border border-gray-200 flex flex-col overflow-hidden relative">
                
                {/* Month/Year Header — static, non-clickable, no hover */}
                <div className="w-full bg-gray-50 border-b border-gray-200 py-2 sm:py-2.5 flex justify-center items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 select-none">
                  <Calendar size={13} className="text-[var(--color-primary)]" />
                  <span>{new Date(baseDate + "T00:00:00").toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</span>
                </div>

                <div className="flex w-full relative">
                  <button 
                    onClick={handlePrevDay}
                    disabled={isPrevPast}
                    className={`flex-shrink-0 w-8 sm:w-12 flex items-center justify-center border-r border-gray-200 transition-colors z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)]
                      ${isPrevPast ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-400 hover:text-[var(--color-primary)] hover:bg-gray-50 cursor-pointer'}`}
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex flex-1 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                    {dateTabs.map((tab) => {
                      const isSelected = selectedDate === tab.date;
                      const isPast = tab.isPast;
                      return (
                        <button
                          key={tab.date}
                          disabled={isPast}
                          onClick={() => setSelectedDate(tab.date)}
                          className={`snap-start snap-always flex-shrink-0 w-[105px] sm:w-[140px] py-2.5 sm:py-4 px-1.5 sm:px-2 flex flex-col items-center justify-center border-t-4 transition-all relative group border-r border-gray-100 last:border-r-0
                            ${isPast 
                              ? "border-t-transparent bg-gray-50 cursor-not-allowed" 
                              : isSelected
                                ? "border-t-[var(--color-primary-dark)] bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.08)] z-10 cursor-pointer"
                                : "border-t-transparent hover:bg-gray-50 cursor-pointer bg-white"
                            }`}
                        >
                        {/* The little caret pointing down for selected tab */}
                        {isSelected && !isPast && (
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] sm:border-l-[8px] border-r-[6px] sm:border-r-[8px] border-t-[6px] sm:border-t-[8px] border-l-transparent border-r-transparent border-t-[var(--color-primary-dark)]" />
                        )}

                        <span className={`text-[11px] sm:text-sm font-semibold mb-0.5 sm:mb-1 ${isPast ? "text-gray-400" : (isSelected ? "text-[var(--color-primary-dark)]" : "text-gray-900")}`}>
                          {tab.day}, {tab.dateFormatted}
                        </span>
                        
                        {isPast ? (
                          <div className="flex items-center gap-1 mt-0.5 sm:mt-1 text-gray-400">
                             <CalendarX size={16} className="opacity-50" strokeWidth={1.5} />
                          </div>
                        ) : (
                          <span className={`text-xs sm:text-base md:text-lg font-normal ${isSelected ? "text-[var(--color-primary-dark)] font-bold sm:font-normal" : "text-gray-700"}`}>
                            {formatPrice(tab.lowestPrice).replace("Rp ", "Rp")}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={handleNextDay}
                  className="flex-shrink-0 w-8 sm:w-12 flex items-center justify-center bg-white border-l border-gray-200 text-gray-400 hover:text-[var(--color-primary)] hover:bg-gray-50 transition-colors cursor-pointer z-20"
                >
                  <ChevronRight size={18} />
                </button>
              </div> {/* Close .flex.w-full.relative */}
              </div> {/* Close .bg-white.rounded-md... */}
            </div>

            {/* Banner Promo Status (Sesuai Rute atau Tidak) */}
            {activePromo && (
              promoEligibility.isEligible ? (
                <div className="mb-3.5 bg-white border border-gray-200 rounded-sm p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-[#003C71] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                      Promo Aktif
                    </span>
                    <span className="font-bold text-xs text-gray-900">{activePromo.code}</span>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span className="text-xs text-gray-600 font-medium hidden sm:inline">{activePromo.headline}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    Potongan harga diterapkan
                  </span>
                </div>
              ) : (
                <div className="mb-3.5 bg-white border border-gray-200 rounded-sm p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs text-gray-800">
                  <div className="flex items-start sm:items-center gap-2.5">
                    <span className="bg-gray-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider flex-shrink-0">
                      Promo Tidak Berlaku
                    </span>
                    <div>
                      <span className="font-bold text-xs text-gray-900 mr-2">{activePromo.code}</span>
                      <span className="text-xs text-gray-600">
                        {promoEligibility.reason || `Khusus rute ${activePromo.route}.`}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-gray-500 whitespace-nowrap self-end sm:self-center">
                    Tarif normal
                  </span>
                </div>
              )
            )}

            {/* 3. Matriks Jam Keberangkatan x Kelas */}
            <div className="pb-4">
              {/* DESKTOP TABLE VIEW (hidden on mobile, visible on md and up) */}
              <div className="hidden md:block">
                <div className="min-w-[650px]">
                  {/* Header Kelas - Sticky saat scroll */}
                  <div className="sticky top-[84px] z-30 bg-[var(--color-bg-muted)] pt-2 pb-2">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="col-span-1 py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center bg-gray-50/80">
                        Jadwal Kereta
                      </div>
                      <div className="col-span-1 text-center font-bold text-gray-700 text-sm border-t-4 border-t-gray-400 py-3 border-l border-gray-200 bg-white">
                        Ekonomi
                      </div>
                      <div className="col-span-1 text-center font-bold text-[#003C71] text-sm border-t-4 border-t-[#003C71] py-3 border-l border-gray-200 bg-white">
                        Bisnis
                      </div>
                      <div className="col-span-1 text-center font-bold text-[#F58220] text-sm border-t-4 border-t-[#F58220] py-3 border-l border-gray-200 bg-white">
                        Eksekutif
                      </div>
                    </div>
                  </div>

                  {/* Rows (Schedules) */}
                  <div className="space-y-4">
                    {groupedTrains.map((train, idx) => (
                      <div key={idx} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-0 bg-white rounded-md shadow-sm border border-gray-200">

                        {/* Waktu & Kereta Info */}
                        <div className="col-span-1 border-r border-gray-200 p-4 flex flex-col justify-center">
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-xl font-black text-[var(--color-text)] leading-none">{train.departureTime}</span>
                            <ArrowRight size={14} className="text-gray-400 mb-1" />
                            <span className="text-xl font-black text-gray-500 leading-none">{train.arrivalTime}</span>
                          </div>
                          <div className="text-xs font-semibold text-gray-400 text-center mb-3">
                            {train.duration} • Langsung
                          </div>
                          <div className="text-sm font-bold text-[var(--color-primary)] flex items-center gap-1.5">
                            <Train size={14} /> {train.name}
                          </div>
                        </div>

                        {/* Classes Cells */}
                        {(["Ekonomi", "Bisnis", "Eksekutif"] as const).map((className) => {
                          const classData = train.classes[className];
                          const isSelected = selectedTrain?.id === classData?.id;

                          const cc = className === "Ekonomi"
                            ? { border: "border-b-gray-400",  selBg: "bg-gray-500",   ring: "ring-gray-400",   hover: "hover:bg-gray-50",   seats: "text-gray-500",  text: "text-gray-600" }
                            : className === "Bisnis"
                            ? { border: "border-b-[#003C71]", selBg: "bg-[#003C71]", ring: "ring-[#003C71]", hover: "hover:bg-blue-50",   seats: "text-[#003C71]", text: "text-[#003C71]" }
                            : { border: "border-b-[#F58220]", selBg: "bg-[#F58220]", ring: "ring-[#F58220]", hover: "hover:bg-orange-50", seats: "text-[#F58220]", text: "text-[#F58220]" };

                          if (!classData) {
                            return (
                              <div key={className} className={`col-span-1 p-4 flex items-center justify-center text-sm font-medium text-gray-300 border-b-[3px] ${cc.border} ${className !== "Eksekutif" ? "border-r border-gray-200" : ""}`}>
                                Tidak tersedia
                              </div>
                            );
                          }

                          const discountInfo = calculatePromoDiscount(classData.price, promoCode, originCode, destCode);
                          const isDiscounted = discountInfo.discountAmount > 0;
                          const effectivePrice = isDiscounted ? discountInfo.finalPrice : classData.price;
                          const isLowest = effectivePrice === absoluteLowestPrice;

                          return (
                            <button
                              key={className}
                              onClick={() => setSelectedTrain({
                                trainName: train.name,
                                depart: train.departureTime,
                                arrive: train.arrivalTime,
                                duration: train.duration,
                                className: className,
                                originalPrice: classData.price,
                                price: effectivePrice,
                                id: classData.id
                              })}
                              className={`col-span-1 p-4 flex flex-col items-center justify-center relative transition-all cursor-pointer border-b-[3px]
                                ${cc.border}
                                ${className !== "Eksekutif" ? "border-r border-gray-200" : ""}
                                ${isSelected
                                  ? `${cc.selBg} ring-2 ${cc.ring} text-white shadow-md z-10 scale-[1.02] rounded-md`
                                  : `${cc.hover} text-[var(--color-text)]`
                                }`}
                            >
                              {/* Harga dengan Coretan Jika Ada Promo */}
                              {isDiscounted ? (
                                <div className="flex flex-col items-center mb-1 leading-tight">
                                  <span className={`text-[11px] line-through font-semibold ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                                    {formatPrice(classData.price).replace("Rp ", "Rp")}
                                  </span>
                                  <div className="flex items-baseline gap-1">
                                    <span className={`text-base font-normal ${isSelected ? "text-white" : "text-gray-900"}`}>
                                      {formatPrice(effectivePrice).replace("Rp ", "Rp")}
                                    </span>
                                    <span className={`text-[10px] font-normal ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                                      /pax
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-baseline gap-1 mb-1">
                                  <span className={`text-base font-normal ${isSelected ? "text-white" : "text-gray-800"}`}>
                                    {formatPrice(classData.price).replace("Rp ", "Rp")}
                                  </span>
                                  <span className={`text-[10px] font-normal ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                                    /pax
                                  </span>
                                </div>
                              )}

                              {/* Sisa kursi */}
                              {classData.availableSeats < 20 && (
                                <div className={`text-xs font-bold mt-0.5 ${isSelected ? "text-white/80" : cc.seats}`}>
                                  {classData.availableSeats} kursi tersisa
                                </div>
                              )}

                              {/* Badge Termurah */}
                              {isLowest && !isSelected && (
                                <div className="absolute top-1.5 right-1.5 bg-green-100 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider whitespace-nowrap">
                                  Termurah
                                </div>
                              )}
                              {isLowest && isSelected && (
                                <div className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider whitespace-nowrap">
                                  Termurah
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MOBILE ADAPTIVE CARD VIEW (visible on md:hidden) */}
              <div className="block md:hidden space-y-3.5">
                {groupedTrains.map((train, idx) => {
                  const isAnySelected = selectedTrain && (
                    train.classes["Ekonomi"]?.id === selectedTrain.id ||
                    train.classes["Bisnis"]?.id === selectedTrain.id ||
                    train.classes["Eksekutif"]?.id === selectedTrain.id
                  );

                  return (
                    <div 
                      key={idx}
                      className={`bg-white rounded-xl border p-4 transition-all shadow-xs ${
                        isAnySelected
                          ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20 shadow-md"
                          : "border-gray-200"
                      }`}
                    >
                      {/* Top Header: Train Name, Duration */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Train size={16} className="text-[var(--color-primary)] flex-shrink-0" />
                          <span className="font-bold text-sm text-[var(--color-primary-dark)] truncate">{train.name}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                          {train.duration} • Langsung
                        </span>
                      </div>

                      {/* Station & Time Journey Row */}
                      <div className="flex items-center justify-between mb-3.5 px-1">
                        <div className="flex flex-col items-start">
                          <span className="text-xl font-black text-gray-900 leading-none tracking-tight">{train.departureTime}</span>
                          <span className="text-xs font-semibold text-gray-500 mt-1">{originStation?.city || originCode}</span>
                        </div>

                        <div className="flex flex-col items-center px-3 flex-1">
                          <div className="w-full flex items-center gap-1.5">
                            <div className="h-[1.5px] bg-gray-200 flex-1" />
                            <ArrowRight size={13} className="text-gray-400 flex-shrink-0" />
                            <div className="h-[1.5px] bg-gray-200 flex-1" />
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <span className="text-xl font-black text-gray-700 leading-none tracking-tight">{train.arrivalTime}</span>
                          <span className="text-xs font-semibold text-gray-500 mt-1">{destStation?.city || destCode}</span>
                        </div>
                      </div>

                      {/* Class Selection Buttons */}
                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
                        {(["Ekonomi", "Bisnis", "Eksekutif"] as const).map((className) => {
                          const classData = train.classes[className];
                          const isSelected = selectedTrain?.id === classData?.id;

                          const classStyle = className === "Ekonomi"
                            ? { text: "text-gray-600", active: "bg-gray-700 text-white ring-2 ring-gray-400", border: "border border-gray-200 border-b-[3px] border-b-gray-400" }
                            : className === "Bisnis"
                            ? { text: "text-[#003C71]", active: "bg-[#003C71] text-white ring-2 ring-blue-300", border: "border border-blue-200 border-b-[3px] border-b-[#003C71]" }
                            : { text: "text-[#F58220]", active: "bg-[#F58220] text-white ring-2 ring-orange-300", border: "border border-orange-200 border-b-[3px] border-b-[#F58220]" };

                          if (!classData) {
                            return (
                              <div
                                key={className}
                                className="flex flex-col items-center justify-center p-2 rounded-lg border border-dashed border-gray-200 border-b-[3px] border-b-gray-300 bg-gray-50/70 opacity-60 text-center select-none min-h-[58px]"
                              >
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{className}</span>
                                <span className="text-[10px] text-gray-400 font-medium mt-0.5">Habis</span>
                              </div>
                            );
                          }

                          const discountInfo = calculatePromoDiscount(classData.price, promoCode, originCode, destCode);
                          const isDiscounted = discountInfo.discountAmount > 0;
                          const effectivePrice = isDiscounted ? discountInfo.finalPrice : classData.price;
                          const isLowest = effectivePrice === absoluteLowestPrice;

                          return (
                            <button
                              key={className}
                              onClick={() => setSelectedTrain({
                                trainName: train.name,
                                depart: train.departureTime,
                                arrive: train.arrivalTime,
                                duration: train.duration,
                                className: className,
                                originalPrice: classData.price,
                                price: effectivePrice,
                                id: classData.id
                              })}
                              className={`relative flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center min-h-[58px] ${
                                isSelected
                                  ? `${classStyle.active} shadow-md scale-[1.02]`
                                  : `bg-white hover:bg-gray-50 ${classStyle.border} shadow-2xs`
                              }`}
                            >
                              {isLowest && (
                                <div className={`absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[8px] font-extrabold uppercase tracking-wider whitespace-nowrap shadow-xs ${
                                  isSelected ? "bg-white text-emerald-700" : "bg-emerald-600 text-white"
                                }`}>
                                  Termurah
                                </div>
                              )}

                              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                                isSelected ? "text-white/90" : classStyle.text
                              }`}>
                                {className}
                              </span>

                              {/* Tampilan Harga dengan Coretan Jika Ada Promo */}
                              {isDiscounted ? (
                                <div className="flex flex-col items-center mt-0.5 leading-tight">
                                  <span className={`text-[9px] line-through font-semibold ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                                    {formatPrice(classData.price).replace("Rp ", "Rp")}
                                  </span>
                                  <div className="flex items-baseline gap-0.5">
                                    <span className={`text-xs font-normal ${isSelected ? "text-white" : "text-gray-900"}`}>
                                      {formatPrice(effectivePrice).replace("Rp ", "Rp")}
                                    </span>
                                    <span className={`text-[8.5px] font-normal ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                                      /pax
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-baseline gap-0.5 mt-0.5">
                                  <span className={`text-xs font-normal ${isSelected ? "text-white" : "text-gray-800"}`}>
                                    {formatPrice(classData.price).replace("Rp ", "Rp")}
                                  </span>
                                  <span className={`text-[8.5px] font-normal ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                                    /pax
                                  </span>
                                </div>
                              )}

                              {classData.availableSeats < 20 && (
                                <span className={`text-[8.5px] font-bold mt-0.5 ${
                                  isSelected ? "text-white/80" : "text-amber-600"
                                }`}>
                                  Sisa {classData.availableSeats}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* End Left Column */}

          {/* 4. Sidebar Ringkasan Perjalanan */}
          <div className="w-full lg:w-80 flex-shrink-0 self-start lg:sticky lg:top-[104px] z-30">
            <div className="w-full flex flex-col">
              {/* Lookup kereta berangkat & kepulangan */}
              {(() => {
                const baseDepartId = departTrainId ? departTrainId.replace(/-EKO|-BIS/, "") : "";
                const rawDepartTrain = baseDepartId ? TRAIN_SCHEDULES.find(t => t.id === baseDepartId) : null;
                const departClass = departTrainId.endsWith("-EKO")
                  ? "Ekonomi"
                  : departTrainId.endsWith("-BIS")
                  ? "Bisnis"
                  : (rawDepartTrain?.class || "Eksekutif");
                const departPrice = departTrainId.endsWith("-EKO")
                  ? (rawDepartTrain?.price || 0) * 0.4
                  : departTrainId.endsWith("-BIS")
                  ? (rawDepartTrain?.price || 0) * 0.7
                  : (rawDepartTrain?.price || 0);

                // Outbound train object
                const outboundTrain = isReturnTrip
                  ? (rawDepartTrain ? {
                      trainName: rawDepartTrain.name,
                      depart: rawDepartTrain.departureTime,
                      arrive: rawDepartTrain.arrivalTime,
                      duration: rawDepartTrain.duration,
                      className: departClass,
                      price: departPrice,
                      id: departTrainId
                    } : null)
                  : selectedTrain;

                // Return train object
                const returnTrain = isReturnTrip ? selectedTrain : null;

                // Stations
                // Note: when isReturnTrip is true, the current page is searching the return leg,
                // so originCode/originStation is the return departure station, and destCode/destStation is the return arrival station.
                // Outbound was the original first leg (origin: destStation, destination: originStation).
                const outboundOriginStation = isReturnTrip ? destStation : originStation;
                const outboundDestStation = isReturnTrip ? originStation : destStation;
                const outboundOriginCode = isReturnTrip ? destCode : originCode;
                const outboundDestCode = isReturnTrip ? originCode : destCode;

                // Return leg must always be the opposite of outbound:
                // Departure from outbound's destination, arriving at outbound's origin!
                const returnOriginStation = outboundDestStation;
                const returnDestStation = outboundOriginStation;
                const returnOriginCode = outboundDestCode;
                const returnDestCode = outboundOriginCode;

                // Dates
                const outboundDate = isReturnTrip ? (departDateParam || dateStr) : selectedDate;
                const returnDateVal = isReturnTrip ? selectedDate : returnDate;

                // Prices
                const rawOutboundUnit = (outboundTrain as any)?.originalPrice || outboundTrain?.price || 0;
                const rawReturnUnit = (returnTrain as any)?.originalPrice || returnTrain?.price || 0;
                const subtotalBeforeDiscount = (rawOutboundUnit + rawReturnUnit) * passengers;

                const outboundTotal = outboundTrain ? outboundTrain.price * passengers : 0;
                const returnTotal = returnTrain ? returnTrain.price * passengers : 0;
                const totalPrice = outboundTotal + returnTotal;
                const discountTotal = Math.max(0, subtotalBeforeDiscount - totalPrice);

                // Button state
                const isButtonDisabled = !selectedTrain;
                const buttonText = isReturnTrip
                  ? "Lanjutkan ke Data Penumpang"
                  : tripType === "round-trip"
                  ? "Pilih Tiket Pulang"
                  : "Lanjutkan ke Data Penumpang";

                const handleEditOutbound = () => {
                  if (isReturnTrip) {
                    const params = new URLSearchParams({
                      origin: destCode,
                      destination: originCode,
                      date: departDateParam || dateStr,
                      passengers: String(passengers),
                      infants: String(infants),
                      tripType: "round-trip",
                      returnDate: returnDate || selectedDate
                    });
                    router.push(`/cari?${params.toString()}`);
                  } else {
                    setSelectedTrain(null);
                  }
                };

                const handleEditReturn = () => {
                  setSelectedTrain(null);
                };

                const renderOutboundSection = () => (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
                        {/* Sleek side-profile train facing right */}
                        <svg width="20" height="14" viewBox="0 0 24 16" fill="currentColor" className="text-gray-900 flex-shrink-0">
                          <path d="M1 11h18c2.2 0 4-1.8 4-4s-1.8-4-4-4H4L1 11z" />
                          <path d="M6 5h3v3H6V5zm5 0h3v3h-3V5zm5 0h2.5c.8 0 1.5.4 1.9 1.1L21 7h-5V5z" fill="white" />
                          <circle cx="5" cy="13.5" r="1.5" />
                          <circle cx="11" cy="13.5" r="1.5" />
                          <circle cx="17" cy="13.5" r="1.5" />
                        </svg>
                        <span>Keberangkatan</span>
                      </div>
                      {outboundTrain && (
                        <button
                          onClick={handleEditOutbound}
                          className="text-xs font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
                        >
                          Ubah
                        </button>
                      )}
                    </div>

                    {outboundTrain ? (
                      <div className="space-y-3">
                        {/* Date */}
                        <div className="text-sm font-bold text-gray-900">
                          {formatDateDisplay(outboundDate)}
                        </div>

                        {/* Passengers & Price */}
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{passengers} x Dewasa</span>
                          <div className="text-right">
                            {rawOutboundUnit > outboundTrain.price && (
                              <span className="line-through text-gray-400 text-xs mr-1.5 font-normal">
                                {formatPrice(rawOutboundUnit * passengers)}
                              </span>
                            )}
                            <span className="font-bold text-sm text-gray-900">
                              {formatPrice(outboundTrain.price * passengers)}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-3">
                          {/* Route Timeline */}
                          <div className="relative pl-5">
                            {/* Line */}
                            <div className="absolute left-[3px] top-[7px] bottom-[7px] w-[2px] bg-gray-300" />

                            {/* Departure Point */}
                            <div className="relative mb-3">
                              <div className="absolute -left-[20px] top-[4px] w-[8px] h-[8px] rounded-full border-2 border-gray-800 bg-white" />
                              <div className="font-bold text-xs sm:text-sm text-gray-900 leading-none">
                                {outboundTrain.depart} - {outboundOriginStation?.name || outboundOriginCode}
                              </div>
                            </div>

                            {/* Intermediate duration & class badge */}
                            <div className="flex items-center gap-2 text-xs text-gray-500 my-2">
                              <span>({outboundTrain.duration || "2j 45m"})</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                                outboundTrain.className === "Eksekutif"
                                  ? "bg-orange-50 text-[var(--color-accent)] border border-orange-200"
                                  : outboundTrain.className === "Bisnis"
                                  ? "bg-blue-50 text-[var(--color-primary)] border border-blue-200"
                                  : "bg-gray-100 text-gray-600 border border-gray-200"
                              }`}>
                                {outboundTrain.className}
                              </span>
                            </div>

                            {/* Arrival Point */}
                            <div className="relative">
                              <div className="absolute -left-[20px] top-[4px] w-[8px] h-[8px] rounded-full border-2 border-gray-800 bg-white" />
                              <span className="font-bold text-xs sm:text-sm text-gray-900 leading-none">
                                {outboundTrain.arrive} - {outboundDestStation?.name || outboundDestCode}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Dashed placeholder for outbound */
                      <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50/50 mt-2">
                        <Image
                          src="/Maskot/maskot_bingung.webp"
                          alt="Belum ada kereta dipilih"
                          width={56}
                          height={56}
                          className="opacity-75 mb-2 object-contain"
                        />
                        <span className="text-xs text-gray-400 font-medium">Belum ada kereta dipilih</span>
                      </div>
                    )}
                  </div>
                );

                const renderReturnSection = () => (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
                        {/* Sleek side-profile train facing left (flipped) */}
                        <svg width="20" height="14" viewBox="0 0 24 16" fill="currentColor" className="text-gray-900 flex-shrink-0 -scale-x-100">
                          <path d="M1 11h18c2.2 0 4-1.8 4-4s-1.8-4-4-4H4L1 11z" />
                          <path d="M6 5h3v3H6V5zm5 0h3v3h-3V5zm5 0h2.5c.8 0 1.5.4 1.9 1.1L21 7h-5V5z" fill="white" />
                          <circle cx="5" cy="13.5" r="1.5" />
                          <circle cx="11" cy="13.5" r="1.5" />
                          <circle cx="17" cy="13.5" r="1.5" />
                        </svg>
                        <span>Kepulangan</span>
                      </div>
                      {returnTrain && (
                        <button
                          onClick={handleEditReturn}
                          className="text-xs font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
                        >
                          Ubah
                        </button>
                      )}
                    </div>

                    {returnTrain ? (
                      <div className="space-y-3">
                        {/* Date */}
                        <div className="text-sm font-bold text-gray-900">
                          {formatDateDisplay(returnDateVal)}
                        </div>

                        {/* Passengers & Price */}
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{passengers} x Dewasa</span>
                          <div className="text-right">
                            {rawReturnUnit > returnTrain.price && (
                              <span className="line-through text-gray-400 text-xs mr-1.5 font-normal">
                                {formatPrice(rawReturnUnit * passengers)}
                              </span>
                            )}
                            <span className="font-bold text-sm text-gray-900">
                              {formatPrice(returnTrain.price * passengers)}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-3">
                          {/* Route Timeline */}
                          <div className="relative pl-5">
                            {/* Line */}
                            <div className="absolute left-[3px] top-[7px] bottom-[7px] w-[2px] bg-gray-300" />

                            {/* Departure Point */}
                            <div className="relative mb-3">
                              <div className="absolute -left-[20px] top-[4px] w-[8px] h-[8px] rounded-full border-2 border-gray-800 bg-white" />
                              <div className="font-bold text-xs sm:text-sm text-gray-900 leading-none">
                                {returnTrain.depart} - {returnOriginStation?.name || returnOriginCode}
                              </div>
                            </div>

                            {/* Intermediate duration & class badge */}
                            <div className="flex items-center gap-2 text-xs text-gray-500 my-2">
                              <span>({returnTrain.duration || "2j 45m"})</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                                returnTrain.className === "Eksekutif"
                                  ? "bg-orange-50 text-[var(--color-accent)] border border-orange-200"
                                  : returnTrain.className === "Bisnis"
                                  ? "bg-blue-50 text-[var(--color-primary)] border border-blue-200"
                                  : "bg-gray-100 text-gray-600 border border-gray-200"
                              }`}>
                                {returnTrain.className}
                              </span>
                            </div>

                            {/* Arrival Point */}
                            <div className="relative">
                              <div className="absolute -left-[20px] top-[4px] w-[8px] h-[8px] rounded-full border-2 border-gray-800 bg-white" />
                              <span className="font-bold text-xs sm:text-sm text-gray-900 leading-none">
                                {returnTrain.arrive} - {returnDestStation?.name || returnDestCode}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Dashed placeholder for return */
                      <div className="border border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center bg-gray-50/50 mt-2">
                        <Image
                          src="/Maskot/maskot_bingung.webp"
                          alt="Belum ada kereta dipilih"
                          width={64}
                          height={64}
                          className="opacity-75 mb-2 object-contain"
                        />
                        <span className="text-xs text-gray-400 font-medium">Belum ada kereta dipilih</span>
                      </div>
                    )}
                  </div>
                );

                return (
                  <>
                    {/* DESKTOP: Unified Single Box Container */}
                    <div className="hidden lg:flex flex-col bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                      {/* Top Navy Header: Trip Summary & Checkout Action */}
                      <div className="bg-[var(--color-primary-dark)] text-white p-4">
                        <div className="flex flex-col gap-1 mb-4">
                          <div className="flex items-center justify-between text-xs text-blue-200">
                            <span className="font-bold uppercase tracking-wider text-[11px]">Rincian Pesanan</span>
                            <span className="font-medium text-white/80">
                              {passengers} Dewasa{infants > 0 ? `, ${infants} Bayi` : ""}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between border-t border-white/10 pt-2">
                            <span className="text-xs text-white/80 font-medium">Total Pembayaran</span>
                            <div className="text-right">
                              {discountTotal > 0 && (
                                <span className="text-xs line-through text-blue-200/80 mr-2 font-normal">
                                  {formatPrice(subtotalBeforeDiscount)}
                                </span>
                              )}
                              <span className="font-black text-xl tracking-tight text-white whitespace-nowrap">
                                {totalPrice > 0 ? formatPrice(totalPrice) : "Rp 0"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Prominent Action Button */}
                        <button
                          onClick={handleContinue}
                          disabled={isButtonDisabled}
                          className={`w-full py-3 rounded-md font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                            isButtonDisabled
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-[var(--color-accent)] hover:bg-[#E07015] text-white shadow-sm cursor-pointer"
                          }`}
                        >
                          {buttonText}
                          {!isButtonDisabled && <ArrowRight size={16} />}
                        </button>
                      </div>

                      {/* Unified Body: Outbound & Return Legs */}
                      <div className="p-4 space-y-4 divide-y divide-gray-100">
                        {renderOutboundSection()}
                        {tripType === "round-trip" && (
                          <div className="pt-4">
                            {renderReturnSection()}
                          </div>
                        )}
                        {/* Baris Diskon Promo Jika Aktif */}
                        {discountTotal > 0 && activePromo && (
                          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                              <Tag size={13} className="text-[#F58220]" />
                              <span>Diskon Promo ({activePromo.code})</span>
                            </span>
                            <span className="font-black text-emerald-600">
                              - {formatPrice(discountTotal)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* MOBILE: Expandable Bottom Drawer / Sheet */}
                    {isMobileSummaryOpen && (
                      <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
                        onClick={() => setIsMobileSummaryOpen(false)}
                      />
                    )}

                    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl transition-all duration-300 ease-in-out lg:hidden ${
                      isMobileSummaryOpen ? "rounded-t-2xl max-h-[85vh] flex flex-col" : "rounded-t-none"
                    }`}>
                      {/* Pull handle / Expand toggle button */}
                      <button
                        onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
                        className="w-full pt-2.5 pb-1.5 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 flex-shrink-0"
                      >
                        <div className="w-10 h-1 bg-gray-300 rounded-full mb-1" />
                        <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--color-primary)]">
                          <span>{isMobileSummaryOpen ? "Tutup Rincian" : "Lihat Rincian Pesanan"}</span>
                          {isMobileSummaryOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </div>
                      </button>

                      {/* Expanded Scrollable Body */}
                      {isMobileSummaryOpen && (
                        <div className="overflow-y-auto px-4 py-3 space-y-4 divide-y divide-gray-100 flex-1">
                          {renderOutboundSection()}
                          {tripType === "round-trip" && (
                            <div className="pt-4">
                              {renderReturnSection()}
                            </div>
                          )}
                          {/* Baris Diskon Promo Mobile Drawer */}
                          {discountTotal > 0 && activePromo && (
                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                                <Tag size={13} className="text-[#F58220]" />
                                <span>Diskon Promo ({activePromo.code})</span>
                              </span>
                              <span className="font-black text-emerald-600">
                                - {formatPrice(discountTotal)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Fixed bottom action bar on mobile */}
                      <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-500">Total Pembayaran</span>
                            <div className="flex items-baseline gap-1.5">
                              {discountTotal > 0 && (
                                <span className="text-xs text-gray-400 line-through font-medium">
                                  {formatPrice(subtotalBeforeDiscount).replace("Rp ", "Rp")}
                                </span>
                              )}
                              <span className="font-black text-xl text-[var(--color-text)]">
                                {totalPrice > 0 ? formatPrice(totalPrice).replace("Rp ", "Rp") : "Rp0"}
                              </span>
                            </div>
                          </div>
                          {selectedTrain && (
                            <div className="text-xs font-bold text-[var(--color-primary)] text-right">
                              {selectedTrain.trainName} ({selectedTrain.className})
                            </div>
                          )}
                        </div>

                        <button
                          onClick={handleContinue}
                          disabled={isButtonDisabled}
                          className={`w-full py-3.5 rounded-md font-bold text-base transition-colors flex justify-center items-center gap-2 ${
                            isButtonDisabled
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-[var(--color-accent)] hover:bg-[#E07015] text-white cursor-pointer shadow-sm"
                          }`}
                        >
                          {buttonText}
                          {!isButtonDisabled && <ArrowRight size={18} />}
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {showCalendar && (
        <PriceCalendar
          selectedDate={selectedDate}
          onSelect={date => {
            setSelectedDate(date);
            // Center the newly selected date in the window
            const newBase = new Date(date + "T00:00:00");
            newBase.setDate(newBase.getDate() - 2);
            setBaseDate(formatLocalYYYYMMDD(newBase));
            setShowCalendar(false);
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}

      {showReturnCalendar && (() => {
        const [y, mo, dd] = selectedDate.split("-").map(Number);
        const next = new Date(y, mo - 1, dd + 1);
        const minReturn = [
          next.getFullYear(),
          String(next.getMonth() + 1).padStart(2, "0"),
          String(next.getDate()).padStart(2, "0"),
        ].join("-");
        return (
          <PriceCalendar
            selectedDate={editReturnDate || minReturn}
            minDate={minReturn}
            rangeStartDate={selectedDate}
            onSelect={date => {
              setEditReturnDate(date);
              setShowReturnCalendar(false);
            }}
            onClose={() => setShowReturnCalendar(false)}
          />
        );
      })()}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <MainLayout hideMainNavbar={true}>
      <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg-muted)] flex items-center justify-center">Memuat jadwal...</div>}>
        <SearchResultsContent />
      </Suspense>
    </MainLayout>
  );
}
