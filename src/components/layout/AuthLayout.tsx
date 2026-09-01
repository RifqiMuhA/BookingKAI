import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  bgImage: string;
}

export function AuthLayout({ children, bgImage }: AuthLayoutProps) {
  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      <div className="w-full lg:w-1/2 relative h-full overflow-y-auto">
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#002f59] transition-colors">
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="min-h-full flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-20">
          <div className="w-full max-w-lg mx-auto z-10">
            <div className="mb-2">
              <Image
                src="/Logo/logo_kai.webp"
                alt="Logo KAI"
                width={80}
                height={32}
                className="object-contain mb-3 h-7 w-auto"
                priority
              />
            </div>
            {children}
          </div>
        </div>
      </div>

      {/* Right Side: Image with Gradient Overlays */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gray-100">
        <Image
          src={bgImage}
          alt="Background KAI"
          fill
          className="object-cover"
          priority
        />
        
        {/* Top Left Blue Glow */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#003C71] rounded-full blur-[120px] opacity-60 -translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        
        {/* Bottom Right Orange Glow */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#F58220] rounded-full blur-[120px] opacity-50 translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
        
      </div>
    </div>
  );
}
