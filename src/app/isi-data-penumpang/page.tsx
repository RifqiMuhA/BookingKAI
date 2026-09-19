"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { ChevronRight, ChevronUp, ChevronDown, ArrowRight, User, AlertCircle, Phone, Mail, CheckCircle2, X, AlertTriangle, Tag, UserCheck, Copy, Check } from "lucide-react";
import { TRAIN_SCHEDULES, formatPrice, getStationByCode } from "@/lib/mockData";
import { calculatePromoDiscount, getPromoByCode } from "@/lib/promosData";
import { useAuth } from "@/contexts/AuthContext";

const MOCK_REGIONS: Record<string, string[]> = {
  "DKI Jakarta": [
    "Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara"
  ],
  "Jawa Barat": [
    "Kota Bandung", "Kabupaten Bandung", "Kota Bogor", "Kabupaten Bogor", "Kota Depok", "Kota Bekasi"
  ],
  "Jawa Tengah": [
    "Kota Semarang", "Kota Surakarta (Solo)", "Kabupaten Banyumas", "Kota Magelang"
  ],
  "Jawa Timur": [
    "Kota Surabaya", "Kota Malang", "Kabupaten Sidoarjo", "Kabupaten Gresik", "Kota Madiun"
  ],
  "Banten": [
    "Kota Tangerang", "Kota Tangerang Selatan", "Kabupaten Serang"
  ],
  "DI Yogyakarta": [
    "Kota Yogyakarta", "Kabupaten Sleman", "Kabupaten Bantul"
  ],
  "Sumatera Utara": [
    "Kota Medan", "Kabupaten Deli Serdang", "Kota Pematangsiantar"
  ],
  "Bali": [
    "Kota Denpasar", "Kabupaten Badung", "Kabupaten Gianyar"
  ]
};

function IsiDataContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, user } = useAuth();

  const trainId = searchParams.get("trainId") || "";
  const returnTrainId = searchParams.get("returnTrainId") || "";
  const passengersCount = parseInt(searchParams.get("passengers") || "1", 10);
  const infantsCount = parseInt(searchParams.get("infants") || "0", 10);
  const promoParam = searchParams.get("promo") || "";

  // Form State
  const [booker, setBooker] = useState({ 
    idType: "KTP", 
    idNumber: "", 
    name: "", 
    email: "", 
    phone: "",
    province: "",
    city: ""
  });
  const [showProvSearch, setShowProvSearch] = useState(false);
  const [provSearchTerm, setProvSearchTerm] = useState("");
  const provDropdownRef = useRef<HTMLDivElement>(null);
  
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const [agreed, setAgreed] = useState(false);

  // Popover State untuk Pilih KTP Tersimpan di Kartu Penumpang
  const [activePassengerPopover, setActivePassengerPopover] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close passenger popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setActivePassengerPopover(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Daftar KTP Penumpang yang Tersimpan di Akun KAI
  const savedAccountPassengers = [
    {
      id: "self",
      name: user?.name ? user.name.toUpperCase() : "RIFQI MUHADZIB AHDAN",
      idType: "KTP",
      idNumber: "3271022804980003",
      title: "Tuan",
      label: "Akun Saya",
    },
    {
      id: "family-1",
      name: "SITI RAHMAH",
      idType: "KTP",
      idNumber: "3271035506990001",
      title: "Nyonya",
      label: "Keluarga",
    },
    {
      id: "friend-1",
      name: "BUDI SANTOSO",
      idType: "KTP",
      idNumber: "3271041208950002",
      title: "Tuan",
      label: "Rekan Perjalanan",
    },
  ];

  // Auto-fill data pemesan jika pengguna sudah login
  useEffect(() => {
    if (isLoggedIn && user) {
      setBooker((prev) => {
        if (!prev.name && !prev.idNumber) {
          return {
            idType: "KTP",
            idNumber: "3271022804980003",
            name: user.name.toUpperCase(),
            email: user.email,
            phone: "081298765432",
            province: "DKI Jakarta",
            city: "Jakarta Pusat",
          };
        }
        return prev;
      });
    }
  }, [isLoggedIn, user]);

  const handleSelectSavedPassenger = (passengerIndex: number, saved: typeof savedAccountPassengers[0]) => {
    updatePassenger(passengerIndex, "title", saved.title);
    updatePassenger(passengerIndex, "name", saved.name);
    updatePassenger(passengerIndex, "idType", saved.idType);
    updatePassenger(passengerIndex, "idNumber", saved.idNumber);
    setActivePassengerPopover(null);
  };

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (provDropdownRef.current && !provDropdownRef.current.contains(event.target as Node)) {
        setShowProvSearch(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCitySearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Initialize passengers array (Adults + Infants)
  const initialPassengers = [
    ...Array.from({ length: passengersCount }).map((_, i) => ({
      id: `p${i+1}`,
      title: "Tuan",
      name: "",
      idType: "KTP",
      idNumber: "",
      type: "Dewasa"
    })),
    ...Array.from({ length: infantsCount }).map((_, i) => ({
      id: `inf${i+1}`,
      title: "Tuan",
      name: "",
      idType: "KIA / NIK",
      idNumber: "",
      type: "Bayi"
    }))
  ];
  const [passengers, setPassengers] = useState(initialPassengers);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Buka modal konfirmasi terlebih dahulu
    setShowConfirmModal(true);
  };

  const handleConfirmContinue = () => {
    // Save to sessionStorage
    sessionStorage.setItem("booking_booker", JSON.stringify(booker));
    sessionStorage.setItem("booking_passengers", JSON.stringify(passengers));
    
    // Navigate to Pilih Kursi
    const params = new URLSearchParams();
    if (trainId) params.append("trainId", trainId);
    if (returnTrainId) params.append("returnTrainId", returnTrainId);
    params.append("passengers", String(passengersCount));
    params.append("infants", String(infantsCount));
    if (promoParam) params.append("promo", promoParam);
    if (paramOrigin) params.append("origin", paramOrigin);
    if (paramDestination) params.append("destination", paramDestination);
    const departDateParam = searchParams.get("departDate") || searchParams.get("date");
    if (departDateParam) params.append("departDate", departDateParam);
    const returnDateParam = searchParams.get("returnDate");
    if (returnDateParam) params.append("returnDate", returnDateParam);
    
    router.push(`/pilih-kursi?${params.toString()}`);
  };

  const [isSameAsBooker, setIsSameAsBooker] = useState(false);

  const handleToggleSameAsBooker = () => {
    if (!isSameAsBooker) {
      setIsSameAsBooker(true);
      setPassengers((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          name: booker.name || updated[0].name,
          idType: booker.idType || updated[0].idType,
          idNumber: booker.idNumber || updated[0].idNumber,
        };
        return updated;
      });
    } else {
      setIsSameAsBooker(false);
      setPassengers((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          name: "",
          idNumber: "",
        };
        return updated;
      });
    }
  };

  // Otomatis sinkronkan Penumpang 1 jika isSameAsBooker aktif dan data pemesan diperbarui
  useEffect(() => {
    if (isSameAsBooker) {
      setPassengers((prev) => {
        if (prev.length === 0) return prev;
        if (
          prev[0].name === booker.name &&
          prev[0].idType === booker.idType &&
          prev[0].idNumber === booker.idNumber
        ) {
          return prev;
        }
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          name: booker.name,
          idType: booker.idType,
          idNumber: booker.idNumber,
        };
        return updated;
      });
    }
  }, [booker.name, booker.idType, booker.idNumber, isSameAsBooker]);

  const updatePassenger = (index: number, field: string, value: string) => {
    if (index === 0 && isSameAsBooker && (field === "name" || field === "idNumber")) {
      if (value !== booker[field as keyof typeof booker]) {
        setIsSameAsBooker(false);
      }
    }
    const newP = [...passengers];
    newP[index] = { ...newP[index], [field]: value };
    setPassengers(newP);
  };

  // Find train details for summary
  const trainParts = trainId.split("-");
  const baseTrainId = trainParts[0];
  const trainClass = trainParts[1] === "EKO" ? "Ekonomi" : trainParts[1] === "BIS" ? "Bisnis" : "Eksekutif";
  const trainData = TRAIN_SCHEDULES.find(t => t.id === baseTrainId);

  // Return train details (if round-trip)
  const returnParts = returnTrainId.split("-");
  const baseReturnId = returnParts[0];
  const returnClass = returnParts[1] === "EKO" ? "Ekonomi" : returnParts[1] === "BIS" ? "Bisnis" : "Eksekutif";
  const returnTrainData = returnTrainId ? TRAIN_SCHEDULES.find(t => t.id === baseReturnId) : null;

  // Route stations from searchParams or trainData
  const paramOrigin = searchParams.get("origin") || "";
  const paramDestination = searchParams.get("destination") || "";

  // Outbound stations
  const outboundOriginCode = paramOrigin || trainData?.origin || "";
  const outboundDestCode = paramDestination || trainData?.destination || "";

  // Return stations (ALWAYS swapped from outbound)
  const returnOriginCode = outboundDestCode;
  const returnDestCode = outboundOriginCode;

  const outboundPrice = trainData
    ? (trainClass === "Ekonomi" ? trainData.price * 0.4 : trainClass === "Bisnis" ? trainData.price * 0.7 : trainData.price)
    : 0;

  const returnPrice = returnTrainData
    ? (returnClass === "Ekonomi" ? returnTrainData.price * 0.4 : returnClass === "Bisnis" ? returnTrainData.price * 0.7 : returnTrainData.price)
    : 0;

  const subtotalBeforeDiscount = (outboundPrice + returnPrice) * passengersCount;
  const promoResult = calculatePromoDiscount(subtotalBeforeDiscount, promoParam, outboundOriginCode, outboundDestCode);
  const discountAmount = promoResult.discountAmount;
  const totalPrice = promoResult.finalPrice;
  const activePromo = promoResult.promo;

  const renderOrderDetails = () => (
    <div className="space-y-4 divide-y divide-gray-100">
      {/* Outbound Leg */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
            <svg
              width="20"
              height="14"
              viewBox="0 0 24 16"
              fill="currentColor"
              className="text-gray-900 flex-shrink-0"
            >
              <path d="M1 11h18c2.2 0 4-1.8 4-4s-1.8-4-4-4H4L1 11z" />
              <path
                d="M6 5h3v3H6V5zm5 0h3v3h-3V5zm5 0h2.5c.8 0 1.5.4 1.9 1.1L21 7h-5V5z"
                fill="white"
              />
              <circle cx="5" cy="13.5" r="1.5" />
              <circle cx="11" cy="13.5" r="1.5" />
              <circle cx="17" cy="13.5" r="1.5" />
            </svg>
            <span>Keberangkatan</span>
          </div>
        </div>

        {trainData ? (
          <div className="space-y-3">
            <div className="text-sm font-bold text-gray-900">
              {trainData.name}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{passengersCount} x Dewasa</span>
              <span className="font-bold text-sm text-gray-900">
                {formatPrice(outboundPrice * passengersCount)}
              </span>
            </div>

            {infantsCount > 0 && (
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{infantsCount} x Bayi (Dipangku)</span>
                <span className="font-bold text-xs text-emerald-600">
                  Gratis (Rp0)
                </span>
              </div>
            )}

            <div className="border-t border-gray-100 pt-3">
              <div className="relative pl-5">
                <div className="absolute left-[3px] top-[7px] bottom-[7px] w-[2px] bg-gray-300" />

                <div className="relative mb-3">
                  <div className="absolute -left-[20px] top-[4px] w-[8px] h-[8px] rounded-full border-2 border-gray-800 bg-white" />
                  <div className="font-bold text-xs sm:text-sm text-gray-900 leading-none">
                    {trainData.departureTime} -{" "}
                    {getStationByCode(outboundOriginCode)?.name ||
                      outboundOriginCode}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 my-2">
                  <span>({trainData.duration || "2j 45m"})</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                      trainClass === "Eksekutif"
                        ? "bg-orange-50 text-[var(--color-accent)] border border-orange-200"
                        : trainClass === "Bisnis"
                          ? "bg-blue-50 text-[var(--color-primary)] border border-blue-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {trainClass}
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute -left-[20px] top-[4px] w-[8px] h-[8px] rounded-full border-2 border-gray-800 bg-white" />
                  <span className="font-bold text-xs sm:text-sm text-gray-900 leading-none">
                    {trainData.arrivalTime} -{" "}
                    {getStationByCode(outboundDestCode)?.name ||
                      outboundDestCode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-400">
            Data kereta tidak tersedia.
          </div>
        )}
      </div>

      {/* Return Leg (if round-trip) */}
      {returnTrainData && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
              <svg
                width="20"
                height="14"
                viewBox="0 0 24 16"
                fill="currentColor"
                className="text-gray-900 flex-shrink-0 -scale-x-100"
              >
                <path d="M1 11h18c2.2 0 4-1.8 4-4s-1.8-4-4-4H4L1 11z" />
                <path
                  d="M6 5h3v3H6V5zm5 0h3v3h-3V5zm5 0h2.5c.8 0 1.5.4 1.9 1.1L21 7h-5V5z"
                  fill="white"
                />
                <circle cx="5" cy="13.5" r="1.5" />
                <circle cx="11" cy="13.5" r="1.5" />
                <circle cx="17" cy="13.5" r="1.5" />
              </svg>
              <span>Kepulangan</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-bold text-gray-900">
              {returnTrainData.name}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{passengersCount} x Dewasa</span>
              <span className="font-bold text-sm text-gray-900">
                {formatPrice(returnPrice * passengersCount)}
              </span>
            </div>

            {infantsCount > 0 && (
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{infantsCount} x Bayi (Dipangku)</span>
                <span className="font-bold text-xs text-emerald-600">
                  Gratis (Rp0)
                </span>
              </div>
            )}

            <div className="border-t border-gray-100 pt-3">
              <div className="relative pl-5">
                <div className="absolute left-[3px] top-[7px] bottom-[7px] w-[2px] bg-gray-300" />

                <div className="relative mb-3">
                  <div className="absolute -left-[20px] top-[4px] w-[8px] h-[8px] rounded-full border-2 border-gray-800 bg-white" />
                  <div className="font-bold text-xs sm:text-sm text-gray-900 leading-none">
                    {returnTrainData.departureTime} -{" "}
                    {getStationByCode(returnOriginCode)?.name ||
                      returnOriginCode}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 my-2">
                  <span>
                    ({returnTrainData.duration || "2j 45m"})
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                      returnClass === "Eksekutif"
                        ? "bg-orange-50 text-[var(--color-accent)] border border-orange-200"
                        : returnClass === "Bisnis"
                          ? "bg-blue-50 text-[var(--color-primary)] border border-blue-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {returnClass}
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute -left-[20px] top-[4px] w-[8px] h-[8px] rounded-full border-2 border-gray-800 bg-white" />
                  <span className="font-bold text-xs sm:text-sm text-gray-900 leading-none">
                    {returnTrainData.arrivalTime} -{" "}
                    {getStationByCode(returnDestCode)?.name ||
                      returnDestCode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Baris Diskon Promo Jika Aktif */}
      {discountAmount > 0 && activePromo && (
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold text-emerald-700">
            <Tag size={13} className="text-[#F58220]" />
            <span>Diskon Promo ({activePromo.code})</span>
          </span>
          <span className="font-black text-emerald-600">
            - {formatPrice(discountAmount)}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-muted)] pb-32 pt-[88px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6 whitespace-nowrap overflow-x-auto hide-scrollbar">
          <span
            className="font-bold text-[var(--color-primary-dark)] cursor-pointer hover:underline flex-shrink-0 inline-flex items-center gap-1.5"
            onClick={() => router.push("/")}
          >
            <CheckCircle2 size={14} strokeWidth={2.5} className="text-emerald-600 flex-shrink-0" />
            <span>Pencarian</span>
          </span>
          <ChevronRight
            size={14}
            className="text-gray-400 flex-shrink-0"
            strokeWidth={2}
          />
          <span
            className="font-bold text-[var(--color-primary-dark)] cursor-pointer hover:underline flex-shrink-0 inline-flex items-center gap-1.5"
            onClick={() => router.back()}
          >
            <CheckCircle2 size={14} strokeWidth={2.5} className="text-emerald-600 flex-shrink-0" />
            <span>Pilih Kereta</span>
          </span>
          <ChevronRight
            size={14}
            className="text-gray-400 flex-shrink-0"
            strokeWidth={2}
          />
          <span className="font-medium text-gray-500 flex-shrink-0">
            Isi Data Penumpang
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 pb-28 lg:pb-0">
          {/* Form Area */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-6">
              Isi Data Pemesan & Penumpang
            </h1>

            <form id="passenger-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-[#E8F0FE] p-5 rounded-md flex gap-4 text-[var(--color-primary-dark)] border border-[#D2E3FC]">
                <AlertCircle
                  size={24}
                  className="flex-shrink-0 mt-0.5 text-[var(--color-primary)]"
                />
                <p className="text-sm font-medium leading-relaxed">
                  Pastikan data yang Anda isi sudah benar. Tiket tidak dapat
                  dibatalkan jika data tidak sesuai dengan kartu identitas asli
                  saat boarding.
                </p>
              </div>

              {/* Data Pemesan */}
              <div className="bg-white rounded-md shadow-md border border-gray-200 relative z-30">
                <div className="bg-[var(--color-primary-dark)] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white rounded-t-md">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-white/80" />
                    <h2 className="font-bold text-lg tracking-wide">
                      Data Pemesan
                    </h2>
                  </div>
                  {isLoggedIn ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 rounded text-xs font-bold self-start sm:self-auto">
                      <CheckCircle2 size={13} className="text-emerald-300 shrink-0" />
                      <span>Auto-fill dari Akun KAI (KTP Terverifikasi)</span>
                    </div>
                  ) : null}
                </div>
                <div className="p-6 md:p-8 space-y-5">
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full sm:w-1/3">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Tipe ID <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={booker.idType}
                          onChange={(e) =>
                            setBooker({ ...booker, idType: e.target.value })
                          }
                          className="w-full pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-sm outline-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all font-medium text-black cursor-pointer appearance-none"
                        >
                          <option value="KTP">KTP</option>
                          <option value="Paspor">Paspor</option>
                        </select>
                        <ChevronDown
                          size={18}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Nomor Identitas <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={booker.idNumber}
                        onChange={(e) => {
                          const val = e.target.value;
                          const matched = savedAccountPassengers.find((s) => s.idNumber === val.trim());
                          if (matched && !booker.name) {
                            setBooker({ ...booker, idNumber: val, name: matched.name });
                          } else {
                            setBooker({ ...booker, idNumber: val });
                          }
                        }}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm outline-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all font-medium text-black placeholder:font-normal"
                        placeholder="NIK / No Paspor"
                      />
                      {savedAccountPassengers.some((s) => s.idNumber === booker.idNumber.trim()) && (
                        <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                          <span>KTP Akun Terdaftar & Terverifikasi</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={booker.name}
                      onChange={(e) =>
                        setBooker({ ...booker, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm outline-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all font-medium text-black placeholder:font-normal"
                      placeholder="Sesuai KTP/Paspor"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          required
                          type="email"
                          value={booker.email}
                          onChange={(e) =>
                            setBooker({ ...booker, email: e.target.value })
                          }
                          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-sm outline-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all font-medium text-black placeholder:font-normal"
                          placeholder="email@contoh.com"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Nomor Telepon <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          required
                          type="tel"
                          value={booker.phone}
                          onChange={(e) =>
                            setBooker({ ...booker, phone: e.target.value })
                          }
                          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-sm outline-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all font-medium text-black placeholder:font-normal"
                          placeholder="081234567890"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Provinsi <span className="text-red-500">*</span>
                      </label>
                      <div
                        className={`relative ${showProvSearch ? "z-50" : "z-20"}`}
                        ref={provDropdownRef}
                      >
                        <div
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm outline-none cursor-pointer flex items-center justify-between"
                          onClick={() => {
                            setShowProvSearch(!showProvSearch);
                            setShowCitySearch(false);
                          }}
                        >
                          <span
                            className={
                              booker.province
                                ? "text-black font-medium"
                                : "text-gray-400"
                            }
                          >
                            {booker.province || "Pilih Provinsi..."}
                          </span>
                          <ChevronDown
                            size={18}
                            className={`text-gray-400 transition-transform ${showProvSearch ? "rotate-180" : ""}`}
                          />
                        </div>

                        {showProvSearch && (
                          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-2xl max-h-60 overflow-y-auto">
                            <div className="sticky top-0 bg-white p-2 border-b border-gray-100 shadow-sm">
                              <input
                                type="text"
                                autoFocus
                                placeholder="Cari Provinsi..."
                                value={provSearchTerm}
                                onChange={(e) =>
                                  setProvSearchTerm(e.target.value)
                                }
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-sm outline-none focus:border-[var(--color-primary)] text-sm"
                              />
                            </div>
                            {Object.keys(MOCK_REGIONS).filter((p) =>
                              p
                                .toLowerCase()
                                .includes(provSearchTerm.toLowerCase()),
                            ).length > 0 ? (
                              Object.keys(MOCK_REGIONS)
                                .filter((p) =>
                                  p
                                    .toLowerCase()
                                    .includes(provSearchTerm.toLowerCase()),
                                )
                                .map((prov) => (
                                  <div
                                    key={prov}
                                    onClick={() => {
                                      setBooker({
                                        ...booker,
                                        province: prov,
                                        city: "",
                                      }); // reset city when province changes
                                      setShowProvSearch(false);
                                      setProvSearchTerm("");
                                    }}
                                    className="px-4 py-3 hover:bg-[var(--color-info-bg)] cursor-pointer text-sm text-gray-700 font-medium"
                                  >
                                    {prov}
                                  </div>
                                ))
                            ) : (
                              <div className="px-4 py-4 text-center text-sm text-gray-500">
                                Provinsi tidak ditemukan
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Kota / Kabupaten <span className="text-red-500">*</span>
                      </label>
                      <div
                        className={`relative ${showCitySearch ? "z-50" : "z-20"}`}
                        ref={cityDropdownRef}
                      >
                        <div
                          className={`w-full px-4 py-3 border border-gray-300 rounded-sm outline-none flex items-center justify-between ${!booker.province ? "bg-gray-100 cursor-not-allowed opacity-70" : "bg-white cursor-pointer"}`}
                          onClick={() => {
                            if (booker.province) {
                              setShowCitySearch(!showCitySearch);
                              setShowProvSearch(false);
                            }
                          }}
                        >
                          <span
                            className={
                              booker.city
                                ? "text-black font-medium"
                                : "text-gray-400"
                            }
                          >
                            {booker.city || "Pilih Kota..."}
                          </span>
                          <ChevronDown
                            size={18}
                            className={`text-gray-400 transition-transform ${showCitySearch ? "rotate-180" : ""}`}
                          />
                        </div>

                        {showCitySearch && booker.province && (
                          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-2xl max-h-60 overflow-y-auto">
                            <div className="sticky top-0 bg-white p-2 border-b border-gray-100 shadow-sm">
                              <input
                                type="text"
                                autoFocus
                                placeholder="Cari Kota..."
                                value={citySearchTerm}
                                onChange={(e) =>
                                  setCitySearchTerm(e.target.value)
                                }
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-sm outline-none focus:border-[var(--color-primary)] text-sm"
                              />
                            </div>
                            {MOCK_REGIONS[booker.province].filter((c) =>
                              c
                                .toLowerCase()
                                .includes(citySearchTerm.toLowerCase()),
                            ).length > 0 ? (
                              MOCK_REGIONS[booker.province]
                                .filter((c) =>
                                  c
                                    .toLowerCase()
                                    .includes(citySearchTerm.toLowerCase()),
                                )
                                .map((city) => (
                                  <div
                                    key={city}
                                    onClick={() => {
                                      setBooker({ ...booker, city });
                                      setShowCitySearch(false);
                                      setCitySearchTerm("");
                                    }}
                                    className="px-4 py-3 hover:bg-[var(--color-info-bg)] cursor-pointer text-sm text-gray-700 font-medium"
                                  >
                                    {city}
                                  </div>
                                ))
                            ) : (
                              <div className="px-4 py-4 text-center text-sm text-gray-500">
                                Kota tidak ditemukan
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Penumpang Header & Tombol Di Atas Penumpang 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 pb-1">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Data Penumpang
                </h2>

                <button
                  type="button"
                  onClick={handleToggleSameAsBooker}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer shadow-2xs self-start sm:self-auto ${
                    isSameAsBooker
                      ? "bg-[#003C71] text-white border border-[#003C71] hover:bg-[#002B52]"
                      : "bg-white hover:bg-gray-50 text-[#003C71] border border-gray-300 hover:border-[#003C71]"
                  }`}
                >
                  {isSameAsBooker ? (
                    <>
                      <Check size={13} strokeWidth={3} className="text-white" />
                      <span>KTP Pemesan Terpasang (P1)</span>
                    </>
                  ) : (
                    <>
                      <UserCheck size={14} className="text-[#003C71]" />
                      <span>Gunakan KTP Pemesan (Penumpang 1)</span>
                    </>
                  )}
                </button>
              </div>

              {passengers.map((p, idx) => (
                <div
                  key={p.id}
                  className="bg-white rounded-md shadow-md border border-gray-200 overflow-hidden relative"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-accent)]"></div>
                  <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between ml-1 relative">
                    <h2 className="font-extrabold text-lg text-[var(--color-primary-dark)] flex items-center gap-2">
                      Penumpang {idx + 1}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                          p.type === "Bayi"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-[var(--color-info-bg)] text-[var(--color-primary)]"
                        }`}
                      >
                        {p.type}
                      </span>
                    </h2>

                    {/* Tombol Pilih dari KTP Tersimpan di Akun */}
                    {p.type !== "Bayi" && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActivePassengerPopover(activePassengerPopover === idx ? null : idx)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold text-[#003C71] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                        >
                          <UserCheck size={13} />
                          <span>Pilih KTP Tersimpan</span>
                          <ChevronDown size={13} className={activePassengerPopover === idx ? "rotate-180 transition-transform" : "transition-transform"} />
                        </button>

                        {/* Dropdown Popover KTP Tersimpan */}
                        {activePassengerPopover === idx && (
                          <div 
                            ref={popoverRef}
                            className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-md shadow-2xl border border-gray-200 z-50 p-2 animate-in fade-in zoom-in-95 duration-150"
                          >
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-2 py-1 border-b border-gray-100 mb-1">
                              Daftar KTP di Akun KAI
                            </p>
                            <div className="space-y-1">
                              {savedAccountPassengers.map((saved) => (
                                <button
                                  key={saved.id}
                                  type="button"
                                  onClick={() => handleSelectSavedPassenger(idx, saved)}
                                  className="w-full text-left p-2 rounded hover:bg-blue-50/70 transition-colors cursor-pointer group flex flex-col"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-900 group-hover:text-[#003C71]">
                                      {saved.name}
                                    </span>
                                    <span className="text-[10px] font-medium text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                                      {saved.label}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-gray-500 font-mono mt-0.5">
                                    {saved.idType}: {saved.idNumber}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {p.type === "Bayi" && (
                    <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 flex-shrink-0 text-amber-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Penumpang bayi (&lt; 3 tahun) tidak mendapatkan kursi
                        sendiri (dipangku oleh penumpang dewasa). Tiket bayi Rp0
                        (Gratis).
                      </span>
                    </div>
                  )}
                  <div className="p-6 md:p-8 space-y-5 ml-1">
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="w-full sm:w-1/3">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Titel <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={p.title}
                            onChange={(e) =>
                              updatePassenger(idx, "title", e.target.value)
                            }
                            className="w-full pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-sm outline-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all font-medium text-black cursor-pointer appearance-none"
                          >
                            <option value="Tuan">Tuan</option>
                            <option value="Nyonya">Nyonya</option>
                            <option value="Nona">Nona</option>
                          </select>
                          <ChevronDown
                            size={18}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          value={p.name}
                          onChange={(e) =>
                            updatePassenger(idx, "name", e.target.value)
                          }
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm outline-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all font-medium text-black placeholder:font-normal"
                          placeholder={
                            p.type === "Bayi"
                              ? "Sesuai KIA / Akta / Paspor"
                              : "Sesuai KTP/Paspor"
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="w-full sm:w-1/3">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Tipe ID <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={p.idType}
                            onChange={(e) =>
                              updatePassenger(idx, "idType", e.target.value)
                            }
                            className="w-full pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-sm outline-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all font-medium text-black cursor-pointer appearance-none"
                          >
                            {p.type === "Bayi" ? (
                              <>
                                <option value="KIA / NIK">KIA / NIK</option>
                                <option value="Akta Kelahiran">
                                  Akta Kelahiran
                                </option>
                                <option value="Paspor">Paspor</option>
                              </>
                            ) : (
                              <>
                                <option value="KTP">KTP</option>
                                <option value="Paspor">Paspor</option>
                              </>
                            )}
                          </select>
                          <ChevronDown
                            size={18}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Nomor Identitas{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          value={p.idNumber}
                          onChange={(e) => {
                            const val = e.target.value;
                            const matched = savedAccountPassengers.find((s) => s.idNumber === val.trim());
                            if (matched && !p.name) {
                              updatePassenger(idx, "idNumber", val);
                              updatePassenger(idx, "name", matched.name);
                              updatePassenger(idx, "title", matched.title);
                            } else {
                              updatePassenger(idx, "idNumber", val);
                            }
                          }}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm outline-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all font-medium text-black placeholder:font-normal"
                          placeholder={
                            p.type === "Bayi"
                              ? "No. KIA / NIK / No. Akta"
                              : "NIK / No. Paspor"
                          }
                        />
                        {savedAccountPassengers.some((s) => s.idNumber === p.idNumber.trim()) && (
                          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                            <span>KTP Akun Terdaftar & Terverifikasi</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Ketentuan Reservasi */}
              <div className="mt-8">
                <h3 className="text-[#D32F2F] font-bold text-lg mb-3">
                  Ketentuan Reservasi Tiket Kereta Api
                </h3>
                <div className="border border-[#F2994A] rounded-md p-6 bg-white shadow-sm mb-5">
                  <ol className="list-decimal list-outside ml-4 space-y-2 text-gray-700 text-sm md:text-base leading-relaxed">
                    <li>
                      Reservasi dapat dilakukan hingga 30 menit sebelum kereta
                      berangkat.
                    </li>
                    <li>
                      Harga dan ketersediaan tempat duduk sewaktu-waktu dapat
                      berubah.
                    </li>
                    <li>
                      Pastikan anda telah menerima email konfirmasi pembayaran
                      dari PT. Kereta Api Indonesia (Persero) untuk ditukarkan
                      dengan boarding pass di stasiun online.
                    </li>
                  </ol>
                </div>
              </div>

              {/* Checkout Block */}
              <div className="bg-[var(--color-primary-dark)] text-white p-6 md:p-8 rounded-md mt-8">
                <div className="space-y-5 mb-8">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-1">
                      <input
                        type="checkbox"
                        required
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="peer appearance-none w-5 h-5 border-2 border-white/60 rounded bg-transparent checked:bg-white checked:border-white transition-colors cursor-pointer"
                      />
                      <svg
                        className="absolute w-3 h-3 text-[var(--color-primary-dark)] opacity-0 peer-checked:opacity-100 pointer-events-none"
                        viewBox="0 0 14 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 5L5 9L13 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white font-bold text-sm md:text-base leading-relaxed">
                      Dengan ini saya setuju dan mematuhi{" "}
                      <a href="#" className="underline hover:text-gray-200">
                        Syarat dan Ketentuan KAI
                      </a>
                      .
                    </span>
                  </label>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                  <div className="text-xs text-white/60 max-w-lg hidden md:block">
                    Untuk informasi lebih lanjut mengenai penggunaan data Anda,
                    silakan baca{" "}
                    <a href="#" className="underline hover:text-white">
                      Kebijakan Privasi
                    </a>{" "}
                    kami.
                  </div>

                  <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-white/80 font-medium text-lg">
                        Total
                      </span>
                      <span className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <button
                      type="submit"
                      disabled={!agreed || !booker.city}
                      className="w-full md:w-auto px-10 py-4 text-white font-extrabold rounded-md transition-all text-lg bg-[var(--color-accent)] hover:bg-[#E07015] cursor-pointer disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Lanjutkan Pilih Kursi
                    </button>
                  </div>
                </div>

                <div className="text-xs text-white/60 mt-6 md:hidden">
                  Untuk informasi lebih lanjut mengenai penggunaan data Anda,
                  silakan baca{" "}
                  <a href="#" className="underline hover:text-white">
                    Kebijakan Privasi
                  </a>{" "}
                  kami.
                </div>
              </div>
            </form>
          </div>

          {/* DESKTOP: Rincian Pemesanan Sidebar (hidden on mobile) */}
          <div className="hidden lg:block w-80 flex-shrink-0 self-start sticky top-[104px]">
            <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              {/* Top Navy Header: Order Summary */}
              <div className="bg-[var(--color-primary-dark)] text-white p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs text-blue-200">
                    <span className="font-bold uppercase tracking-wider text-[11px]">
                      Rincian Pesanan
                    </span>
                    <span className="font-medium text-white/80">
                      {passengersCount} Dewasa
                      {infantsCount > 0 ? `, ${infantsCount} Bayi` : ""}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-white/10 pt-2">
                    <span className="text-xs text-white/80 font-medium">
                      Total Pembayaran
                    </span>
                    <div className="flex flex-col items-end">
                      {discountAmount > 0 && (
                        <span className="text-xs text-white/60 line-through font-normal">
                          {formatPrice(subtotalBeforeDiscount)}
                        </span>
                      )}
                      <span className={`font-black text-xl tracking-tight whitespace-nowrap ${discountAmount > 0 ? "text-[#F58220]" : "text-white"}`}>
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unified Body: Outbound & Return Legs */}
              <div className="p-4">
                {renderOrderDetails()}
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
                <span>{isMobileSummaryOpen ? "Tutup Rincian Pesanan" : "Lihat Rincian Pesanan"}</span>
                {isMobileSummaryOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </div>
              <div className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-[var(--color-primary)] border border-blue-200">
                {passengersCount} Dewasa{infantsCount > 0 ? `, ${infantsCount} Bayi` : ""}
              </div>
            </div>
          </button>

          {/* Expanded Scrollable Body */}
          {isMobileSummaryOpen && (
            <div className="overflow-y-auto px-4 py-3 flex-1 min-h-0 bg-white">
              {renderOrderDetails()}
            </div>
          )}

          {/* Fixed bottom action bar on mobile */}
          <div className="p-3.5 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-medium text-gray-500">Total Pembayaran</span>
              <div className="flex items-baseline gap-1.5">
                {discountAmount > 0 && (
                  <span className="text-xs text-gray-400 line-through font-medium">
                    {formatPrice(subtotalBeforeDiscount)}
                  </span>
                )}
                <span className={`font-black text-lg ${discountAmount > 0 ? "text-[#F58220]" : "text-[var(--color-text)]"}`}>
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              form="passenger-form"
              disabled={!agreed || !booker.city}
              className={`w-full py-3.5 rounded-md font-bold text-base transition-colors flex justify-center items-center gap-2 ${
                !agreed || !booker.city
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[var(--color-accent)] hover:bg-[#E07015] text-white cursor-pointer shadow-sm"
              }`}
            >
              <span>Lanjutkan Pilih Kursi</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Data Sebelum Pilih Kursi */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-md shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[var(--color-primary-dark)] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h3 className="font-bold text-xl">Konfirmasi Data Penumpang</h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-white/80 hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-gray-700">
              {/* Ringkasan Singkat Pemesan */}
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50/70">
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Data Pemesan
                </div>
                <div className="font-bold text-gray-900 text-lg">
                  {booker.name || "-"}
                </div>
                <div className="text-sm text-gray-600 mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                  <span>{booker.email}</span>
                  <span>•</span>
                  <span>{booker.phone}</span>
                </div>
              </div>

              {/* Ringkasan Penumpang */}
              <div className="space-y-3">
                <div className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                y
                  Daftar Penumpang ({passengers.length} Orang)
                </div>
                <div className="space-y-2.5">
                  {passengers.map((p, i) => (
                    <div
                      key={p.id}
                      className="border border-gray-200 rounded-md p-3.5 bg-white flex items-center justify-between shadow-xs"
                    >
                      <div>
                        <div className="font-bold text-gray-900 text-base md:text-lg">
                          {i + 1}. {p.title}.{" "}
                          {p.name || (
                            <span className="text-red-500 font-normal italic">
                              Belum diisi
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {p.idType}:{" "}
                          <span className="font-mono text-gray-900">
                            {p.idNumber || (
                              <span className="text-red-500 font-normal italic">
                                Belum diisi
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider ${
                          p.type === "Bayi"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-blue-50 text-[var(--color-primary)] border border-blue-200"
                        }`}
                      >
                        {p.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pertanyaan Konfirmasi dengan Maskot Bingung */}
              <div className="flex items-center gap-4 p-4 bg-amber-50/70 border border-amber-200 rounded-lg">
                <Image
                  src="/Maskot/maskot_bingung.webp"
                  alt="Maskot Konfirmasi"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain flex-shrink-0"
                />
                <div className="text-base md:text-lg text-[#E07015] leading-snug">
                  Apakah Anda yakin data di atas sudah benar dan siap
                  melanjutkan ke pemilihan kursi?
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-md border border-gray-300 text-gray-700 font-bold text-base hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Periksa Kembali
              </button>
              <button
                type="button"
                onClick={handleConfirmContinue}
                className="w-full sm:w-auto px-7 py-3 rounded-md bg-[var(--color-accent)] hover:bg-[#E07015] text-white font-bold text-base transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                <span>Ya, Data Sudah Benar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IsiDataPenumpang() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <IsiDataContent />
      </Suspense>
    </MainLayout>
  );
}
