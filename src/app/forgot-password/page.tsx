"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <AuthLayout bgImage="/Background/background_3.webp">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003C71] mb-1">Lupa Password?</h1>
          <p className="text-sm text-gray-600">Masukkan email Anda dan kami akan mengirimkan instruksi untuk mereset password.</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Email Anda</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] outline-none transition-colors text-sm"
                placeholder="Masukkan alamat email terdaftar"
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base rounded-md mt-2">
              Kirim Link Reset
            </Button>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-md p-6 mt-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-green-600" size={32} />
            </div>
            <h3 className="text-lg font-bold text-green-800">Cek Email Anda</h3>
            <p className="text-green-700 text-sm">
              Kami telah mengirimkan link untuk mereset password ke <strong>{email}</strong>. 
              Silakan cek folder inbox atau spam Anda.
            </p>
          </div>
        )}

        <div className="text-center pt-6">
          <Link href="/login" className="font-semibold text-[#003C71] hover:underline inline-flex items-center gap-2">
            Kembali ke Halaman Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
