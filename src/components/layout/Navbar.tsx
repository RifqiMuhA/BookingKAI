"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X, ArrowRight, User } from "lucide-react";
import { cn } from "@/components/ui/Button"; // using cn for conditional classes
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Pesan Tiket", href: "/", hasDropdown: false },
  { name: "Cek Pesanan", href: "/cek-pesanan", hasDropdown: false },
  { name: "Promo", href: "/promo", hasDropdown: false },
];

export function Navbar({ hideMain = false }: { hideMain?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [lang, setLang] = useState("ID");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const { isLoggedIn, user, logout } = useAuth();
  
  const isSolid = isScrolled || pathname !== "/";

  useEffect(() => {
    const handleScroll = () => {
      // Ubah state jika di-scroll lebih dari 10px
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-300">
      {/* Top Bar - Always Navy */}
      <div className="bg-[var(--color-primary-dark)] text-white text-xs py-2 px-4 md:px-8 hidden sm:flex justify-end items-center">
        <div className="flex items-center gap-4 ml-auto font-medium">
          <Link href="/faq" className="hover:underline hidden sm:block">FAQ</Link>
          <Link href="/hubungi-kami" className="hover:underline hidden sm:block">Hubungi Kami</Link>
          {!isLoggedIn && (
            <>
              <div className="hidden sm:block w-px h-3 bg-white/30"></div>
              <Link href="/login" className="hover:underline hidden sm:block font-bold">Login</Link>
            </>
          )}

          {/* Language Dropdown - Hidden on mobile top bar */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 hover:text-gray-200 transition-colors focus:outline-none cursor-pointer"
            >
              <Image
                src={lang === "ID" ? "https://flagcdn.com/id.svg" : "https://flagcdn.com/gb.svg"}
                alt={lang}
                width={16}
                height={12}
                unoptimized
                className="w-4 h-3 object-cover rounded-sm shadow-sm"
              />
              <span className="font-bold">{lang}</span>
              <ChevronDown size={14} className={`transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
            </button>
            {isLangOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white text-[var(--color-text)] rounded shadow-lg overflow-hidden min-w-[100px] flex flex-col z-50 border border-gray-100">
                <button
                  className="flex items-center cursor-pointer gap-2 px-3 py-2 hover:bg-gray-100 text-left font-medium"
                  onClick={() => { setLang("ID"); setIsLangOpen(false); }}
                >
                  <Image src="https://flagcdn.com/id.svg" alt="ID" width={16} height={12} unoptimized className="w-4 h-3 object-cover rounded-sm" />
                  Indonesia
                </button>
                <button
                  className="flex items-center cursor-pointer gap-2 px-3 py-2 hover:bg-gray-100 text-left font-medium"
                  onClick={() => { setLang("EN"); setIsLangOpen(false); }}
                >
                  <Image src="https://flagcdn.com/gb.svg" alt="EN" width={16} height={12} unoptimized className="w-4 h-3 object-cover rounded-sm" />
                  English
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      {!hideMain && (
        <div
        className={cn(
          "px-4 md:px-8 h-14 transition-colors duration-300 flex items-center justify-between",
          isSolid ? "bg-white shadow-md" : "bg-transparent"
        )}
      >
        <Link href="/">
          <Image
            src={isSolid ? "/Logo/logo_kai.webp" : "/Logo/logo_kai_putih.webp"}
            alt="Logo KAI"
            width={80}
            height={32}
            className="object-contain h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center h-full gap-7">
          {navLinks.map((link, idx) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={idx}
                href={link.href}
                className="relative h-full flex items-center gap-1 group cursor-pointer px-1"
              >
                <span className={cn(
                  "text-[14px] font-medium transition-colors duration-200",
                  isActive ? "text-[#F58220] font-bold" : (
                    isSolid ? "text-[#003C71] group-hover:text-[#F58220]" : "text-white group-hover:text-[#F58220]"
                  )
                )}>
                  {link.name}
                </span>
                {link.hasDropdown && (
                  <ChevronDown size={14} className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-[#F58220]" : (
                      isSolid ? "text-[#003C71] group-hover:text-[#F58220]" : "text-white group-hover:text-[#F58220]"
                    )
                  )} />
                )}

                {/* Garis Oren Animasi Transisi Kiri ke Kanan Full Width Pas di Bawah Navbar */}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 w-full h-[3px] bg-[#F58220] origin-left transition-transform duration-300 ease-out",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            );
          })}

          {/* Profile Dropdown */}
          {isLoggedIn && (
            <div className="relative ml-2" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all cursor-pointer",
                  isSolid ? "border-[#003C71] text-[#003C71] hover:bg-[#003C71] hover:text-white" : "border-white text-white hover:bg-white hover:text-[#003C71]"
                )}
                title={user?.name || "Profil Akun"}
              >
                <User size={16} />
              </button>
              
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white text-[var(--color-text)] rounded-sm shadow-md overflow-hidden w-60 flex flex-col z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/70">
                    <p className="text-sm font-semibold text-[#003C71] truncate">{user?.name || "Pengguna KAI"}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email || "pengguna@email.com"}</p>
                  </div>
                  <Link 
                    href="/riwayat-pesanan" 
                    className="px-4 py-2.5 text-sm font-normal text-gray-700 hover:bg-gray-50 hover:text-[#003C71] transition-colors flex items-center justify-between" 
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <span>Riwayat Pemesanan</span>
                    <span className="text-xs bg-blue-50 text-[#003C71] font-medium px-2 py-0.5 rounded-sm border border-blue-100">3 Tiket</span>
                  </Link>
                  <Link 
                    href="/cek-pesanan" 
                    className="px-4 py-2.5 text-sm font-normal text-gray-700 hover:bg-gray-50 hover:text-[#003C71] transition-colors" 
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Cek Kode Booking Lain
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }} 
                    className="px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 text-left transition-colors cursor-pointer border-t border-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle (Visible on lg and smaller) */}
        <div className="flex lg:hidden items-center gap-4">
          <button
            className={cn(
              "p-1 transition-colors cursor-pointer",
              isScrolled ? "text-[#003C71]" : "text-white"
            )}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      )}

      {/* Mobile Sidebar Overlay with smooth transition */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden transition-all duration-300",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={cn(
            "absolute top-0 right-0 w-[80%] sm:w-[350px] bg-white h-full shadow-2xl flex flex-col overflow-y-auto transition-transform duration-300 ease-out",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex justify-end p-4">
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-black transition-colors cursor-pointer">
              <X size={24} />
            </button>
          </div>

          {/* Nav Links - Top */}
          <div className="flex flex-col px-6 py-2 gap-5 text-[#1A202C] font-medium text-[17px]">
            {navLinks.map((link, idx) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative pb-2 flex items-center justify-between group cursor-pointer"
                >
                  <span className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-[#F58220] font-bold" : "text-[#1A202C] group-hover:text-[#F58220]"
                  )}>
                    {link.name}
                  </span>
                  {link.hasDropdown && <ArrowRight size={16} className="text-[#F58220]" />}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 w-full h-[2px] bg-[#F58220] origin-left transition-transform duration-300 ease-out",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* Footer section - Pushed to bottom */}
          <div className="mt-auto px-6 pb-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col gap-4 text-[15px] text-gray-700">
              <Link href="/faq" className="hover:text-[var(--color-primary)] transition-colors">FAQ</Link>
              <Link href="/hubungi-kami" className="hover:text-[var(--color-primary)] transition-colors">Hubungi Kami</Link>
              <div className="h-px bg-gray-100 my-1"></div>
              
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-sm bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-8 h-8 shrink-0 rounded-sm bg-[#003C71] text-white flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-[#003C71] truncate">{user?.name || "Pengguna KAI"}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user?.email || "pengguna@email.com"}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }} 
                      className="shrink-0 text-xs font-medium text-red-600 hover:text-red-800 transition-colors cursor-pointer px-2.5 py-1.5 rounded-sm hover:bg-red-50 ml-2"
                    >
                      Logout
                    </button>
                  </div>
                  <Link
                    href="/riwayat-pesanan"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2 px-3 text-xs font-bold text-center text-[#003C71] bg-blue-50 border border-blue-200 rounded-sm hover:bg-blue-100 transition-colors block"
                  >
                    Lihat Riwayat Pesanan (3 Tiket)
                  </Link>
                </div>
              ) : (
                <div className="flex items-center">
                  <Link 
                    href="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-bold text-[var(--color-primary)] hover:text-[#002f59] transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => setLang("ID")}
                  className={cn("flex items-center gap-1.5 transition-colors cursor-pointer px-2 py-1 rounded", lang === "ID" ? "text-black font-semibold bg-gray-100 ring-1 ring-gray-300" : "hover:text-black")}
                >
                  <Image src="https://flagcdn.com/id.svg" alt="ID" width={20} height={14} unoptimized className="w-5 h-3.5 object-cover rounded-sm" />
                  ID
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => setLang("EN")}
                  className={cn("flex items-center gap-1.5 transition-colors cursor-pointer px-2 py-1 rounded", lang === "EN" ? "text-black font-semibold bg-gray-100 ring-1 ring-gray-300" : "hover:text-black")}
                >
                  <Image src="https://flagcdn.com/gb.svg" alt="EN" width={20} height={14} unoptimized className="w-5 h-3.5 object-cover rounded-sm" />
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
