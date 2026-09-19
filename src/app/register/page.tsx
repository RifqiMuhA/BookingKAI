"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Nama lengkap wajib diisi.");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Alamat email wajib diisi.");
      return;
    }
    if (!password) {
      setErrorMessage("Password wajib diisi.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi password tidak cocok dengan password.");
      return;
    }
    if (!isCaptchaChecked) {
      setErrorMessage("Silakan centang 'I'm not a robot' terlebih dahulu.");
      return;
    }

    // Simpan akun ke localStorage agar bisa digunakan juga untuk login
    try {
      const existing = localStorage.getItem("mock_registered_users");
      const users = existing ? JSON.parse(existing) : [];
      users.push({ name, email, password });
      localStorage.setItem("mock_registered_users", JSON.stringify(users));
    } catch (err) {
      console.error(err);
    }

    // Login otomatis dengan akun yang baru dibuat
    login({ name, email });
    router.push("/");
  };

  return (
    <AuthLayout bgImage="/Background/background_2.webp">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003C71] mb-1">Daftar Akun KAI</h1>
          <p className="text-sm text-gray-600">Buat akun untuk kemudahan pemesanan tiket kereta api.</p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-sm border border-gray-300 focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] outline-none transition-colors text-sm"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-sm border border-gray-300 focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] outline-none transition-colors text-sm"
                placeholder="Masukkan alamat email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-sm border border-gray-300 focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] outline-none transition-colors pr-12 text-sm"
                  placeholder="Minimal 6 karakter"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Konfirmasi Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-sm border border-gray-300 focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] outline-none transition-colors pr-12 text-sm"
                  placeholder="Ulangi password"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="border border-gray-300 rounded-none p-2.5 flex items-center justify-between bg-gray-50 mt-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isCaptchaChecked}
                onChange={(e) => setIsCaptchaChecked(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#003C71] focus:ring-[#003C71] cursor-pointer" 
              />
              <span className="text-sm font-medium text-gray-700">I&apos;m not a robot</span>
            </label>
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
              <span className="text-[10px] text-gray-500 mt-1">reCAPTCHA</span>
            </div>
          </div>

          <Button type="submit" className="w-full h-11 text-base rounded-md mt-2">
            Daftar Sekarang
          </Button>
        </form>

        <p className="text-center text-gray-600 text-sm pt-4">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-[#F58220] hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
