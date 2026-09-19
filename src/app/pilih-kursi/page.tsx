"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { formatPrice, TRAIN_SCHEDULES, getStationByCode } from "@/lib/mockData";
import {
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Info,
  Armchair,
  Check,
  User,
  ArrowUp,
  ArrowDown,
  Train,
  Utensils,
  Luggage,
  DoorOpen,
  Baby,
  CheckCircle2
} from "lucide-react";

// Tipe kursi
type SeatStatus = "available" | "occupied" | "selected";

interface Seat {
  id: string; // e.g., "1A", "1B"
  row: number;
  col: string;
  status: SeatStatus;
}

interface Carriage {
  id: string; // e.g., "EKS-1"
  name: string; // e.g., "Eksekutif 1"
  seats: Seat[];
}

function generateMockCarriages(trainClass: string, numCarriages: number = 3): Carriage[] {
  const carriages: Carriage[] = [];
  const rows = 12;
  const cols = trainClass === "Ekonomi" ? ["A", "B", "C", "D", "E"] : ["A", "B", "C", "D"];
  
  for (let c = 1; c <= numCarriages; c++) {
    const seats: Seat[] = [];
    for (let r = 1; r <= rows; r++) {
      for (const col of cols) {
        // Randomly assign occupied status (approx 30% occupied)
        const isOccupied = Math.random() < 0.3;
        seats.push({
          id: `${r}${col}`,
          row: r,
          col,
          status: isOccupied ? "occupied" : "available",
        });
      }
    }
    carriages.push({
      id: `${trainClass.substring(0, 3).toUpperCase()}-${c}`,
      name: `${trainClass} ${c}`,
      seats
    });
  }
  return carriages;
}

interface Passenger {
  id: string;
  name: string;
}

// Data foto ilustrasi nyata fasilitas kereta api KAI
const FACILITY_DATA: Record<string, {
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  image: string;
  description: string;
}> = {
  toilet: {
    title: "Toilet Ramah Lingkungan (TRL) KAI",
    subtitle: "Fasilitas Sanitasi & Kebersihan Kereta Eksekutif",
    badge: "Sanitasi & Toilet",
    icon: "WC",
    image: "/fasilitas/toilet.jpg",
    description: "Dilengkapi kloset duduk higienis dengan sistem penampung ramah lingkungan, wastafel stainless steel, cermin dengan lampu LED modern, sabun cair, tisu, dan handrail pengaman untuk kenyamanan penumpang."
  },
  apar: {
    title: "Alat Pemadam Api Ringan (APAR)",
    subtitle: "Standar Keselamatan Tanggap Darurat KAI",
    badge: "Keselamatan Kereta",
    icon: "🧯",
    image: "/fasilitas/apar.jpg",
    description: "Tabung pemadam kebakaran siaga darurat yang terpasang kokoh pada dinding bordes dekat pintu gerbong. Selalu diinspeksi berkala demi menjamin keselamatan seluruh penumpang kereta."
  },
  bagasi: {
    title: "Rak Koper Besar (Bordes Ujung Gerbong)",
    subtitle: "Kompartemen Koper & Tas Berukuran Besar",
    badge: "Rak Koper Ujung",
    icon: "🧳",
    image: "/fasilitas/bagasi.jpg",
    description: "Rak bertingkat terbuka berbahan stainless steel kokoh di sudut ujung kabin dekat pintu bordes kereta. Disediakan khusus untuk menampung koper besar (hardcase) dan barang bawaan berdimensi besar yang tidak muat di kompartemen atas kursi."
  }
};

function PilihKursiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State untuk pratinjau foto fasilitas (Toilet, APAR, Bagasi)
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [hoveredFacility, setHoveredFacility] = useState<string | null>(null);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
  
  const trainId = searchParams.get("trainId") || "TRN-1";
  const returnTrainId = searchParams.get("returnTrainId") || "";
  const passengersCount = parseInt(searchParams.get("passengers") || "1", 10);
  const infantsCount = parseInt(searchParams.get("infants") || "0", 10);
  
  // Tentukan kelas dari trainId mock ("-EKO", "-BIS")
  const trainClass = trainId.includes("-EKO") ? "Ekonomi" : trainId.includes("-BIS") ? "Bisnis" : "Eksekutif";

  // Train schedule details
  const baseTrainId = trainId.replace(/-EKO|-BIS/, "");
  const trainData = TRAIN_SCHEDULES.find(t => t.id === baseTrainId);
  const paramOrigin = searchParams.get("origin") || "";
  const paramDestination = searchParams.get("destination") || "";
  const trainOrigin = getStationByCode(paramOrigin || trainData?.origin || "")?.name || paramOrigin || trainData?.origin || "Stasiun Asal";
  const trainDest = getStationByCode(paramDestination || trainData?.destination || "")?.name || paramDestination || trainData?.destination || "Stasiun Tujuan";
  
  const [carriages, setCarriages] = useState<Carriage[]>([]);
  const [activeCarriageId, setActiveCarriageId] = useState<string>("");
  
  // Ref & status untuk geser/drag formasi gerbong secara horizontal di mobile & desktop
  const rakeContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const checkRakeScroll = () => {
    if (rakeContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rakeContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkRakeScroll();
    const el = rakeContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkRakeScroll, { passive: true });
    window.addEventListener("resize", checkRakeScroll);
    return () => {
      el.removeEventListener("scroll", checkRakeScroll);
      window.removeEventListener("resize", checkRakeScroll);
    };
  }, [carriages]);

  const scrollRake = (direction: "left" | "right") => {
    if (!rakeContainerRef.current) return;
    const scrollAmount = direction === "left" ? -220 : 220;
    rakeContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleRakeMouseDown = (e: React.MouseEvent) => {
    if (!rakeContainerRef.current) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - rakeContainerRef.current.offsetLeft;
    scrollLeftRef.current = rakeContainerRef.current.scrollLeft;
  };

  const handleRakeMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !rakeContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - rakeContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
    }
    rakeContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleRakeMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Otomatis geser agar gerbong aktif selalu terlihat di layar sempit / mobile
  useEffect(() => {
    if (!activeCarriageId) return;
    const btn = document.getElementById(`carriage-btn-${activeCarriageId}`);
    if (btn && rakeContainerRef.current) {
      btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeCarriageId]);

  const [passengersList, setPassengersList] = useState<Passenger[]>([]);
  const [activePassengerId, setActivePassengerId] = useState<string>("");
  // Record<passengerId, { carriageId, seatId }>
  const [selectedSeats, setSelectedSeats] = useState<Record<string, { carriageId: string; seatId: string }>>({});

  useEffect(() => {
    const mockData = generateMockCarriages(trainClass, 4);
    setCarriages(mockData);
    if (mockData.length > 0) {
      setActiveCarriageId(mockData[0].id);
    }
  }, [trainClass]);

  useEffect(() => {
    const p = sessionStorage.getItem("booking_passengers");
    if (p) {
      try {
         const parsed = JSON.parse(p);
         // Bayi tidak mendapatkan kursi sendiri di KAI (dipangku oleh penumpang dewasa)
         const seatPassengers = parsed.filter((item: any) => item.type !== "Bayi");
         const finalPassengers = seatPassengers.length > 0 ? seatPassengers : parsed;
         setPassengersList(finalPassengers);
         if (finalPassengers.length > 0) setActivePassengerId(finalPassengers[0].id);
      } catch (e) {}
    } else {
         const fallback = Array.from({length: passengersCount}).map((_, i) => ({ id: `p${i+1}`, name: `Penumpang ${i+1}`}));
         setPassengersList(fallback);
         if (fallback.length > 0) setActivePassengerId(fallback[0].id);
    }
  }, [passengersCount]);

  // Otomatis pilih kursi default bagi setiap penumpang saat gerbong & daftar penumpang siap
  useEffect(() => {
    if (carriages.length === 0 || passengersList.length === 0) return;

    setSelectedSeats((prev) => {
      // Jika semua penumpang sudah punya kursi, jangan timpa
      if (Object.keys(prev).length >= passengersList.length) return prev;

      const newSeats: Record<string, { carriageId: string; seatId: string }> = { ...prev };
      const defaultCarriage = carriages[0];
      const available = defaultCarriage.seats.filter((s) => s.status !== "occupied");

      let seatIdx = 0;
      passengersList.forEach((p) => {
        if (!newSeats[p.id] && seatIdx < available.length) {
          newSeats[p.id] = {
            carriageId: defaultCarriage.id,
            seatId: available[seatIdx].id,
          };
          seatIdx++;
        }
      });
      return newSeats;
    });
  }, [carriages, passengersList]);

  const cols = trainClass === "Ekonomi" ? ["A", "B", "C", "D", "E"] : ["A", "B", "C", "D"];
  const maxRows = 12;

  const isSeatAvailable = (carriageId: string, seatId: string) => {
    const carriage = carriages.find(c => c.id === carriageId);
    if (!carriage) return false;
    const seat = carriage.seats.find(s => s.id === seatId);
    if (!seat || seat.status === "occupied") return false;
    // Check if chosen by another passenger in the group
    const chosenByOther = Object.entries(selectedSeats).some(
      ([pid, s]) => pid !== activePassengerId && s.carriageId === carriageId && s.seatId === seatId
    );
    return !chosenByOther;
  };

  const getNextAvailableSeat = (direction: "up" | "down" | "left" | "right") => {
    if (!activePassengerId || !selectedSeats[activePassengerId]) return null;
    const currentSeat = selectedSeats[activePassengerId];
    if (currentSeat.carriageId !== activeCarriageId) return null;

    const match = currentSeat.seatId.match(/^(\d+)([A-Z])$/);
    if (!match) return null;

    const currentRow = parseInt(match[1], 10);
    const currentCol = match[2];
    const colIdx = cols.indexOf(currentCol);
    if (colIdx === -1) return null;

    if (direction === "up") {
      // Maju ke baris depan (angka baris mengecil)
      for (let r = currentRow - 1; r >= 1; r--) {
        const targetId = `${r}${currentCol}`;
        if (isSeatAvailable(activeCarriageId, targetId)) {
          return targetId;
        }
      }
    } else if (direction === "down") {
      // Mundur ke baris belakang (angka baris membesar)
      for (let r = currentRow + 1; r <= maxRows; r++) {
        const targetId = `${r}${currentCol}`;
        if (isSeatAvailable(activeCarriageId, targetId)) {
          return targetId;
        }
      }
    } else if (direction === "left") {
      // Geser kolom ke kiri
      for (let c = colIdx - 1; c >= 0; c--) {
        const targetId = `${currentRow}${cols[c]}`;
        if (isSeatAvailable(activeCarriageId, targetId)) {
          return targetId;
        }
      }
    } else if (direction === "right") {
      // Geser kolom ke kanan
      for (let c = colIdx + 1; c < cols.length; c++) {
        const targetId = `${currentRow}${cols[c]}`;
        if (isSeatAvailable(activeCarriageId, targetId)) {
          return targetId;
        }
      }
    }

    return null;
  };

  const canMove = (direction: "up" | "down" | "left" | "right") => {
    return !!getNextAvailableSeat(direction);
  };

  const moveSeat = (direction: "up" | "down" | "left" | "right") => {
    const nextSeatId = getNextAvailableSeat(direction);
    if (nextSeatId && activePassengerId) {
      setSelectedSeats(prev => ({
        ...prev,
        [activePassengerId]: { carriageId: activeCarriageId, seatId: nextSeatId }
      }));

      // Scroll smoothly to newly active seat if needed
      setTimeout(() => {
        const el = document.getElementById(`seat-${nextSeatId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        }
      }, 50);
    }
  };

  // Keyboard navigation support for Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (!activePassengerId || !selectedSeats[activePassengerId]) return;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveSeat("up");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        moveSeat("down");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveSeat("left");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        moveSeat("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePassengerId, selectedSeats, activeCarriageId, carriages, trainClass]);

  const handleSeatClick = (carriageId: string, seatId: string) => {
    if (!activePassengerId) return;

    // Check if seat is already assigned to someone else in group
    const assignedToOther = Object.entries(selectedSeats).find(
      ([pId, seat]) => pId !== activePassengerId && seat.carriageId === carriageId && seat.seatId === seatId
    );

    if (assignedToOther) {
      setActivePassengerId(assignedToOther[0]);
      return;
    }

    const currentSeat = selectedSeats[activePassengerId];
    if (currentSeat && currentSeat.carriageId === carriageId && currentSeat.seatId === seatId) {
      // Unselect
      const newSeats = { ...selectedSeats };
      delete newSeats[activePassengerId];
      setSelectedSeats(newSeats);
    } else {
      // Assign seat (stays focused on activePassengerId so user can move with arrows)
      setSelectedSeats(prev => ({
        ...prev,
        [activePassengerId]: { carriageId, seatId }
      }));
    }
  };

  const handleContinue = () => {
    let finalSeats = { ...selectedSeats };

    // Jika masih ada penumpang belum punya kursi, otomatis pilihkan kursi tersedia
    if (carriages.length > 0 && Object.keys(finalSeats).length < passengersList.length) {
      const activeCarriage = carriages.find((c) => c.id === activeCarriageId) || carriages[0];
      const available = activeCarriage.seats.filter(
        (s) => s.status !== "occupied" && !Object.values(finalSeats).some((fs) => fs.carriageId === activeCarriage.id && fs.seatId === s.id)
      );

      let availIdx = 0;
      passengersList.forEach((p) => {
        if (!finalSeats[p.id] && availIdx < available.length) {
          finalSeats[p.id] = {
            carriageId: activeCarriage.id,
            seatId: available[availIdx].id,
          };
          availIdx++;
        }
      });
      setSelectedSeats(finalSeats);
    }

    // Simpan kursi terpilih ke sessionStorage
    try {
      sessionStorage.setItem("booking_selected_seats", JSON.stringify(finalSeats));
    } catch (e) {
      console.error(e);
    }

    // Teruskan parameter pencarian ke halaman pembayaran
    const params = new URLSearchParams(searchParams.toString());
    if (!params.get("trainId")) params.set("trainId", trainId);
    if (returnTrainId && !params.get("returnTrainId")) params.set("returnTrainId", returnTrainId);
    if (!params.get("passengers")) params.set("passengers", String(passengersCount));
    if (!params.get("infants")) params.set("infants", String(infantsCount));
    if (paramOrigin && !params.get("origin")) params.set("origin", paramOrigin);
    if (paramDestination && !params.get("destination")) params.set("destination", paramDestination);

    router.push(`/pembayaran?${params.toString()}`);
  };

  const activeCarriage = carriages.find(c => c.id === activeCarriageId);

  const renderSeatButton = (col: string, rowSeats: Seat[], r: number) => {
    const seat = rowSeats.find(s => s.col === col);
    if (!seat) return <div key={col} className="w-10 h-12 md:w-12 md:h-13" />; // Spacer

    // Cek apakah kursi ini sudah dipilih
    const ownerEntry = Object.entries(selectedSeats).find(
      ([, s]) => s.carriageId === activeCarriageId && s.seatId === seat.id
    );
    const isSelected = !!ownerEntry;
    const isSelectedByActive = ownerEntry && ownerEntry[0] === activePassengerId;

    let containerClass = "relative w-10 h-12 md:w-12 md:h-13 rounded-t-lg rounded-b-sm flex flex-col items-center justify-center transition-all duration-150 border select-none ";

    if (seat.status === "occupied") {
      containerClass += "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-80";
    } else if (isSelected) {
      if (isSelectedByActive) {
        // Dipilih oleh penumpang yang sedang aktif -> Oranye KAI berkontras tinggi dengan ring penanda
        containerClass += "bg-[var(--color-accent)] border-[var(--color-accent)] text-white shadow-lg scale-105 z-10 ring-4 ring-orange-300 ring-offset-1 cursor-pointer";
      } else {
        // Dipilih oleh penumpang lain dalam rombongan -> Biru KAI tegas
        containerClass += "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-sm cursor-pointer";
      }
    } else {
      // Kursi tersedia
      containerClass += "bg-white border-slate-300 text-slate-800 hover:border-[var(--color-primary)] hover:bg-blue-50/60 hover:scale-105 shadow-2xs cursor-pointer";
    }

    return (
      <button
        id={`seat-${seat.id}`}
        key={col}
        type="button"
        disabled={seat.status === "occupied"}
        onClick={() => handleSeatClick(activeCarriageId, seat.id)}
        className={containerClass}
        title={
          seat.status === "occupied"
            ? `Kursi ${seat.id} (Sudah Terisi)`
            : ownerEntry
            ? `Kursi ${seat.id} dipilih oleh Penumpang ${ownerEntry[0]}`
            : `Pilih Kursi ${seat.id}`
        }
      >
        {/* Headrest Cushion Bar (Kain sandaran kepala KAI) */}
        <div className={`w-3/4 h-1.5 rounded-t-sm mb-1 ${
          isSelected
            ? "bg-white/40"
            : seat.status === "occupied"
            ? "bg-slate-200"
            : "bg-slate-200 group-hover:bg-blue-200"
        }`} />

        {/* Kolom & Simbol */}
        <div className="font-extrabold text-xs leading-none">
          {isSelected ? (
            <User size={13} strokeWidth={2.5} />
          ) : seat.status === "occupied" ? (
            <span className="text-[10px] text-slate-400 font-bold">✕</span>
          ) : (
            <span>{col}</span>
          )}
        </div>
        
        {/* Nomor Kursi Lengkap (cth: 1A, 1B) */}
        <div className={`text-[9px] font-bold leading-none mt-1 ${
          isSelected ? "text-white/90" : seat.status === "occupied" ? "text-slate-300" : "text-slate-400"
        }`}>
          {seat.id}
        </div>
      </button>
    );
  };

  const renderSeatRow = (r: number, rowSeats: Seat[]) => {
    // Ekonomi: ABC - DE, Eksekutif: AB - CD
    const leftGroup = trainClass === "Ekonomi" ? ["A", "B", "C"] : ["A", "B"];
    const rightGroup = trainClass === "Ekonomi" ? ["D", "E"] : ["C", "D"];

    return (
      <div key={r} className="flex justify-between items-center mb-2.5 group">
        {/* Kursi Kiri */}
        <div className="flex gap-1.5 md:gap-2">
          {leftGroup.map(col => renderSeatButton(col, rowSeats, r))}
        </div>
        
        {/* Lorong Jalan dengan Nomor Baris */}
        <div className="w-8 md:w-12 flex flex-col items-center justify-center">
          <div className="w-6 h-6 rounded bg-slate-100 border border-slate-200 text-slate-500 font-extrabold text-xs flex items-center justify-center shadow-2xs">
            {r}
          </div>
        </div>
        
        {/* Kursi Kanan */}
        <div className="flex gap-1.5 md:gap-2">
          {rightGroup.map(col => renderSeatButton(col, rowSeats, r))}
        </div>
      </div>
    );
  };

  const renderPassengerContent = () => (
    <>
      {infantsCount > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900 flex items-start gap-2.5 flex-shrink-0">
          <Baby size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">{infantsCount} Penumpang Bayi</div>
            <div className="text-[11px] text-amber-700 mt-0.5">Duduk dipangku bersama penumpang dewasa (tidak memerlukan reservasi kursi).</div>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {passengersList.map((p, index) => {
          const assignedSeat = selectedSeats[p.id];
          const isActive = activePassengerId === p.id;
          return (
            <div
              key={p.id}
              onClick={() => {
                setActivePassengerId(p.id);
                if (assignedSeat && assignedSeat.carriageId !== activeCarriageId) {
                  setActiveCarriageId(assignedSeat.carriageId);
                }
              }}
              className={`w-full text-left p-3.5 rounded-md transition-all border cursor-pointer ${
                isActive 
                  ? "bg-white border-2 border-[var(--color-primary)] shadow-sm" 
                  : "bg-gray-50/70 border-gray-200 hover:bg-gray-100/70 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isActive 
                      ? "bg-[var(--color-primary)] text-white" 
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`font-bold text-sm truncate ${isActive ? "text-[var(--color-primary)]" : "text-gray-800"}`}>
                      {p.name || `Penumpang ${index + 1}`}
                    </div>
                    {assignedSeat ? (
                      <div className="text-xs font-bold text-[var(--color-accent)] mt-0.5 flex items-center gap-1">
                        <span>Kursi {assignedSeat.seatId}</span>
                        <span className="text-gray-400 font-normal">({assignedSeat.carriageId})</span>
                      </div>
                    ) : (
                      <div className="text-xs font-medium text-gray-400 mt-0.5">Belum pilih kursi</div>
                    )}
                  </div>
                </div>
                
                {assignedSeat ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </div>
                ) : (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-sm flex-shrink-0 ${
                    isActive
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    Pilih
                  </span>
                )}
              </div>

              {/* Directional control buttons inside active passenger card */}
              {isActive && assignedSeat && assignedSeat.carriageId === activeCarriageId && (
                <div className="mt-2.5 pt-2 border-t border-blue-100 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pindah Kursi:</span>
                  <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200">
                    <button
                      type="button"
                      onClick={() => moveSeat("left")}
                      disabled={!canMove("left")}
                      title="Geser Kiri (←)"
                      className="w-6 h-6 rounded bg-white hover:bg-blue-50 text-slate-700 hover:text-[var(--color-primary)] disabled:opacity-25 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed flex items-center justify-center text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      <ArrowLeft size={13} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSeat("up")}
                      disabled={!canMove("up")}
                      title="Geser Atas/Maju (↑)"
                      className="w-6 h-6 rounded bg-white hover:bg-blue-50 text-slate-700 hover:text-[var(--color-primary)] disabled:opacity-25 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed flex items-center justify-center text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      <ArrowUp size={13} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSeat("down")}
                      disabled={!canMove("down")}
                      title="Geser Bawah/Mundur (↓)"
                      className="w-6 h-6 rounded bg-white hover:bg-blue-50 text-slate-700 hover:text-[var(--color-primary)] disabled:opacity-25 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed flex items-center justify-center text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      <ArrowDown size={13} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSeat("right")}
                      disabled={!canMove("right")}
                      title="Geser Kanan (→)"
                      className="w-6 h-6 rounded bg-white hover:bg-blue-50 text-slate-700 hover:text-[var(--color-primary)] disabled:opacity-25 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed flex items-center justify-center text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      <ArrowRight size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-muted)] pb-32 lg:pb-12 pt-[88px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6 whitespace-nowrap overflow-x-auto hide-scrollbar">
          <span className="font-bold text-[var(--color-primary-dark)] cursor-pointer hover:underline flex-shrink-0 inline-flex items-center gap-1.5" onClick={() => router.push("/")}>
            <CheckCircle2 size={14} strokeWidth={2.5} className="text-emerald-600 flex-shrink-0" />
            <span>Pencarian</span>
          </span>
          <ChevronRight size={14} className="text-gray-400 flex-shrink-0" strokeWidth={2} />
          <span className="font-bold text-[var(--color-primary-dark)] cursor-pointer hover:underline flex-shrink-0 inline-flex items-center gap-1.5" onClick={() => {
             router.back()
          }}>
            <CheckCircle2 size={14} strokeWidth={2.5} className="text-emerald-600 flex-shrink-0" />
            <span>Pilih Kereta</span>
          </span>
          <ChevronRight size={14} className="text-gray-400 flex-shrink-0" strokeWidth={2} />
          <span className="font-bold text-[var(--color-primary-dark)] cursor-pointer hover:underline flex-shrink-0 inline-flex items-center gap-1.5" onClick={() => router.back()}>
            <CheckCircle2 size={14} strokeWidth={2.5} className="text-emerald-600 flex-shrink-0" />
            <span>Isi Data Penumpang</span>
          </span>
          <ChevronRight size={14} className="text-gray-400 flex-shrink-0" strokeWidth={2} />
          <span className="font-medium text-gray-500 flex-shrink-0">Pilih Kursi</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start pb-28 lg:pb-0">
          
          {/* Main Content Area (Left Column - Seat Map) */}
          <div className="flex-1 w-full bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
            
            {/* 1. Header Ringkasan Kereta & Rangkaian */}
            <div className="bg-[var(--color-primary-dark)] text-white p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
                    <span>{returnTrainId ? "Kursi Keberangkatan" : "Perjalanan Kereta"}</span>
                    <span>•</span>
                    <span className="text-[var(--color-accent)] font-bold">{trainClass}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black flex items-center gap-2.5">
                    <Train size={24} className="text-[var(--color-accent)]" />
                    <span>{trainData?.name || "Kereta Api KAI"}</span>
                  </h2>
                </div>

                <div className="flex items-center gap-2.5 bg-white/10 px-3.5 py-2 rounded-md border border-white/10 text-xs sm:text-sm">
                  <span className="font-bold text-white">{trainOrigin}</span>
                  <ArrowRight size={15} className="text-[var(--color-accent)] flex-shrink-0" />
                  <span className="font-bold text-white">{trainDest}</span>
                </div>
              </div>

              {/* Formasi Rangkaian Kereta (Train Rake Tracker) */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-blue-200 uppercase tracking-wider flex items-center justify-between">
                  <span>Formasi Rangkaian Kereta ({carriages.length} Gerbong)</span>
                  <span className="hidden sm:inline text-white/60">Klik gerbong untuk berganti denah</span>
                  <span className="sm:hidden text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                    <span>Geser kanan/kiri</span>
                    <ChevronRight size={12} className="inline animate-pulse" />
                  </span>
                </div>

                {/* Track and train rake container with swipe / drag & scroll controls */}
                <div className="relative group/rake">
                  {/* Left scroll arrow button on mobile / narrow screens */}
                  {canScrollLeft && (
                    <button
                      type="button"
                      onClick={() => scrollRake("left")}
                      className="absolute -left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-slate-900/95 text-white border border-slate-700/90 flex items-center justify-center shadow-xl hover:bg-slate-800 transition-all cursor-pointer backdrop-blur-xs active:scale-95"
                      aria-label="Geser ke gerbong depan"
                    >
                      <ChevronLeft size={18} strokeWidth={2.5} />
                    </button>
                  )}

                  {/* Right scroll arrow button on mobile / narrow screens */}
                  {canScrollRight && (
                    <button
                      type="button"
                      onClick={() => scrollRake("right")}
                      className="absolute -right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-slate-900/95 text-white border border-slate-700/90 flex items-center justify-center shadow-xl hover:bg-slate-800 transition-all cursor-pointer backdrop-blur-xs active:scale-95"
                      aria-label="Geser ke gerbong belakang"
                    >
                      <ChevronRight size={18} strokeWidth={2.5} />
                    </button>
                  )}

                  {/* Edge gradient indicators */}
                  {canScrollLeft && (
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--color-primary-dark)] to-transparent pointer-events-none z-20" />
                  )}
                  {canScrollRight && (
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--color-primary-dark)] to-transparent pointer-events-none z-20" />
                  )}

                  {/* Scrollable / Draggable area */}
                  <div
                    ref={rakeContainerRef}
                    onMouseDown={handleRakeMouseDown}
                    onMouseMove={handleRakeMouseMove}
                    onMouseUp={handleRakeMouseUp}
                    onMouseLeave={handleRakeMouseUp}
                    className="overflow-x-auto hide-scrollbar pt-6 pb-1.5 relative z-10 scroll-smooth touch-pan-x overscroll-x-contain cursor-grab active:cursor-grabbing select-none"
                  >
                    <div className="flex flex-col min-w-max mx-auto">
                      {/* Satu Rangkaian Kereta Terhubung Rapat (Tight Continuous Train) */}
                      <div className="flex items-center justify-start sm:justify-center gap-0 px-2">
                        {/* 1. Gerbong Depan / Lokomotif */}
                        <div
                          className="flex-shrink-0 flex items-center justify-center select-none"
                          title="Lokomotif (Gerbong Depan)"
                        >
                          <img
                            src="/Kereta/gerbong_depan.webp"
                            alt="Gerbong Depan"
                            className="h-[36px] w-auto object-contain drop-shadow-md pointer-events-none"
                          />
                        </div>

                        {/* Coupler penghubung Lokomotif ke Gerbong 1 */}
                        <div className="w-2.5 h-3 bg-slate-800 border-y-2 border-slate-600 flex-shrink-0 flex items-center justify-center z-0">
                          <div className="w-full h-[1.5px] bg-slate-500" />
                        </div>

                        {/* 2. Gerbong-Gerbong Penumpang (K1, K2, dst.) */}
                        {carriages.map((c, idx) => {
                          const seatsInThisCarriage = Object.values(selectedSeats).filter(s => s.carriageId === c.id).length;
                          const isActive = activeCarriageId === c.id;
                          return (
                            <React.Fragment key={c.id}>
                              {idx > 0 && (
                                /* Coupler antar gerbong penumpang */
                                <div className="w-2.5 h-3 bg-slate-800 border-y-2 border-slate-600 flex-shrink-0 flex items-center justify-center z-0">
                                  <div className="w-full h-[1.5px] bg-slate-500" />
                                </div>
                              )}

                              <button
                                id={`carriage-btn-${c.id}`}
                                type="button"
                                onClick={() => {
                                  if (hasMovedRef.current) return;
                                  setActiveCarriageId(c.id);
                                }}
                                className={`flex-shrink-0 flex flex-col items-center justify-between min-w-[80px] sm:min-w-[84px] h-[46px] px-2.5 py-1.5 rounded-sm font-bold transition-all border cursor-pointer z-10 ${
                                  isActive
                                    ? "bg-white text-[var(--color-primary-dark)] border-white shadow-md ring-2 ring-[var(--color-accent)] scale-[1.02]"
                                    : "bg-slate-800/95 hover:bg-slate-700/95 text-white border-slate-700"
                                }`}
                              >
                                <div className="w-full flex items-center justify-between gap-1 text-[9px] sm:text-[10px]">
                                  <span className={isActive ? "text-[var(--color-primary)] font-black" : "text-slate-400"}>
                                    K{idx + 1}
                                  </span>
                                  {seatsInThisCarriage > 0 ? (
                                    <span className="bg-[var(--color-accent)] text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded-xs flex items-center gap-0.5">
                                      <Check size={8} strokeWidth={3} /> {seatsInThisCarriage}
                                    </span>
                                  ) : (
                                    <span className={`text-[8px] sm:text-[9px] font-semibold ${isActive ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                                      Tersedia
                                    </span>
                                  )}
                                </div>

                                <div className="font-extrabold text-[11px] sm:text-xs tracking-wide leading-none mb-0.5">
                                  {c.name}
                                </div>
                              </button>
                            </React.Fragment>
                          );
                        })}

                        {/* Coupler penghubung Gerbong Terakhir ke Kereta Makan */}
                        <div className="w-2.5 h-3 bg-slate-800 border-y-2 border-slate-600 flex-shrink-0 flex items-center justify-center z-0">
                          <div className="w-full h-[1.5px] bg-slate-500" />
                        </div>

                        {/* 3. Gerbong Restorasi / Makan */}
                        <div
                          className="relative flex-shrink-0 flex items-center justify-center select-none group"
                          title="Kereta Makan (Restorasi KAI - Kuliner & Makanan)"
                        >
                          {/* Floating Badge Indikator Kereta Makan di Atas */}
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[9px] tracking-wide shadow-md border border-amber-300">
                              <Utensils size={9} strokeWidth={2.5} className="text-white" />
                              <span>Kereta Makan</span>
                            </div>
                          </div>

                          {/* Gambar Gerbong Makan dengan Efek Lampu Restoran */}
                          <div className="relative">
                            <img
                              src="/Kereta/gerbong_makan.webp"
                              alt="Kereta Makan (Restorasi)"
                              className="h-[36px] w-auto object-contain drop-shadow-[0_2px_10px_rgba(245,158,11,0.45)] transition-transform group-hover:scale-[1.02] pointer-events-none"
                            />

                            {/* Mini Badge Icon Sendok-Garpu di Sudut Gerbong */}
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md ring-1 ring-slate-900">
                              <Utensils size={8} strokeWidth={2.5} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rel Kereta Api di bawah seluruh rangkaian */}
                      <div className="w-full h-[2.5px] bg-slate-600 mt-1 shadow-xs" />
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* 3. Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7 p-3.5 border-b border-gray-200 bg-white text-xs sm:text-sm font-semibold text-gray-700">
              {/* Tersedia */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-6 rounded-t-md rounded-b-xs border-2 border-slate-300 bg-white flex flex-col items-center justify-start p-0.5 shadow-2xs">
                  <div className="w-3.5 h-1 bg-slate-200 rounded-t-xs" />
                </div>
                <span>Tersedia</span>
              </div>

              {/* Kursi Terpilih */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-6 rounded-t-md rounded-b-xs bg-[var(--color-accent)] border border-[var(--color-accent)] text-white flex flex-col items-center justify-between p-0.5 shadow-xs ring-2 ring-orange-200">
                  <div className="w-3.5 h-1 bg-white/40 rounded-t-xs" />
                  <User size={10} strokeWidth={2.5} className="mb-0.5" />
                </div>
                <span>Kursi Terpilih</span>
              </div>

              {/* Penumpang Lain */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-6 rounded-t-md rounded-b-xs bg-[var(--color-primary)] border border-[var(--color-primary)] text-white flex flex-col items-center justify-between p-0.5 shadow-xs">
                  <div className="w-3.5 h-1 bg-white/40 rounded-t-xs" />
                  <User size={10} strokeWidth={2.5} className="mb-0.5" />
                </div>
                <span>Penumpang Lain</span>
              </div>

              {/* Terisi */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-6 rounded-t-md rounded-b-xs bg-slate-100 border border-slate-200 text-slate-400 flex flex-col items-center justify-between p-0.5 opacity-80">
                  <div className="w-3.5 h-1 bg-slate-200 rounded-t-xs" />
                  <span className="text-[9px] font-bold leading-none mb-0.5">✕</span>
                </div>
                <span>Terisi</span>
              </div>
            </div>

            {/* 4. Realistic Train Carriage Blueprint */}
            <div className="p-6 md:p-10 flex justify-center bg-slate-100/70 border-t border-slate-200 overflow-x-auto">
              
              {/* Kereta Illustration Envelope */}
              <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-md relative min-w-[320px] md:min-w-[400px] max-w-[460px] w-full p-6 md:p-8">
                
                {/* Coupler Sambungan Depan */}
                <div className="w-16 h-2.5 bg-slate-400 mx-auto rounded-t-sm mb-3 shadow-xs" />

                {/* Arah Kereta Marker */}
                <div className="mb-5 pb-3 border-b-2 border-dashed border-slate-200 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-widest">
                  <ArrowUp size={16} className="text-[var(--color-primary)]" strokeWidth={2.5} />
                  <span>Depan (Arah Laju Kereta)</span>
                </div>

                {/* Bordes Depan (Area Masuk & Fasilitas) */}
                <div className="grid grid-cols-3 gap-2 mb-6 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center text-[11px] font-bold text-slate-600 relative z-30">
                  {/* 1. Toilet Depan (Interactive photo preview) */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedFacility("toilet")}
                    onMouseEnter={() => setHoveredFacility("toilet-front")}
                    onMouseLeave={() => setHoveredFacility(null)}
                    className="relative flex flex-col items-center justify-center p-1.5 bg-white hover:bg-blue-50/70 rounded border border-slate-200 hover:border-[var(--color-primary)] shadow-2xs cursor-pointer transition-all group"
                    title="Klik untuk melihat foto fasilitas Toilet Kereta"
                  >
                    <div className="w-5 h-5 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px] font-black text-slate-600 mb-0.5 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">WC</div>
                    <span className="text-[10px] text-slate-700 font-bold">Toilet</span>
                    <span className="text-[8px] text-blue-600 font-bold mt-0.5 flex items-center gap-0.5">
                      <span>Foto</span> ↗
                    </span>

                    {/* Floating Hover Card (Opens downwards into cabin to avoid top clipping) */}
                    {hoveredFacility === "toilet-front" && (
                      <div className="absolute top-full mt-2 left-0 w-56 p-2 bg-slate-900/95 text-white rounded-xl shadow-2xl border border-slate-700 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 text-left backdrop-blur-xs">
                        <img src="/fasilitas/toilet.jpg" alt="Toilet Kereta" className="w-full h-24 object-cover rounded-lg mb-1.5" />
                        <div className="text-[10px] font-bold text-amber-300">Toilet Ramah Lingkungan</div>
                        <div className="text-[8.5px] text-slate-300 leading-tight mt-0.5">Kloset duduk higienis, wastafel stainless, cermin LED, dan handrail.</div>
                        <div className="text-[8px] text-blue-300 mt-1 font-semibold">Klik untuk foto lengkap</div>
                      </div>
                    )}
                  </div>

                  {/* 2. Pintu Masuk (Doorway architectural floor plan - NOT white button) */}
                  <div className="flex flex-col items-center justify-center p-2 bg-slate-200/90 rounded border border-dashed border-slate-400 text-slate-700 select-none cursor-default">
                    <DoorOpen size={16} className="text-slate-600 mb-0.5 opacity-90" />
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-700">Pintu Masuk</span>
                    <span className="text-[8px] text-slate-500 font-semibold mt-0.5">Bordes Depan</span>
                  </div>

                  {/* 3. Rak Bagasi (Interactive photo preview) */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedFacility("bagasi")}
                    onMouseEnter={() => setHoveredFacility("bagasi")}
                    onMouseLeave={() => setHoveredFacility(null)}
                    className="relative flex flex-col items-center justify-center p-1.5 bg-white hover:bg-blue-50/70 rounded border border-slate-200 hover:border-[var(--color-primary)] shadow-2xs cursor-pointer transition-all group"
                    title="Klik untuk melihat foto Rak Koper Besar"
                  >
                    <Luggage size={16} className="text-slate-600 mb-0.5 group-hover:text-blue-600 transition-colors" />
                    <span className="text-[10px] text-slate-700 font-bold">Rak Koper</span>
                    <span className="text-[8px] text-blue-600 font-bold mt-0.5 flex items-center gap-0.5">
                      <span>Foto</span> ↗
                    </span>

                    {/* Floating Hover Card (Opens downwards into cabin to avoid top clipping) */}
                    {hoveredFacility === "bagasi" && (
                      <div className="absolute top-full mt-2 right-0 w-56 p-2 bg-slate-900/95 text-white rounded-xl shadow-2xl border border-slate-700 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 text-left backdrop-blur-xs">
                        <img src="/fasilitas/bagasi.jpg" alt="Rak Koper Besar Ujung Gerbong" className="w-full h-24 object-cover rounded-lg mb-1.5" />
                        <div className="text-[10px] font-bold text-amber-300">Rak Koper Besar (Ujung Gerbong)</div>
                        <div className="text-[8.5px] text-slate-300 leading-tight mt-0.5">Rak bertingkat di dekat pintu bordes untuk koper besar & barang berat penumpang.</div>
                        <div className="text-[8px] text-blue-300 mt-1 font-semibold">Klik untuk foto lengkap</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Indikator Posisi Jendela & Lorong */}
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 rounded-xs bg-sky-200 border border-sky-400 inline-block" />
                    <span>Sisi Jendela</span>
                  </div>
                  <span className="text-slate-600 font-extrabold">Lorong Tengah</span>
                  <div className="flex items-center gap-1.5">
                    <span>Sisi Jendela</span>
                    <span className="w-1.5 h-3.5 rounded-xs bg-sky-200 border border-sky-400 inline-block" />
                  </div>
                </div>

                {/* Grid Kursi Penumpang */}
                {activeCarriage && (
                  <div className="flex flex-col px-1">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const r = i + 1;
                      const rowSeats = activeCarriage.seats.filter(s => s.row === r);
                      return renderSeatRow(r, rowSeats);
                    })}
                  </div>
                )}

                {/* Bordes Belakang (Area Keluar & Fasilitas) */}
                <div className="grid grid-cols-3 gap-2 mt-6 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center text-[11px] font-bold text-slate-600 relative z-30">
                  {/* 1. APAR (Interactive photo preview) */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedFacility("apar")}
                    onMouseEnter={() => setHoveredFacility("apar")}
                    onMouseLeave={() => setHoveredFacility(null)}
                    className="relative flex flex-col items-center justify-center p-1.5 bg-white hover:bg-rose-50/70 rounded border border-slate-200 hover:border-rose-400 shadow-2xs cursor-pointer transition-all group"
                    title="Klik untuk melihat foto APAR Kereta"
                  >
                    <div className="w-5 h-5 rounded bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-0.5 group-hover:bg-rose-100 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600">
                        <path d="M10 2.5h4" />
                        <path d="M12 2.5v3.5" />
                        <path d="M12 6h2" />
                        <path d="M14 4h3a1 1 0 0 1 1 1v4" />
                        <rect x="7.5" y="6" width="9" height="15" rx="3" fill="currentColor" fillOpacity="0.25" />
                        <circle cx="12" cy="11" r="1.2" fill="currentColor" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-slate-700 font-bold">APAR</span>
                    <span className="text-[8px] text-rose-600 font-bold mt-0.5 flex items-center gap-0.5">
                      <span>Foto</span> ↗
                    </span>

                    {/* Floating Hover Card */}
                    {hoveredFacility === "apar" && (
                      <div className="absolute bottom-full mb-2 left-0 w-56 p-2 bg-slate-900/95 text-white rounded-xl shadow-2xl border border-slate-700 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 text-left backdrop-blur-xs">
                        <img src="/fasilitas/apar.jpg" alt="APAR Kereta" className="w-full h-24 object-cover rounded-lg mb-1.5" />
                        <div className="text-[10px] font-bold text-amber-300">Alat Pemadam Api Ringan</div>
                        <div className="text-[8.5px] text-slate-300 leading-tight mt-0.5">Tabung pemadam siaga darurat KAI di dinding bordes pintu keluar.</div>
                        <div className="text-[8px] text-blue-300 mt-1 font-semibold">Klik untuk foto lengkap</div>
                      </div>
                    )}
                  </div>

                  {/* 2. Pintu Keluar (Doorway architectural floor plan - NOT white button) */}
                  <div className="flex flex-col items-center justify-center p-2 bg-slate-200/90 rounded border border-dashed border-slate-400 text-slate-700 select-none cursor-default">
                    <DoorOpen size={16} className="text-slate-600 mb-0.5 opacity-90" />
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-700">Pintu Keluar</span>
                    <span className="text-[8px] text-slate-500 font-semibold mt-0.5">Bordes Belakang</span>
                  </div>

                  {/* 3. Toilet Belakang (Interactive photo preview) */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedFacility("toilet")}
                    onMouseEnter={() => setHoveredFacility("toilet-rear")}
                    onMouseLeave={() => setHoveredFacility(null)}
                    className="relative flex flex-col items-center justify-center p-1.5 bg-white hover:bg-blue-50/70 rounded border border-slate-200 hover:border-[var(--color-primary)] shadow-2xs cursor-pointer transition-all group"
                    title="Klik untuk melihat foto Toilet Kereta"
                  >
                    <div className="w-5 h-5 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px] font-black text-slate-600 mb-0.5 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">WC</div>
                    <span className="text-[10px] text-slate-700 font-bold">Toilet</span>
                    <span className="text-[8px] text-blue-600 font-bold mt-0.5 flex items-center gap-0.5">
                      <span>Foto</span> ↗
                    </span>

                    {/* Floating Hover Card */}
                    {hoveredFacility === "toilet-rear" && (
                      <div className="absolute bottom-full mb-2 right-0 w-56 p-2 bg-slate-900/95 text-white rounded-xl shadow-2xl border border-slate-700 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 text-left backdrop-blur-xs">
                        <img src="/fasilitas/toilet.jpg" alt="Toilet Kereta" className="w-full h-24 object-cover rounded-lg mb-1.5" />
                        <div className="text-[10px] font-bold text-amber-300">Toilet Ramah Lingkungan</div>
                        <div className="text-[8.5px] text-slate-300 leading-tight mt-0.5">Kloset duduk higienis, wastafel stainless, cermin LED, dan handrail.</div>
                        <div className="text-[8px] text-blue-300 mt-1 font-semibold">Klik untuk foto lengkap</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Belakang Kereta Marker */}
                <div className="mt-5 pt-3 border-t-2 border-dashed border-slate-200 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Sambungan Gerbong Belakang</span>
                </div>

                {/* Coupler Sambungan Belakang */}
                <div className="w-16 h-2.5 bg-slate-400 mx-auto rounded-b-sm mt-3 shadow-xs" />
              </div>

            </div>
          </div>

          {/* DESKTOP Right Sidebar (hidden on mobile: hidden lg:block) */}
          <div className="hidden lg:block w-80 flex-shrink-0 self-start sticky top-[104px]">
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-128px)]">
              {/* Header */}
              <div className="bg-[var(--color-primary-dark)] text-white p-4 flex items-center justify-between flex-shrink-0">
                <div>
                  <h3 className="font-bold text-base">Daftar Penumpang</h3>
                  <div className="text-xs text-blue-200 mt-0.5">
                    {Object.keys(selectedSeats).length} dari {passengersList.length} kursi dipilih
                  </div>
                </div>
                <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                  {Object.keys(selectedSeats).length}/{passengersList.length}
                </div>
              </div>

              {/* Scrollable list */}
              <div className="p-3 overflow-y-auto flex-1 min-h-0 space-y-3">
                {renderPassengerContent()}
              </div>

              {/* Pinned action footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex justify-between items-center mb-3 text-sm">
                  <span className="text-gray-600 font-medium">Status Pemilihan</span>
                  <span className={`font-bold ${
                    Object.keys(selectedSeats).length === passengersList.length 
                      ? "text-emerald-700" 
                      : "text-[var(--color-primary)]"
                  }`}>
                    {Object.keys(selectedSeats).length} / {passengersList.length} Kursi
                  </span>
                </div>
                
                <button
                  onClick={handleContinue}
                  className="w-full py-3.5 bg-[var(--color-accent)] hover:bg-[#E07015] text-white font-extrabold text-base rounded-md transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Simpan & Lanjutkan</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* MOBILE: Expandable Bottom Drawer / Sheet (Floating at bottom, behaviour like /cari page) */}
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
            type="button"
            onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
            className="w-full pt-2.5 pb-2 px-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 flex-shrink-0"
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full mb-1.5" />
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)]">
                <span>{isMobileSummaryOpen ? "Tutup Rincian Penumpang" : "Lihat Daftar Penumpang"}</span>
                {isMobileSummaryOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </div>
              <div className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                Object.keys(selectedSeats).length === passengersList.length
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-blue-50 text-[var(--color-primary)] border border-blue-200"
              }`}>
                {Object.keys(selectedSeats).length}/{passengersList.length} Kursi
              </div>
            </div>
          </button>

          {/* Expanded Scrollable Body */}
          {isMobileSummaryOpen && (
            <div className="overflow-y-auto px-4 py-3 flex-1 space-y-3 min-h-0 bg-slate-50/60">
              {renderPassengerContent()}
            </div>
          )}

          {/* Fixed bottom action bar on mobile */}
          <div className="p-3.5 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex justify-between items-center mb-2.5 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 font-medium">Aktif:</span>
                <span className="font-bold text-[var(--color-primary)] truncate max-w-[140px]">
                  {passengersList.find(p => p.id === activePassengerId)?.name || `Penumpang ${passengersList.findIndex(p => p.id === activePassengerId) + 1}`}
                </span>
              </div>
              <div className="font-bold text-xs">
                {selectedSeats[activePassengerId] ? (
                  <span className="text-[var(--color-accent)]">
                    Kursi {selectedSeats[activePassengerId].seatId} <span className="text-gray-400 font-normal">({selectedSeats[activePassengerId].carriageId})</span>
                  </span>
                ) : (
                  <span className="text-amber-600 font-semibold">Pilih kursi di denah</span>
                )}
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full py-3.5 rounded-md font-bold text-base transition-colors flex justify-center items-center gap-2 bg-[var(--color-accent)] hover:bg-[#E07015] text-white cursor-pointer shadow-sm"
            >
              <span>Simpan & Lanjutkan</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Modal Pratinjau Foto Fasilitas Kereta */}
        {selectedFacility && FACILITY_DATA[selectedFacility] && (
          <div
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedFacility(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={FACILITY_DATA[selectedFacility].image}
                  alt={FACILITY_DATA[selectedFacility].title}
                  className="w-full h-64 sm:h-72 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSelectedFacility(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  ✕
                </button>
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <span className="text-sm">{FACILITY_DATA[selectedFacility].icon}</span>
                  <span>{FACILITY_DATA[selectedFacility].badge}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base sm:text-lg font-black text-slate-800 mb-1">
                  {FACILITY_DATA[selectedFacility].title}
                </h3>
                <p className="text-xs font-bold text-[var(--color-primary)] mb-2">
                  {FACILITY_DATA[selectedFacility].subtitle}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {FACILITY_DATA[selectedFacility].description}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedFacility(null)}
                  className="w-full py-2.5 rounded-lg bg-[var(--color-primary)] hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PilihKursiPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--color-primary)] font-bold">Loading...</div>}>
        <PilihKursiContent />
      </Suspense>
    </MainLayout>
  );
}
