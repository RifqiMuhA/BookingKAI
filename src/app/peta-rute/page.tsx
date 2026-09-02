"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { STATIONS, Station } from "@/lib/mockData";
import { ArrowLeft, Search, MapPin, Navigation, HelpCircle, X, Menu, ArrowDownUp } from "lucide-react";
import StationInfoPanel from "@/components/map/StationInfoPanel";

// Dynamic import for Leaflet to prevent SSR window is not defined error
const RouteMap = dynamic(() => import("@/components/map/RouteMap"), { ssr: false });

function PetaRuteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL params
  const initialOrigin = searchParams.get("origin") || "";
  const initialDest = searchParams.get("dest") || "";

  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDest);
  const [showGuide, setShowGuide] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState<'origin' | 'destination' | null>(null);

  const originStation = STATIONS.find(s => s.code === origin);
  const destStation = STATIONS.find(s => s.code === destination);

  const handleSetOrigin = (code: string) => {
    setOrigin(code);
    if (code === destination) setDestination("");
    setExpandedInfo('origin');
  };

  const handleSetDestination = (code: string) => {
    setDestination(code);
    if (code === origin) setOrigin("");
    setExpandedInfo('destination');
  };

  const toggleExpanded = (type: 'origin' | 'destination') => {
    setExpandedInfo(prev => prev === type ? null : type);
  };

  const handleSwap = () => {
    if (!origin && !destination) return;
    setOrigin(destination);
    setDestination(origin);
    // Swap the expanded accordion state so it follows the station
    if (expandedInfo === 'origin') setExpandedInfo('destination');
    else if (expandedInfo === 'destination') setExpandedInfo('origin');
  };

  const handleApply = () => {
    router.push(`/?origin=${origin}&dest=${destination}`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      {/* Map (Background) */}
      <div className="absolute inset-0 z-0">
        <RouteMap
          origin={origin}
          destination={destination}
          onSetOrigin={handleSetOrigin}
          onSetDestination={handleSetDestination}
        />
      </div>

      {/* Floating Panel - Search & Controls */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 w-[calc(100%-2rem)] md:w-[420px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-auto max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-[var(--color-primary)] text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-bold text-lg">Pilih Rute via Peta</h1>
          </div>
          <button
            onClick={() => setShowGuide(true)}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title="Panduan Penggunaan"
          >
            <HelpCircle size={20} />
          </button>
        </div>

        {/* Input Controls */}
        <div className="overflow-y-auto bg-gray-50 p-5 space-y-5">
          <div className="flex flex-col">
            {/* Origin Box */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col transition-all relative z-0">
              <div className="px-3.5 py-3 flex flex-col">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[10px] font-bold text-gray-400 tracking-widest">
                    STASIUN ASAL
                  </div>
                  {originStation && (
                    <button 
                      onClick={() => toggleExpanded('origin')}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${expandedInfo === 'origin' ? 'bg-blue-50 text-[var(--color-primary)]' : 'text-gray-400 hover:bg-gray-100'}`}
                      title="Info Stasiun"
                    >
                      <Menu size={15} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <div className="bg-[var(--color-primary)] p-2 rounded-full flex-shrink-0 shadow-sm">
                    <Navigation size={20} className="text-white" />
                  </div>
                  <div className="font-semibold text-base text-gray-800 line-clamp-1">
                    {originStation ? `${originStation.name} (${originStation.code})` : <span className="text-gray-400 font-normal italic">Belum dipilih...</span>}
                  </div>
                </div>
              </div>
              
              {/* Expandable Station Info for Origin */}
              {originStation && expandedInfo === 'origin' && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                  <StationInfoPanel station={originStation} />
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="relative z-10 flex justify-center -my-3">
               <button 
                 onClick={handleSwap} 
                 disabled={!origin && !destination}
                 title="Tukar Stasiun"
                 className="p-2 bg-white border border-gray-200 shadow-md rounded-full text-[var(--color-primary)] hover:bg-blue-50 transition-all focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <ArrowDownUp size={16} />
               </button>
            </div>

            {/* Destination Box */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col transition-all relative z-0">
              <div className="px-3.5 py-3 flex flex-col">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[10px] font-bold text-gray-400 tracking-widest">
                    STASIUN TUJUAN
                  </div>
                  {destStation && (
                    <button 
                      onClick={() => toggleExpanded('destination')}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${expandedInfo === 'destination' ? 'bg-orange-50 text-[var(--color-accent)]' : 'text-gray-400 hover:bg-gray-100'}`}
                      title="Info Stasiun"
                    >
                      <Menu size={15} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <div className="bg-[var(--color-accent)] p-2 rounded-full flex-shrink-0 shadow-sm">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div className="font-semibold text-base text-gray-800 line-clamp-1">
                    {destStation ? `${destStation.name} (${destStation.code})` : <span className="text-gray-400 font-normal italic">Belum dipilih...</span>}
                  </div>
                </div>
              </div>

              {/* Expandable Station Info for Destination */}
              {destStation && expandedInfo === 'destination' && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                  <StationInfoPanel station={destStation} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer / Action */}
        <div className="p-5 bg-white border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleApply}
            disabled={!origin || !destination}
            className="w-full py-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-base transition-colors shadow-md cursor-pointer"
          >
            Terapkan Rute
          </button>
        </div>
      </div>

      {/* Help Modal */}
      {showGuide && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <HelpCircle size={18} className="text-[var(--color-primary)]" />
                Panduan Penggunaan
              </h3>
            </div>
            <div className="p-5 text-[14px] text-gray-600 space-y-3">
              <div className="w-full flex justify-center mb-4">
                <Image
                  src="/Maskot/maskot_jalan.webp"
                  alt="Maskot KAI"
                  width={180}
                  height={180}
                  className="object-contain drop-shadow-md"
                />
              </div>
              <ul className="list-disc pl-5 space-y-2">
                <li>Klik pada <strong>pin stasiun mana pun</strong> di peta.</li>
                <li>Pilih tombol <strong>Asal</strong> atau <strong>Tujuan</strong> pada menu yang muncul.</li>
                <li>Klik tombol <strong>Terapkan Rute</strong> di kiri bawah jika sudah selesai memilih.</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setShowGuide(false)}
                className="w-full py-2.5 bg-[var(--color-primary)] text-white rounded-lg font-bold text-sm hover:bg-[var(--color-primary-dark)] transition-colors cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PetaRutePage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-gray-50 font-semibold text-gray-500">Memuat Peta...</div>}>
      <PetaRuteContent />
    </Suspense>
  );
}
