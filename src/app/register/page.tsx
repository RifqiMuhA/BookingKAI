"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    login(); // set mock auth state
    router.push("/"); // redirect to home
  };

  return (
    <AuthLayout bgImage="/Background/background_2.webp">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003C71] mb-1">Daftar Akun KAI</h1>
          <p className="text-sm text-gray-600">Buat akun untuk kemudahan pemesanan tiket kereta api.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 rounded-sm border border-gray-300 focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] outline-none transition-colors text-sm"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input 
                type="email" 
                required
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
                  className="w-full px-4 py-2.5 rounded-sm border border-gray-300 focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] outline-none transition-colors pr-12 text-sm"
                  placeholder="Buat password baru"
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
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-6 h-6 rounded border-gray-300 text-[#003C71] focus:ring-[#003C71]" required />
              <span className="text-sm font-medium text-gray-700">I&apos;m not a robot</span>
            </div>
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
              <span className="text-[10px] text-gray-500 mt-1">reCAPTCHA</span>
            </div>
          </div>

          <Button type="button" onClick={handleRegister} className="w-full h-11 text-base rounded-md mt-2">
            Daftar
          </Button>
        </form>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">atau daftar dengan</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <Button type="button" onClick={handleRegister} variant="outline" className="w-full h-11 text-sm font-semibold rounded-md border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
          Daftar dengan Google
        </Button>

        <p className="text-center text-gray-600 text-sm pt-4">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-[#F58220] hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
