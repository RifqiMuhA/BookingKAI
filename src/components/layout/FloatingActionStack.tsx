"use client";
import React, { useState, useEffect } from "react";
import { 
  MessageSquare, Accessibility, X, Type, LayoutGrid, 
  AlignJustify, MoveHorizontal, Bold, 
  Link as LinkIcon, MousePointer2, ImageOff, Minus, Plus, 
  AlignLeft, AlignCenter, AlignRight 
} from "lucide-react";
import { cn } from "@/components/ui/Button";
import { usePathname } from "next/navigation";

// Dummy Toggle component
const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={cn(
      "w-11 h-6 rounded-full transition-colors flex items-center px-1 cursor-pointer shadow-inner",
      enabled ? "bg-[#F58220]" : "bg-gray-200"
    )}
  >
    <div className={cn("w-4 h-4 bg-white rounded-full transition-transform shadow-sm", enabled ? "translate-x-5" : "translate-x-0")} />
  </button>
);

export function FloatingActionStack() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [activePanel, setActivePanel] = useState<"none" | "accessibility" | "chat">("none");
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";

  // Local UI states for the drawer
  const [textSize, setTextSize] = useState(100);
  const [lineHeight, setLineHeight] = useState(1);
  const [textSpace, setTextSpace] = useState("Sedang");
  const [textAlign, setTextAlign] = useState("left");
  const [boldText, setBoldText] = useState(false);
  const [highlightLink, setHighlightLink] = useState(false);
  const [largeCursor, setLargeCursor] = useState(false);
  const [hideImage, setHideImage] = useState(false);

  const resetSettings = () => {
    setTextSize(100);
    setLineHeight(1);
    setTextSpace("Sedang");
    setTextAlign("left");
    setBoldText(false);
    setHighlightLink(false);
    setLargeCursor(false);
    setHideImage(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const togglePanel = (panel: "accessibility" | "chat") => {
    if (activePanel === panel) {
      setActivePanel("none");
    } else {
      setActivePanel(panel);
    }
  };

  if (isAuthPage) {
    return null;
  }

  return (
    <>
      {/* Drawer Overlay */}
      {activePanel === "accessibility" && (
        <div 
          className="fixed inset-0 bg-black/30 z-[60] transition-opacity cursor-pointer"
          onClick={() => setActivePanel("none")}
        />
      )}

      {/* Accessibility Side Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-[90%] sm:w-[320px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-y-auto flex flex-col",
          activePanel === "accessibility" ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10">
          <h2 className="text-lg font-bold text-[#003C71]">Menu Aksesibilitas</h2>
          <button 
            onClick={() => setActivePanel("none")}
            className="w-8 h-8 bg-[#F58220] hover:bg-[#d9731c] text-white rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 flex-1">

          {/* Ukuran Teks */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-[#003C71]">
              <Type size={20} strokeWidth={1.5} />
              <span className="font-medium text-[15px]">Atur Ukuran Teks</span>
            </div>
            <div className="flex items-center justify-between px-4">
              <button onClick={() => setTextSize(Math.max(50, textSize - 10))} className="w-9 h-9 rounded-full bg-[#F58220] hover:bg-[#d9731c] text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer">
                <Minus size={18} />
              </button>
              <span className="font-medium text-[#003C71] text-base w-14 text-center">{textSize}%</span>
              <button onClick={() => setTextSize(Math.min(200, textSize + 10))} className="w-9 h-9 rounded-full bg-[#F58220] hover:bg-[#d9731c] text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer">
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Tinggi Baris */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-[#003C71]">
              <AlignJustify size={20} strokeWidth={1.5} />
              <span className="font-medium text-[15px]">Atur Tinggi Baris</span>
            </div>
            <div className="flex items-center justify-between px-4">
              <button onClick={() => setLineHeight(Math.max(1, lineHeight - 0.5))} className="w-9 h-9 rounded-full bg-[#F58220] hover:bg-[#d9731c] text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer">
                <Minus size={18} />
              </button>
              <span className="font-medium text-[#003C71] text-base w-14 text-center">{lineHeight}x</span>
              <button onClick={() => setLineHeight(Math.min(2, lineHeight + 0.5))} className="w-9 h-9 rounded-full bg-[#F58220] hover:bg-[#d9731c] text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer">
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Spasi Teks */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-[#003C71]">
              <MoveHorizontal size={20} strokeWidth={1.5} />
              <span className="font-medium text-[15px]">Spasi Teks</span>
            </div>
            <div className="flex gap-2">
              {["Kecil", "Sedang", "Besar"].map((opt) => (
                <button 
                  key={opt}
                  onClick={() => setTextSpace(opt)}
                  className={cn(
                    "flex-1 py-2 rounded-lg border text-[14px] transition-colors cursor-pointer",
                    textSpace === opt ? "border-[#F58220] text-[#F58220] bg-orange-50 font-semibold" : "border-gray-300 text-gray-700 hover:border-orange-300"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Rata Tulisan */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-[#003C71]">
              <AlignLeft size={20} strokeWidth={1.5} />
              <span className="font-medium text-[15px]">Rata Tulisan</span>
            </div>
            <div className="flex gap-3">
              {[
                { id: "left", icon: <AlignLeft size={18} /> },
                { id: "center", icon: <AlignCenter size={18} /> },
                { id: "right", icon: <AlignRight size={18} /> },
                { id: "justify", icon: <AlignJustify size={18} /> },
              ].map((opt) => (
                <button 
                  key={opt.id}
                  onClick={() => setTextAlign(opt.id)}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer",
                    textAlign === opt.id ? "bg-[#F58220] border-[#F58220] text-white shadow-sm" : "border-gray-300 text-gray-700 hover:border-orange-300"
                  )}
                >
                  {opt.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Toggles */}
          <div className="space-y-5 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-[#003C71]">
                <Bold size={20} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Pertebal Huruf</span>
              </div>
              <Toggle enabled={boldText} onChange={() => setBoldText(!boldText)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-[#003C71]">
                <LinkIcon size={20} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Sorot Tautan</span>
              </div>
              <Toggle enabled={highlightLink} onChange={() => setHighlightLink(!highlightLink)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-[#003C71]">
                <MousePointer2 size={20} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Perbesar Kursor</span>
              </div>
              <Toggle enabled={largeCursor} onChange={() => setLargeCursor(!largeCursor)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-[#003C71]">
                <ImageOff size={20} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Sembunyikan Gambar</span>
              </div>
              <Toggle enabled={hideImage} onChange={() => setHideImage(!hideImage)} />
            </div>
          </div>
        </div>

        <div className="p-5 bg-white sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={resetSettings}
            className="w-full py-3.5 bg-[#F58220] hover:bg-[#d9731c] text-white text-[15px] font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Atur Ulang Pengaturan
          </button>
        </div>
      </div>

      {/* Virtual Assistant Chat Panel */}
      {activePanel === "chat" && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] w-[90vw] sm:w-80 max-w-[360px] h-[28rem] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-[#003C71] text-white p-4 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageSquare size={16} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Virtual Assistant</h3>
                <p className="text-[10px] text-white/80">Online</p>
              </div>
            </div>
            <button onClick={() => setActivePanel("none")} className="hover:text-gray-200 transition-colors cursor-pointer p-1">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm text-sm text-gray-800 w-[85%] mb-4 border border-gray-100">
              Halo! 👋 Saya adalah Virtual Assistant KAI. Ada yang bisa saya bantu hari ini?
            </div>
            <div className="flex flex-col gap-2 items-end">
              <button className="bg-white border border-[#003C71] text-[#003C71] px-4 py-2 rounded-full text-xs font-medium hover:bg-[#E8F0FE] transition-colors shadow-sm cursor-pointer text-right">
                Cek Jadwal Kereta
              </button>
              <button className="bg-white border border-[#003C71] text-[#003C71] px-4 py-2 rounded-full text-xs font-medium hover:bg-[#E8F0FE] transition-colors shadow-sm cursor-pointer text-right">
                Info Pembatalan / Refund
              </button>
              <button className="bg-white border border-[#003C71] text-[#003C71] px-4 py-2 rounded-full text-xs font-medium hover:bg-[#E8F0FE] transition-colors shadow-sm cursor-pointer text-right">
                Ubah Jadwal (Reschedule)
              </button>
            </div>
          </div>
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="bg-gray-100 text-gray-400 text-sm px-4 py-2.5 rounded-full">
              Ketik pesan...
            </div>
          </div>
        </div>
      )}

      {/* Floating Buttons Container */}
      <div
        className={cn(
          "fixed right-4 sm:right-6 bottom-6 z-[40] transition-all duration-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 pointer-events-none"
        )}
      >

        {/* Action Buttons Stack */}
        <div className="flex flex-col items-end gap-3">
          {/* Desktop: Always visible. Mobile: Visible if expanded */}
          <div className={cn(
            "flex-col gap-3 md:flex",
            isMobileExpanded ? "flex" : "hidden"
          )}>
            <button
              onClick={() => togglePanel("accessibility")}
              className="w-12 h-12 rounded-xl bg-[#003C71] border-[2px] border-white text-white flex items-center justify-center shadow-lg hover:bg-[#002f59] transition-transform hover:scale-105 relative group cursor-pointer"
              aria-label="Buka Pengaturan Aksesibilitas"
            >
              <Accessibility size={22} />
              <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm">
                Aksesibilitas
              </span>
            </button>
            
            <button
              onClick={() => togglePanel("chat")}
              className="w-12 h-12 rounded-xl bg-[#003C71] border-[2px] border-white text-white flex items-center justify-center shadow-lg hover:bg-[#002f59] transition-transform hover:scale-105 relative group cursor-pointer"
              aria-label="Buka Virtual Assistant"
            >
              <MessageSquare size={20} />
              <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm">
                Virtual Assistant
              </span>
            </button>
          </div>

          {/* Mobile Main FAB */}
          <button
            onClick={() => {
              setIsMobileExpanded(!isMobileExpanded);
              if (activePanel !== "none") setActivePanel("none");
            }}
            className="md:hidden w-14 h-14 rounded-xl bg-[#003C71] border-[1.5px] border-white text-white flex flex-col items-center justify-center shadow-lg hover:bg-[#002f59] transition-transform active:scale-95 cursor-pointer"
            aria-label="Fitur Tambahan"
          >
            {isMobileExpanded ? (
              <X size={24} />
            ) : (
              <>
                <LayoutGrid size={22} strokeWidth={2.5} />
                <span className="text-[11px] font-bold mt-0.5 tracking-wide">Fitur</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
