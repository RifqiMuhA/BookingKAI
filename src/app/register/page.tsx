"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showTestingModal, setShowTestingModal] = useState(false);

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
      users.push({ name: name.trim(), email: email.trim(), password });
      localStorage.setItem("mock_registered_users", JSON.stringify(users));
    } catch (err) {
      console.error(err);
    }

    // Arahkan ke halaman login agar pengguna melakukan login terlebih dahulu
    router.push(`/login?registered=success&email=${encodeURIComponent(email.trim())}`);
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

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">atau</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Tombol Google dengan Modal Notifikasi Testing */}
        <button
          type="button"
          onClick={() => setShowTestingModal(true)}
          className="w-full h-11 text-sm font-semibold rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-3 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          <span>Daftar dengan Google</span>
        </button>

        <p className="text-center text-gray-600 text-sm pt-3">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-[#F58220] hover:underline">
            Masuk di sini
          </Link>
        </p>

        {/* Modal Simpel untuk Kebutuhan Testing */}
        {showTestingModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100">
              <div className="w-24 h-24 mx-auto mb-3 relative">
                <Image
                  src="/Maskot/maskot_lambai.webp"
                  alt="Maskot KAI"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1.5">
                Pemberitahuan Testing
              </h3>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                Untuk kebutuhan testing, silakan gunakan pendaftaran manual dengan mengisi formulir di atas.
              </p>
              <button
                type="button"
                onClick={() => setShowTestingModal(false)}
                className="w-full py-2.5 bg-[#003C71] hover:bg-[#002B52] text-white text-sm font-bold rounded-md transition-colors cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
