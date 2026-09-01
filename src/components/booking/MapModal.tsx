"use client";

import React, { useState } from "react";
import { X, Search, MapPin } from "lucide-react";
import { STATIONS, Station } from "@/lib/mockData";

interface MapModalProps {
  originCode: string;
  destinationCode: string;
  onApply: (origin: string, destination: string) => void;
  onClose: () => void;
}

type SetTarget = "origin" | "destination";

export function MapModal({ originCode, destinationCode, onApply, onClose }: MapModalProps) {
  const [target, setTarget] = useState<SetTarget>("origin");
  const [tempOrigin, setTempOrigin] = useState(originCode);
  const [tempDestination, setTempDestination] = useState(destinationCode);
  const [search, setSearch] = useState("");

  const filteredStations = search.trim()
    ? STATIONS.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase())
      )
    : STATIONS;

  function handleStationClick(station: Station) {
    if (target === "origin") {
      setTempOrigin(station.code);
      // Auto switch to destination if none set
      if (!tempDestination) setTarget("destination");
    } else {
      setTempDestination(station.code);
    }
  }

  function handleApply() {
    onApply(tempOrigin, tempDestination);
    onClose();
  }

  const originStation = STATIONS.find(s => s.code === tempOrigin);
  const destStation = STATIONS.find(s => s.code === tempDestination);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-2xl max-h-[92vh] md:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-lg text-[var(--color-primary)]">Pilih Rute via Peta</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Target Toggle */}
        <div className="flex gap-2 px-5 py-3 flex-shrink-0">
          <button
            onClick={() => setTarget("origin")}
            className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
              target === "origin"
                ? "border-[var(--color-primary)] bg-[var(--color-info-bg)] text-[var(--color-primary)]"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            <MapPin size={14} className={target === "origin" ? "text-[var(--color-primary)]" : "text-gray-400"} />
            <div className="text-left">
              <div className="text-[10px] opacity-70 font-normal">Set sebagai ASAL</div>
              <div className="truncate">{originStation?.name || "Pilih stasiun"}</div>
            </div>
          </button>
          <button
            onClick={() => setTarget("destination")}
            className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
              target === "destination"
                ? "border-[var(--color-accent)] bg-orange-50 text-[var(--color-accent)]"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            <MapPin size={14} className={target === "destination" ? "text-[var(--color-accent)]" : "text-gray-400"} />
            <div className="text-left">
              <div className="text-[10px] opacity-70 font-normal">Set sebagai TUJUAN</div>
              <div className="truncate">{destStation?.name || "Pilih stasiun"}</div>
            </div>
          </button>
        </div>

        {/* Map Area */}
        <div className="relative mx-5 rounded-2xl overflow-hidden bg-[#E8F4F8] border border-gray-200 flex-shrink-0" style={{ height: 260 }}>
          {/* Grid Background */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#003C71" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Island silhouette label */}
          <div className="absolute top-3 left-4 text-xs text-[var(--color-primary)] font-bold opacity-50 tracking-widest">
            JAWA
          </div>

          {/* Rail line connecting key stations (simplified) */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <polyline
              points={STATIONS
                .filter(s => ["GMR","PSE","CN","SMT","YK","SLO","SBI","SBY","ML","BJR"].includes(s.code))
                .sort((a, b) => a.x - b.x)
                .map(s => `${s.x}%,${s.y}%`)
                .join(" ")}
              fill="none"
              stroke="#003C71"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.4"
            />
            {/* Branch to Bandung */}
            <line x1="25%" y1="41%" x2="27%" y2="48%" stroke="#003C71" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
            {/* Branch to Malang */}
            <line x1="63%" y1="43%" x2="65%" y2="53%" stroke="#003C71" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
          </svg>

          {/* Station dots */}
          {STATIONS.map(station => {
            const isOrigin = station.code === tempOrigin;
            const isDest = station.code === tempDestination;
            const isActive = isOrigin || isDest;

            return (
              <button
                key={station.id}
                onClick={() => handleStationClick(station)}
                title={`${station.name} (${station.code})`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                style={{ left: `${station.x}%`, top: `${station.y}%` }}
              >
                <div className={`
                  flex items-center justify-center rounded-full border-2 transition-all shadow-sm
                  ${isOrigin
                    ? "w-5 h-5 bg-[var(--color-primary)] border-white scale-125 shadow-md"
                    : isDest
                    ? "w-5 h-5 bg-[var(--color-accent)] border-white scale-125 shadow-md"
                    : "w-3.5 h-3.5 bg-white border-[var(--color-primary)] hover:scale-125 hover:border-[var(--color-accent)]"}
                `} />
                {isActive && (
                  <div className={`
                    absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap
                    text-[10px] font-bold px-1.5 py-0.5 rounded shadow text-white
                    ${isOrigin ? "bg-[var(--color-primary)]" : "bg-[var(--color-accent)]"}
                  `}>
                    {station.name}
                  </div>
                )}
                {!isActive && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold bg-white border border-gray-200 px-1 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {station.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Fallback */}
        <div className="px-5 py-3 flex-shrink-0">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari stasiun..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none bg-[var(--color-bg-muted)]"
            />
          </div>
        </div>

        {/* Station List (when searching) */}
        {search.trim() && (
          <div className="overflow-y-auto max-h-36 mx-5 mb-2 rounded-xl border border-gray-100 bg-white shadow-inner flex-shrink-0">
            {filteredStations.length === 0 ? (
              <div className="p-4 text-sm text-gray-400 text-center">Stasiun tidak ditemukan</div>
            ) : (
              filteredStations.map(station => (
                <button
                  key={station.id}
                  onClick={() => { handleStationClick(station); setSearch(""); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--color-info-bg)] text-left text-sm cursor-pointer transition-colors"
                >
                  <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-[var(--color-text)]">{station.name}</div>
                    <div className="text-xs text-gray-400">{station.city} · {station.code}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Apply Button */}
        <div className="px-5 pt-2 pb-6 md:pb-5 flex-shrink-0 border-t border-gray-100">
          <button
            onClick={handleApply}
            disabled={!tempOrigin || !tempDestination}
            className="w-full h-12 bg-[var(--color-primary)] text-white rounded-xl font-bold text-base disabled:opacity-40 hover:bg-[var(--color-primary-dark)] transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Terapkan Rute
          </button>
        </div>
      </div>
    </div>
  );
}
