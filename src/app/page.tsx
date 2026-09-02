"use client";
// Force HMR refresh

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { PriceCalendar } from "@/components/booking/PriceCalendar";
import {
  STATIONS,
  POPULAR_ROUTES,
  formatPrice,
  getPricesByMonth,
  getStationByCode,
  getCityImage,
} from "@/lib/mockData";
import {
  Train,
  Calendar,
  User,
  Baby,
  MapPin,
  Navigation,
  Map,
  ChevronDown,
  Check,
  ArrowLeftRight,
  Search,
  Plus,
  Minus,
  Info,
  ChevronUp,
  Tag,
} from "lucide-react";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LandingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = new Date().toISOString().split("T")[0];

  // Read initial origin/dest from query params if coming from map page
  const queryOrigin = searchParams.get("origin") || "";
  const queryDest = searchParams.get("dest") || "";

  // Form state
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [origin, setOrigin] = useState(queryOrigin);
  const [destination, setDestination] = useState(queryDest);
  const [departDate, setDepartDate] = useState(today);
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [infants, setInfants] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [promoOpen, setPromoOpen] = useState(false);

  // Refs for click outside
  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setShowOriginList(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setShowDestList(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Modals
  const [showDepartCal, setShowDepartCal] = useState(false);
  const [showReturnCal, setShowReturnCal] = useState(false);

  // Station dropdowns
  const [originSearch, setOriginSearch] = useState("");
  const [destSearch, setDestSearch] = useState("");
  const [showOriginList, setShowOriginList] = useState(false);
  const [showDestList, setShowDestList] = useState(false);

  const originStation = getStationByCode(origin);
  const destStation = getStationByCode(destination);

  const priceMap = getPricesByMonth(
    parseInt(departDate.split("-")[0]),
    parseInt(departDate.split("-")[1])
  );
  const selectedPrice = priceMap[departDate];

  const returnPriceMap = returnDate ? getPricesByMonth(
    parseInt(returnDate.split("-")[0]),
    parseInt(returnDate.split("-")[1])
  ) : {};
  const selectedReturnPrice = returnDate ? returnPriceMap[returnDate] : null;

  function swapStations() {
    setOrigin(destination);
    setDestination(origin);
  }

  function handleSearch() {
    if (!origin || !destination || !departDate) return;
    const params = new URLSearchParams({
      origin,
      destination,
      date: departDate,
      passengers: String(passengers),
      infants: String(infants),
      tripType,
      ...(tripType === "round-trip" && returnDate ? { returnDate } : {}),
      ...(promoCode ? { promo: promoCode } : {}),
    });
    router.push(`/search-results?${params.toString()}`);
  }

  const originFiltered = STATIONS.filter(s => {
    if (s.code === destination) return false;
    if (!originSearch) return true;
    const q = originSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.city.toLowerCase().includes(q);
  });

  const destFiltered = STATIONS.filter(s => {
    if (s.code === origin) return false;
    if (!destSearch) return true;
    const q = destSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.city.toLowerCase().includes(q);
  });

  function formatDateDisplay(dateStr: string) {
    if (!dateStr) return "Pilih tanggal";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <MainLayout>
      {/* ── Page wrapper: split background ── */}
      <div className="relative min-h-screen">

        {/* Top half background (behind the ticket form) */}
        <div className="absolute top-0 left-0 right-0 h-[60vh] overflow-hidden bg-[var(--color-primary-dark)]">
          <Image
            src="/Background/background_1.webp"
            alt="KAI Background"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient: darken the image so text/card is readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary-dark)]/80 via-[var(--color-primary)]/60 to-[var(--color-primary)]/20" />

          {/* Curved shape divider at the bottom of the image */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
            <svg className="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V120H1200V0C1000,100 200,100 0,0Z" fill="var(--color-bg-muted)"></path>
            </svg>
          </div>
        </div>

        {/* Bottom half: plain muted bg */}
        <div className="absolute top-[60vh] bottom-0 left-0 right-0 bg-[var(--color-bg-muted)]" />

        {/* Content over the split background */}
        <div className="relative z-10 flex flex-col items-center px-4 md:px-8 pt-28 pb-16">

          {/* Mascot and Speech Bubble */}
          <div className="w-full max-w-2xl flex items-end justify-center mb-[5px] z-30">
            <Image
              src="/Maskot/maskot_lambai.webp"
              alt="Mascot KAI"
              width={130}
              height={130}
              className="object-contain z-20 relative top-2"
            />
            <div className="relative bg-white text-[var(--color-primary)] text-lg sm:text-md px-6 py-3 rounded-2xl shadow-xl mb-12 ml-2 z-10">
              Mau ke mana hari ini?
              {/* Bubble Tail */}
              <div className="absolute bottom-3 -left-3 w-0 h-0 border-t-[8px] border-t-transparent border-r-[12px] border-r-white border-b-[8px] border-b-transparent"></div>
            </div>
          </div>

          {/* ───────────────── TICKET CARD ───────────────── */}
          <div className="w-full max-w-2xl flex flex-col drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] relative z-40">

            {/* --- TOP TICKET HALF --- */}
            <div className="bg-white rounded-t-[16px] relative">

              {/* Ticket top stripe: trip type toggle */}
              <div className="flex rounded-t-[16px] overflow-hidden border-b-2 border-dashed border-gray-200">
                {(["one-way", "round-trip"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTripType(type)}
                    className={`flex-1 py-3.5 text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${tripType === type
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-gray-500 hover:bg-gray-50 bg-white"
                      }`}
                  >
                    <Train size={14} />
                    {type === "one-way" ? "Sekali Jalan" : "Pulang-Pergi"}
                  </button>
                ))}
              </div>

              {/* Ticket body (Top) */}
              <div className="px-6 py-6 pb-5 space-y-5 relative z-30">

                {/* Route section: Origin → Destination */}
                <div className="flex items-center gap-3">
                  {/* Origin */}
                  <div className="flex-1 relative" ref={originRef}>
                    <p className="text-[12px] font-bold text-gray-400 tracking-widest mb-1 flex items-center gap-1.5">
                      <Navigation size={14} className="text-[var(--color-primary)]" />
                      Asal
                    </p>
                    <button
                      onClick={() => { setShowOriginList(true); setShowDestList(false); }}
                      className={`w-full text-left cursor-pointer border rounded-xl px-3 py-2 transition-all group relative overflow-hidden ${origin ? "border-[var(--color-primary)] shadow-sm" : "border-gray-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-info-bg)]"
                        }`}
                    >
                      {origin && originStation && (
                        <>
                          <div
                            className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('${getCityImage(originStation.city)}')` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/80 to-[var(--color-primary)]/10 z-10" />
                        </>
                      )}

                      <div className="flex items-center justify-between relative z-20">
                        <div>
                          {origin ? (
                            <>
                              <div className="font-black text-xl text-white leading-none drop-shadow-md">{origin}</div>
                              <div className="text-sm font-semibold text-white mt-0.5 truncate drop-shadow-md">{originStation?.name}</div>
                              <div className="text-xs text-white/90 drop-shadow-md">{originStation?.city}</div>
                            </>
                          ) : (
                            <div className="font-medium text-[15px] text-gray-400 flex items-center h-[52px]">Pilih Asal</div>
                          )}
                        </div>
                        <ChevronDown size={16} className={`${origin ? 'text-white/80' : 'text-gray-300 group-hover:text-[var(--color-primary)]'} transition-colors flex-shrink-0`} />
                      </div>
                    </button>

                    {showOriginList && (
                      <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl mt-2 overflow-hidden w-[320px] sm:w-[400px] max-w-[90vw]">
                        <div className="p-2 border-b border-gray-100">
                          <input
                            autoFocus
                            type="text"
                            placeholder="Cari stasiun asal..."
                            value={originSearch}
                            onChange={e => setOriginSearch(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-[var(--color-primary)]"
                          />
                        </div>
                        {/* Terdekat */}
                        <button
                          onClick={() => {
                            if (navigator.geolocation) {
                              // Mock: pick nearest station (GMR for demo)
                              const nearest = "GMR";
                              setOrigin(nearest);
                              if (destination === nearest) setDestination("");
                              setShowOriginList(false);
                              setOriginSearch("");
                            }
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--color-info-bg)] text-left cursor-pointer border-b border-gray-100"
                        >
                          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                            <MapPin size={14} className="text-[var(--color-primary)]" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[var(--color-primary)]">Terdekat</div>
                            <div className="text-[11px] text-gray-400">Gunakan lokasimu</div>
                          </div>
                        </button>
                        <div className="max-h-[300px] overflow-y-auto pb-2">
                          {Object.entries(
                            originFiltered.reduce((acc, curr) => {
                              if (!acc[curr.city]) acc[curr.city] = [];
                              acc[curr.city].push(curr);
                              return acc;
                            }, {} as Record<string, typeof STATIONS>)
                          ).map(([city, stations]) => (
                            <div key={city}>
                              <div className="bg-gray-50 px-4 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest sticky top-0 z-10 border-y border-gray-100">
                                {city}
                              </div>
                              {stations.map(s => (
                                <button
                                  key={s.id}
                                  onClick={() => { setOrigin(s.code); setShowOriginList(false); setOriginSearch(""); }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--color-info-bg)] text-left cursor-pointer"
                                >
                                  <div className="font-bold text-sm text-[var(--color-primary)] w-10 flex-shrink-0">{s.code}</div>
                                  <div>
                                    <div className="font-semibold text-sm">{s.name}</div>
                                    <div className="text-xs text-gray-400">{s.city}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Swap + arrow divider */}
                  <div className="flex flex-col items-center gap-1.5 flex-shrink-0 mt-[18px]">
                    {/* Dashed connector line */}
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-px border-t-2 border-dashed border-gray-300" />
                      <button
                        onClick={swapStations}
                        aria-label="Tukar stasiun"
                        className="p-2 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-all cursor-pointer shadow-md hover:scale-110 active:scale-95"
                      >
                        <ArrowLeftRight size={14} />
                      </button>
                      <div className="w-8 h-px border-t-2 border-dashed border-gray-300" />
                    </div>
                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">swap</span>
                  </div>

                  {/* Destination */}
                  <div className="flex-1 relative text-right" ref={destRef}>
                    <p className="text-[12px] font-bold text-gray-400 tracking-widest mb-1 flex items-center justify-end gap-1.5">
                      <MapPin size={14} className="text-[var(--color-accent)]" />
                      Tujuan
                    </p>
                    <button
                      onClick={() => { setShowDestList(true); setShowOriginList(false); }}
                      className={`w-full text-right cursor-pointer border rounded-xl px-3 py-2 transition-all group relative overflow-hidden ${destination ? "border-[var(--color-accent)] shadow-sm" : "border-gray-200 hover:border-[var(--color-accent)] hover:bg-orange-50"
                        }`}
                    >
                      {destination && destStation && (
                        <>
                          <div
                            className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('${getCityImage(destStation.city)}')` }}
                          />
                          {/* Right-to-left gradient for destination to keep text readable on the right side */}
                          <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-accent)] via-[var(--color-accent)]/80 to-[var(--color-accent)]/10 z-10" />
                        </>
                      )}

                      <div className="flex items-center justify-between relative z-20">
                        <ChevronDown size={16} className={`${destination ? 'text-white/80' : 'text-gray-300 group-hover:text-[var(--color-accent)]'} transition-colors flex-shrink-0`} />
                        <div>
                          {destination ? (
                            <>
                              <div className="font-black text-xl text-white leading-none drop-shadow-md">{destination}</div>
                              <div className="text-sm font-semibold text-white mt-0.5 truncate drop-shadow-md">{destStation?.name}</div>
                              <div className="text-xs text-white/90 drop-shadow-md">{destStation?.city}</div>
                            </>
                          ) : (
                            <div className="font-medium text-[15px] text-gray-400 text-right flex items-center justify-end h-[52px]">Pilih Tujuan</div>
                          )}
                        </div>
                      </div>
                    </button>

                    {showDestList && (
                      <div className="absolute top-full right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl mt-2 overflow-hidden w-[320px] sm:w-[400px] max-w-[90vw] text-left">
                        <div className="p-2 border-b border-gray-100">
                          <input
                            autoFocus
                            type="text"
                            placeholder="Cari stasiun tujuan..."
                            value={destSearch}
                            onChange={e => setDestSearch(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-[var(--color-accent)]"
                          />
                        </div>
                        {/* Terdekat */}
                        <button
                          onClick={() => {
                            if (navigator.geolocation) {
                              // Mock: pick nearest station (BDO for demo)
                              const nearest = "BDO";
                              setDestination(nearest);
                              if (origin === nearest) setOrigin("");
                              setShowDestList(false);
                              setDestSearch("");
                            }
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 text-left cursor-pointer border-b border-gray-100"
                        >
                          <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                            <MapPin size={14} className="text-[var(--color-accent)]" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[var(--color-accent)]">Terdekat</div>
                            <div className="text-[11px] text-gray-400">Gunakan lokasimu</div>
                          </div>
                        </button>
                        <div className="max-h-[300px] overflow-y-auto pb-2">
                          {Object.entries(
                            destFiltered.reduce((acc, curr) => {
                              if (!acc[curr.city]) acc[curr.city] = [];
                              acc[curr.city].push(curr);
                              return acc;
                            }, {} as Record<string, typeof STATIONS>)
                          ).map(([city, stations]) => (
                            <div key={city}>
                              <div className="bg-gray-50 px-4 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest sticky top-0 z-10 border-y border-gray-100">
                                {city}
                              </div>
                              {stations.map(s => (
                                <button
                                  key={s.id}
                                  onClick={() => { setDestination(s.code); setShowDestList(false); setDestSearch(""); }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 text-left cursor-pointer"
                                >
                                  <div className="font-bold text-sm text-[var(--color-accent)] w-10 flex-shrink-0">{s.code}</div>
                                  <div>
                                    <div className="font-semibold text-sm">{s.name}</div>
                                    <div className="text-xs text-gray-400">{s.city}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Map route link */}
                <div className="flex justify-end -mt-2">
                  <button
                    onClick={() => router.push(`/peta-rute?origin=${origin}&dest=${destination}`)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-blue-50 transition-colors cursor-pointer bg-white"
                  >
                    <Map size={16} />
                    Pilih lewat peta rute
                  </button>
                </div>
              </div>
            </div>

            {/* --- TEAR LINE (CONNECTOR) --- */}
            <div className="relative z-[5] flex items-stretch h-8 w-full pointer-events-none">
              {/* Left cutout */}
              <div className="w-4 relative overflow-hidden flex-shrink-0">
                <div className="absolute left-[-16px] top-0 w-8 h-8 rounded-full shadow-[0_0_0_40px_white]" />
              </div>

              {/* Middle dashed line */}
              <div className="flex-1 bg-white flex items-center px-4">
                <div className="w-full border-t-[3px] border-dashed border-gray-200" />
              </div>

              {/* Right cutout */}
              <div className="w-4 relative overflow-hidden flex-shrink-0">
                <div className="absolute right-[-16px] top-0 w-8 h-8 rounded-full shadow-[0_0_0_40px_white]" />
              </div>
            </div>

            {/* --- BOTTOM TICKET HALF --- */}
            <div className="bg-white rounded-b-[16px] relative z-[1] pt-3 px-6 pb-6 space-y-5">

              {/* Date Box (Depart & Return) */}
              <div className="w-full flex flex-col sm:flex-row border border-gray-200 rounded-xl overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-gray-200">

                {/* Depart Date */}
                <button
                  onClick={() => { setShowDepartCal(true); setShowReturnCal(false); }}
                  className="flex-1 flex flex-col justify-center items-start px-4 py-2.5 hover:bg-[var(--color-info-bg)] transition-colors cursor-pointer text-left group"
                >
                  <p className="text-[12px] font-bold text-gray-400 tracking-widest mb-1 flex items-center gap-1">
                    Tanggal Berangkat
                  </p>
                  <div className="w-full flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[var(--color-text)] text-sm">{formatDateDisplay(departDate)}</div>
                    </div>
                    <Calendar size={22} className="text-gray-300 group-hover:text-[var(--color-primary)] transition-colors flex-shrink-0" />
                  </div>
                </button>

                {/* Return Date OR Add Return */}
                {tripType === "round-trip" ? (
                  <button
                    onClick={() => { setShowReturnCal(true); setShowDepartCal(false); }}
                    className="flex-1 flex flex-col justify-center items-start px-4 py-2.5 hover:bg-orange-50 transition-colors cursor-pointer text-left group"
                  >
                    <p className="text-[12px] font-bold text-gray-400 tracking-widest mb-1 flex items-center gap-1">
                      Tanggal Kembali
                    </p>
                    <div className="w-full flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[var(--color-text)] text-sm">
                          {returnDate ? formatDateDisplay(returnDate) : "Pilih tanggal"}
                        </div>
                      </div>
                      <Calendar size={22} className="text-gray-300 group-hover:text-[var(--color-accent)] transition-colors flex-shrink-0" />
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => { setTripType("round-trip"); setShowReturnCal(true); }}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--color-primary)] bg-gray-50/50 hover:bg-[var(--color-info-bg)] transition-colors cursor-pointer self-stretch"
                  >
                    <span className="text-xl leading-none font-light">+</span>
                    Tambah Kepulangan
                  </button>
                )}
              </div>

              {/* Passengers */}
              <div className="grid grid-cols-2 gap-4">
                {/* Dewasa */}
                <div>
                  <p className="text-[12px] font-bold text-gray-400 tracking-widest mb-1.5 flex items-center gap-1.5">
                    <User size={14} />
                    Dewasa
                  </p>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[46px]">
                    <button
                      onClick={() => setPassengers(p => {
                        const newP = Math.max(1, p - 1);
                        if (infants > newP) setInfants(newP); // Bayi tidak boleh melebihi dewasa
                        return newP;
                      })}
                      className="px-4 h-full text-lg font-bold text-[var(--color-primary)] bg-gray-300 hover:bg-gray-400 transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <div className="flex-1 text-center font-black text-xl text-[var(--color-text)]">
                      {passengers}
                    </div>
                    <button
                      onClick={() => setPassengers(p => Math.min(6, p + 1))}
                      className="px-4 h-full text-lg font-bold text-[var(--color-primary)] bg-gray-300 hover:bg-gray-400 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Bayi */}
                <div>
                  <div className="text-[12px] font-bold text-gray-400 tracking-widest mb-1.5 flex items-center gap-1.5 w-fit group/info relative cursor-help">
                    <Baby size={14} />
                    Bayi (&lt;3 th)
                    <Info size={11} className="ml-0.5 text-[var(--color-accent)]" />
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-40 bg-gray-800 text-white text-[10px] font-medium normal-case tracking-normal leading-tight rounded-md px-2.5 py-1.5 opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-10 text-center shadow-lg pointer-events-none">
                      Jumlah bayi tidak boleh &gt; dari jumlah dewasa
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-800" />
                    </div>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[46px]">
                    <button
                      onClick={() => setInfants(i => Math.max(0, i - 1))}
                      className="px-4 h-full text-lg font-bold text-[var(--color-primary)] bg-gray-300 hover:bg-gray-400 transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <div className="flex-1 text-center font-black text-xl text-[var(--color-text)]">
                      {infants}
                    </div>
                    <button
                      onClick={() => setInfants(i => Math.min(passengers, i + 1))} // Bayi tidak boleh melebihi dewasa
                      className="px-4 h-full text-lg font-bold text-[var(--color-primary)] bg-gray-300 hover:bg-gray-400 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Promo Code (collapsible) */}
              <div>
                <button
                  onClick={() => setPromoOpen(o => !o)}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                >
                  <Tag size={12} />
                  Kode Promo / Voucher
                  {promoOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {promoOpen && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Masukkan kode promo"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1 border-2 border-dashed border-[var(--color-accent)] rounded-xl px-4 py-2.5 text-sm font-bold tracking-widest text-[var(--color-accent)] placeholder:text-gray-300 placeholder:font-normal placeholder:tracking-normal outline-none bg-orange-50"
                    />
                    <button className="px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer flex-shrink-0">
                      Pakai
                    </button>
                  </div>
                )}
              </div>

              {/* Ticket bottom: CTA */}
              <div className="flex justify-start">
                <button
                  onClick={handleSearch}
                  disabled={!origin || !destination || !departDate}
                  className="w-fit px-5 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[var(--color-primary)]/25 cursor-pointer active:translate-y-0"
                >
                  <Search size={18} />
                  Cari Kereta
                </button>
              </div>

            </div>

            {/* Popular Routes */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Rute Populer</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_ROUTES.map(route => (
                  <button
                    key={route.label}
                    onClick={() => { setOrigin(route.from); setDestination(route.to); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${origin === route.from && destination === route.to
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                      }`}
                  >
                    <Train size={10} />
                    {route.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showDepartCal && (
        <PriceCalendar
          selectedDate={departDate}
          onSelect={date => {
            setDepartDate(date);
            // Reset return date if it's on same day or before new depart date
            if (returnDate && date >= returnDate) setReturnDate("");
          }}
          onClose={() => setShowDepartCal(false)}
        />
      )}
      {showReturnCal && (() => {
        // Minimum return date = departure date + 1 day
        // Use local date parts to avoid UTC timezone conversion bugs (Indonesia = UTC+7)
        const [y, mo, dd] = departDate.split("-").map(Number);
        const next = new Date(y, mo - 1, dd + 1); // local date arithmetic, safe from timezone shifts
        const minReturn = [
          next.getFullYear(),
          String(next.getMonth() + 1).padStart(2, "0"),
          String(next.getDate()).padStart(2, "0"),
        ].join("-");
        return (
          <PriceCalendar
            selectedDate={returnDate}
            minDate={minReturn}
            rangeStartDate={departDate}
            onSelect={date => { setReturnDate(date); }}
            onClose={() => setShowReturnCal(false)}
          />
        );
      })()}

      {/* Modals are kept here */}
    </MainLayout>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Memuat...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}
