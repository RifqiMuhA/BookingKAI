"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getPricesByMonth, formatPrice } from "@/lib/mockData";

interface PriceCalendarProps {
  selectedDate: string; // "YYYY-MM-DD"
  onSelect: (date: string) => void;
  onClose?: () => void;
  minDate?: string;
  rangeStartDate?: string;
}

const DAYS_OF_WEEK = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Ags", "Sep", "Okt", "Nov", "Des",
];

export function PriceCalendar({
  selectedDate,
  onSelect,
  onClose,
  minDate,
  rangeStartDate,
}: PriceCalendarProps) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const effectiveMinDate = minDate || todayStr;

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [isFlexible, setIsFlexible] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Month 2 = next month
  const month2 = viewMonth === 12 ? 1 : viewMonth + 1;
  const year2 = viewMonth === 12 ? viewYear + 1 : viewYear;

  const prices1 = useMemo(() => getPricesByMonth(viewYear, viewMonth), [viewYear, viewMonth]);
  const prices2 = useMemo(() => getPricesByMonth(year2, month2), [year2, month2]);

  function prevMonth() {
    if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function getDateStr(y: number, m: number, d: number) {
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  function getMonthStr(y: number, m: number) {
    return `${y}-${String(m).padStart(2, "0")}`;
  }

  function isPast(dateStr: string) {
    return dateStr < effectiveMinDate;
  }

  // ── Flexible mode: 6-month grid ──────────────────────────────────────
  function renderFlexibleGrid() {
    const months: { y: number; m: number }[] = [];
    let cy = today.getFullYear();
    let cm = today.getMonth() + 1;
    for (let i = 0; i < 6; i++) {
      months.push({ y: cy, m: cm });
      cm++;
      if (cm > 12) { cm = 1; cy++; }
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-5 pb-6 pt-2">
        {months.map(({ y, m }) => {
          const prices = getPricesByMonth(y, m);
          // Only consider non-past dates for cheapest price display and selection
          const nonPastEntries = Object.entries(prices).filter(([ds]) => !isPast(ds));
          const minPrice = nonPastEntries.length > 0 ? Math.min(...nonPastEntries.map(([, p]) => p)) : null;
          const cheapestDate = nonPastEntries.find(([, p]) => p === minPrice)?.[0] ?? null;
          const monthStr = getMonthStr(y, m);
          const isSelectedMonth = selectedDate.startsWith(monthStr);

          return (
            <button
              key={monthStr}
              onClick={() => {
                // Select the cheapest available date in this month
                if (cheapestDate) {
                  onSelect(cheapestDate);
                } else {
                  // Fallback: first non-past day if no price data
                  const daysInMonth = new Date(y, m, 0).getDate();
                  for (let d = 1; d <= daysInMonth; d++) {
                    const ds = getDateStr(y, m, d);
                    if (!isPast(ds)) { onSelect(ds); break; }
                  }
                }
                onClose?.();
              }}
              className={`
                flex flex-col items-center justify-center rounded-2xl p-4 border-2 transition-all cursor-pointer
                ${isSelectedMonth
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-lg"
                  : "border-gray-200 bg-white hover:border-[var(--color-primary)] hover:bg-[var(--color-info-bg)]"}
              `}
            >
              <span className={`text-xl font-black leading-none ${isSelectedMonth ? "text-white" : "text-[var(--color-primary)]"}`}>
                {MONTHS_SHORT[m - 1]}
              </span>
              <span className={`text-xs font-semibold mt-0.5 ${isSelectedMonth ? "text-white/80" : "text-gray-400"}`}>
                {y}
              </span>
              {minPrice && (
                <div className={`mt-2 text-[11px] font-semibold text-center ${isSelectedMonth ? "text-white/90" : "text-green-600"}`}>
                  <div className={`text-[9px] uppercase tracking-wide mb-0.5 ${isSelectedMonth ? "text-white/60" : "text-gray-400"}`}>
                    Termurah
                  </div>
                  {formatPrice(minPrice).replace(",00", "")}
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // ── Date grid for one month ───────────────────────────────────────────
  function renderMonthGrid(y: number, m: number, prices: Record<string, number>) {
    const firstDayOfWeek = new Date(y, m - 1, 1).getDay();
    const daysInMonth = new Date(y, m, 0).getDate();

    // !! Bug fix: only count non-past dates for cheapest highlight
    const nonPastPrices = Object.entries(prices)
      .filter(([ds]) => !isPast(ds))
      .map(([, p]) => p);
    const minPrice = nonPastPrices.length > 0 ? Math.min(...nonPastPrices) : Infinity;

    return (
      <div className="flex-1 w-full min-w-[260px]">
        {/* Month Header */}
        <div className="flex flex-col items-center justify-center mb-3">
          <span className="font-bold text-[var(--color-primary)] text-base">
            {MONTHS_ID[m - 1]} {y}
          </span>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-gray-400 mb-1.5">
          {DAYS_OF_WEEK.map(d => <div key={d}>{d}</div>)}
        </div>

        {/* Dates grid */}
        <div className="grid grid-cols-7 gap-y-0.5 text-center text-sm">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dateStr = getDateStr(y, m, day);
            const price = prices[dateStr];
            const past = isPast(dateStr);
            // !! Bug fix: cheapest only among non-past dates
            const isCheapest = price === minPrice && !past;

            const isSelected = selectedDate === dateStr;
            // !! Bug fix: rangeStartDate is the departure date which is "past" in return calendar
            // but must still show as the highlighted start marker
            const isRangeStart = rangeStartDate === dateStr;
            const hoverOrSelected = hoveredDate || selectedDate;

            let inRange = false;
            let isRangeEnd = isSelected;

            if (rangeStartDate) {
              if (hoverOrSelected && dateStr > rangeStartDate && dateStr < hoverOrSelected) {
                inRange = true;
              }
              if (hoverOrSelected && dateStr === hoverOrSelected && dateStr !== rangeStartDate) {
                isRangeEnd = true;
              }
            }

            let bgClass = "";
            let textClass = "";
            let roundedClass = "rounded-lg";

            // !! Bug fix: isRangeStart is ALWAYS navy — even when past (departure is always shown)
            if (isRangeStart) {
              bgClass = "bg-[var(--color-primary)]";
              textClass = "text-white font-semibold";
              roundedClass = "rounded-l-lg rounded-r-none";
            } else if (isRangeEnd && rangeStartDate) {
              bgClass = "bg-[var(--color-primary)]";
              textClass = "text-white font-semibold";
              roundedClass = "rounded-r-lg rounded-l-none";
            } else if (isSelected && !rangeStartDate) {
              bgClass = "bg-[var(--color-primary)]";
              textClass = "text-white font-semibold";
            } else if (inRange) {
              bgClass = "bg-[var(--color-info-bg)]";
              roundedClass = "rounded-none";
              textClass = past ? "text-gray-300" : "text-[var(--color-text)]";
            } else if (past) {
              textClass = "text-gray-300";
            } else {
              textClass = "text-[var(--color-text)]";
            }

            const isHighlighted = isRangeStart || isRangeEnd || (isSelected && !rangeStartDate);

            return (
              <div
                key={day}
                className={`relative flex items-center justify-center py-1 ${bgClass} ${roundedClass}`}
                onMouseEnter={() => !past && setHoveredDate(dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <button
                  // rangeStartDate is visually shown but not clickable from return calendar
                  disabled={past}
                  onClick={() => { onSelect(dateStr); onClose?.(); }}
                  className={`
                    relative flex flex-col items-center justify-center w-full transition-all
                    ${past ? "cursor-not-allowed" : "cursor-pointer"}
                    ${!inRange && !isHighlighted && !past ? "hover:bg-gray-100 rounded-lg" : ""}
                    ${textClass}
                  `}
                >
                  <span className="leading-none text-sm">{day}</span>
                  {price && (
                    <span className={`
                      text-[9px] leading-tight mt-0.5 font-medium truncate
                      ${isHighlighted ? "text-white/80"
                        : isCheapest ? "text-green-600 font-bold"
                        : past ? "text-gray-300" : "text-gray-400"}
                    `}>
                      {formatPrice(price).replace("Rp\u00A0", "").replace(",00", "")}
                    </span>
                  )}
                  {isCheapest && !isHighlighted && !inRange && (
                    <span className="absolute -top-1 -right-0.5 bg-green-500 text-white text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center shadow-sm">
                      ✓
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-3xl shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-100 flex-shrink-0 flex items-center justify-between">
          <h2 className="font-bold text-lg text-[var(--color-primary)]">
            {rangeStartDate ? "Pilih Tanggal Kembali" : "Pilih Tanggal Berangkat"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Toggle Exact / Flexible */}
        <div className="px-5 py-3 flex justify-center flex-shrink-0">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setIsFlexible(false)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                !isFlexible ? "bg-white text-[var(--color-primary)] shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tanggal Pasti
            </button>
            <button
              onClick={() => setIsFlexible(true)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                isFlexible ? "bg-white text-[var(--color-primary)] shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tanggal Fleksibel
            </button>
          </div>
        </div>

        {/* Calendar Body */}
        <div className="flex-1 overflow-y-auto">
          {isFlexible ? (
            renderFlexibleGrid()
          ) : (
            <>
              {/* Month nav */}
              <div className="flex items-center justify-between px-5 mb-2">
                <button onClick={prevMonth} className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 shadow-sm cursor-pointer">
                  <ChevronLeft size={16} className="text-[var(--color-primary)]" />
                </button>
                <div className="text-xs text-gray-400 font-semibold">Geser bulan</div>
                <button onClick={nextMonth} className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 shadow-sm cursor-pointer">
                  <ChevronRight size={16} className="text-[var(--color-primary)]" />
                </button>
              </div>

              {/* Month grids: 1 on mobile, 2 on md+ */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-2 px-5 pb-5">
                {renderMonthGrid(viewYear, viewMonth, prices1)}

                {/* Desktop only: divider + second month */}
                <div className="hidden md:block w-px bg-gray-100 my-2 flex-shrink-0" />
                <div className="hidden md:flex flex-1">
                  {renderMonthGrid(year2, month2, prices2)}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500 border-t border-gray-100 py-3 px-5">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  <span>Harga termurah</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[var(--color-primary)] inline-block" />
                  <span>Terpilih</span>
                </div>
                {rangeStartDate && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-3 rounded-sm bg-[var(--color-info-bg)] inline-block" />
                    <span>Rentang perjalanan</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
