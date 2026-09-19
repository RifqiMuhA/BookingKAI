import React from "react";
import Image from "next/image";
import Link from "next/link";

const layananTiket = [
  "Pesan Tiket",
  "Cek Pesanan",
  "Promo & Diskon",
  "Jadwal Kereta",
  "Info Tarif",
  "Pilih Kursi",
];

const bantuan = [
  "FAQ",
  "Hubungi Kami",
  "Syarat & Ketentuan",
  "Kebijakan Privasi",
  "Panduan Booking",
  "Reschedule & Refund",
];



export function Footer() {
  return (
    <footer className="bg-[#1e1b4b] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Column 1 - Logo & Contact (spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logos */}
            <div className="flex items-center gap-4">
              <Image
                src="/Logo/logo_kai_putih.webp"
                alt="Logo KAI"
                width={80}
                height={32}
                className="object-contain h-8 w-auto"
              />
              <Image
                src="/Logo/danantara_logo.webp"
                alt="Danantara Indonesia"
                width={140}
                height={32}
                className="object-contain h-8 w-auto"
              />
            </div>

            {/* Address */}
            <div className="space-y-1 text-sm text-gray-300 leading-relaxed">
              <p>Jl. Perintis Kemerdekaan No.1, Bandung 40117</p>
              <p>022-423 0031, 423 0039, 423 0054</p>
            </div>

            {/* Email */}
            <div className="space-y-1 text-sm">
              <p className="text-[var(--color-accent)] font-semibold text-xs uppercase tracking-wider">Email</p>
              <p className="text-gray-300">
                <span className="font-medium text-white">Korespondensi Kantor Pusat: </span>
                <a href="mailto:dokumen@kai.id" className="hover:underline">dokumen@kai.id</a>
              </p>
              <p className="text-gray-300">
                <span className="font-medium text-white">Layanan Pelanggan: </span>
                <a href="mailto:cs@kai.id" className="hover:underline">cs@kai.id</a>
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-1 text-sm">
              <p className="text-[var(--color-accent)] font-semibold text-xs uppercase tracking-wider">Telepon</p>
              <p className="text-gray-300">
                <span className="font-medium text-white">Office phone </span>022-423 0031, 423 0039
              </p>
              <p className="text-gray-300">
                <span className="font-medium text-white">Contact center </span>121/(021) 121
              </p>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-4 pt-2">
              {[
                { name: "Facebook", icon: <FacebookIcon /> },
                { name: "X", icon: <XIcon /> },
                { name: "Instagram", icon: <InstagramIcon /> },
                { name: "TikTok", icon: <TikTokIcon /> },
                { name: "Threads", icon: <ThreadsIcon /> },
                { name: "YouTube", icon: <YouTubeIcon /> },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/25 transition-colors cursor-pointer"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* App Stores */}
            <div className="flex items-center gap-3 pt-1">
              <a href="#" className="cursor-pointer hover:opacity-80 transition-opacity">
                <Image
                  src="/Logo/get_googleplay.webp"
                  alt="Get it on Google Play"
                  width={120}
                  height={40}
                  className="object-contain h-9 w-auto"
                />
              </a>
              <a href="#" className="cursor-pointer hover:opacity-80 transition-opacity">
                <Image
                  src="/Logo/get_appstore.webp"
                  alt="Download on the App Store"
                  width={120}
                  height={40}
                  className="object-contain h-9 w-auto"
                />
              </a>
            </div>
          </div>

          {/* Column 2 - Layanan Tiket */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Layanan Tiket
            </h4>
            <ul className="space-y-2.5">
              {layananTiket.map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Bantuan & Informasi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Bantuan
            </h4>
            <ul className="space-y-2.5">
              {bantuan.map((item) => (
                <li key={item}>
                  <Link
                    href={item === "FAQ" ? "/faq" : item === "Hubungi Kami" ? "/hubungi-kami" : "#"}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} PT Kereta Api Indonesia (Persero).</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">Syarat Penggunaan</Link>
            <Link href="#" className="hover:text-white transition-colors underline underline-offset-2">Perlindungan dan Privasi Data</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Inline SVG Social Icons ──────────────────────────── */

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function ThreadsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M13.9997 12.31C13.9777 12.73 13.8827 13.143 13.7197 13.53C13.5863 13.825 13.3667 14.0725 13.0897 14.24C12.9037 14.34 12.6997 14.405 12.4897 14.43C12.1859 14.4893 11.8735 14.4893 11.5697 14.43C11.3707 14.3763 11.1839 14.2846 11.0197 14.16C10.9205 14.0725 10.8397 13.9661 10.782 13.8471C10.7242 13.7281 10.6907 13.5988 10.6832 13.4667C10.6758 13.3346 10.6946 13.2024 10.7386 13.0777C10.7827 12.9529 10.851 12.8382 10.9397 12.74C11.1261 12.5572 11.3571 12.4262 11.6097 12.36C11.8817 12.275 12.1647 12.235 12.4497 12.24C12.7097 12.2247 12.9697 12.2247 13.2297 12.24C13.4717 12.2587 13.7117 12.292 13.9497 12.34L13.9997 12.31Z" fill="white"></path><path d="M17 2H7C5.67392 2 4.40215 2.52678 3.46447 3.46447C2.52678 4.40215 2 5.67392 2 7V17C2 18.3261 2.52678 19.5979 3.46447 20.5355C4.40215 21.4732 5.67392 22 7 22H17C18.3261 22 19.5979 21.4732 20.5355 20.5355C21.4732 19.5979 22 18.3261 22 17V7C22 5.67392 21.4732 4.40215 20.5355 3.46447C19.5979 2.52678 18.3261 2 17 2ZM7.52 14.53C7.67762 15.0562 7.92088 15.5529 8.24 16C8.69555 16.6293 9.32449 17.1123 10.05 17.39C10.497 17.556 10.965 17.664 11.44 17.71C11.9067 17.7553 12.3733 17.7553 12.84 17.71C13.3835 17.6674 13.9151 17.5286 14.41 17.3C14.9693 17.0269 15.4482 16.6134 15.8 16.1C16.0112 15.7982 16.1507 15.4521 16.2079 15.0882C16.2651 14.7242 16.2385 14.3521 16.13 14C15.998 13.5548 15.7151 13.1694 15.33 12.91L15.13 12.77C15.13 12.86 15.13 12.94 15.08 13.02C15.01 13.47 14.86 13.902 14.64 14.3C14.4452 14.6565 14.1705 14.963 13.8373 15.1954C13.5042 15.4279 13.1218 15.5801 12.72 15.64C12.1914 15.7435 11.6455 15.716 11.13 15.56C10.7023 15.442 10.3128 15.2146 10 14.9C9.65706 14.5511 9.4421 14.0965 9.39 13.61C9.33991 13.1983 9.40721 12.7808 9.58415 12.4057C9.76108 12.0306 10.0404 11.7132 10.39 11.49C10.7537 11.2489 11.1615 11.0824 11.59 11C12.014 10.93 12.4407 10.9 12.87 10.91C13.2049 10.919 13.5389 10.9491 13.87 11H13.93C13.8857 10.7264 13.7944 10.4625 13.66 10.22C13.5632 10.0582 13.4343 9.91791 13.2813 9.80784C13.1282 9.69776 12.9542 9.62022 12.77 9.58C12.3301 9.44496 11.8599 9.44496 11.42 9.58C11.103 9.69212 10.8275 9.89786 10.63 10.17V10.24L9.63 9.55V9.48C10.0467 8.87598 10.681 8.45669 11.4 8.31C12.0132 8.17629 12.6506 8.20385 13.25 8.39C13.5861 8.4929 13.8972 8.66417 14.164 8.89304C14.4307 9.12192 14.6472 9.40346 14.8 9.72C14.976 10.079 15.095 10.464 15.15 10.86C15.178 11.0321 15.1947 11.2058 15.2 11.38L15.5 11.52C15.969 11.769 16.3837 12.109 16.72 12.52C17.066 12.947 17.293 13.457 17.38 14C17.451 14.328 17.475 14.665 17.45 15C17.3989 15.8326 17.0716 16.6243 16.52 17.25C15.8228 18.0743 14.8742 18.647 13.82 18.88C13.356 18.9784 12.8841 19.0352 12.41 19.05C11.9794 19.0681 11.548 19.0514 11.12 19C10.4258 18.9189 9.74988 18.7229 9.12 18.42C8.30818 18.0086 7.61854 17.3914 7.12 16.63C6.75152 16.0552 6.47172 15.4282 6.29 14.77C6.156 14.274 6.05933 13.7707 6 13.26V12C6 11.58 6 11.16 6.07 10.74C6.11117 10.2649 6.18805 9.79356 6.3 9.33C6.4526 8.74599 6.68835 8.18694 7 7.67C7.62538 6.55613 8.646 5.71751 9.86 5.32C10.2957 5.1719 10.7444 5.06477 11.2 5C11.7715 4.93491 12.3485 4.93491 12.92 5C13.6104 5.06385 14.2859 5.23947 14.92 5.52C15.8347 5.92345 16.6127 6.58342 17.16 7.42C17.5444 8.02348 17.8281 8.68545 18 9.38L16.82 9.7V9.62C16.6868 9.14648 16.4918 8.69257 16.24 8.27C15.7272 7.43701 14.9323 6.81596 14 6.52C13.5092 6.35346 12.9976 6.25586 12.48 6.23C12.0973 6.19846 11.7127 6.19846 11.33 6.23C10.7393 6.28784 10.1637 6.45038 9.63 6.71C8.94025 7.0702 8.37295 7.62706 8 8.31C7.74228 8.77804 7.55046 9.27945 7.43 9.8C7.32493 10.2236 7.2547 10.655 7.22 11.09C7.19393 11.5063 7.19393 11.9237 7.22 12.34C7.22538 13.0799 7.32621 13.8159 7.52 14.53Z" fill="white"></path><path d="M13.9997 12.31C13.9777 12.73 13.8827 13.143 13.7197 13.53C13.5863 13.825 13.3667 14.0725 13.0897 14.24C12.9037 14.34 12.6997 14.405 12.4897 14.43C12.1859 14.4893 11.8735 14.4893 11.5697 14.43C11.3707 14.3763 11.1839 14.2846 11.0197 14.16C10.9205 14.0725 10.8397 13.9661 10.782 13.8471C10.7242 13.7281 10.6907 13.5988 10.6832 13.4667C10.6758 13.3346 10.6946 13.2024 10.7386 13.0777C10.7827 12.9529 10.851 12.8382 10.9397 12.74C11.1261 12.5572 11.3571 12.4262 11.6097 12.36C11.8817 12.275 12.1647 12.235 12.4497 12.24C12.7097 12.2247 12.9697 12.2247 13.2297 12.24C13.4717 12.2587 13.7117 12.292 13.9497 12.34L13.9997 12.31Z" fill="white"></path>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
