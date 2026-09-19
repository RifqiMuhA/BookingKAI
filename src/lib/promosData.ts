// ============================================================
// DATA PROMO RESMI KAI — Shared Data
// ============================================================

export interface PromoItem {
  id: string;
  route: string;
  headline: string;
  tagline: string;
  description?: string;
  code: string;
  image: string;
  city: string; // Kota tujuan / relevan: Bandung, Yogyakarta, Surabaya, Malang, Semarang, Solo, Jakarta
  daysAgo: number; // Umur promo untuk filter periode (7 = 1 minggu, 30 = 1 bulan, 90 = 3 bulan, 180 = 6 bulan)
  category: "eksekutif" | "rute" | "bank" | "khusus";
  badge?: string;
  validUntil: string;
  minTransaction: string;
  eligibleTrains: string;
  quotaInfo?: string;
  terms: string[];
  discountPercent?: number;
  discountAmount?: number;
}

export const PROMOS_DATA: PromoItem[] = [
  {
    id: "promo-1",
    route: "Jakarta ke Bandung",
    headline: "Mulai dari Rp45.000",
    tagline: "Wisata kuliner, udara sejuk & liburan santai bebas macet bersama Argo Parahyangan.",
    description: "Nikmati perjalanan singkat yang menyenangkan menembus pegunungan Priangan dengan panorama alam yang memukau. Promo ini berlaku untuk perjalanan pulang-pergi antara Stasiun Gambir / Pasarsenen dan Stasiun Bandung / Kiaracondong.",
    code: "PARAHYANGAN",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bandung_View_dari_Gedung_Wisma_HSBC_Asia_Afrika_4.jpg/960px-Bandung_View_dari_Gedung_Wisma_HSBC_Asia_Afrika_4.jpg",
    city: "Bandung",
    daysAgo: 3,
    category: "rute",
    badge: "Promo Baru",
    validUntil: "Hingga 31 Oktober 2026",
    minTransaction: "Min. Transaksi Rp120.000",
    eligibleTrains: "KA Argo Parahyangan (Gambir - Bandung PP)",
    quotaInfo: "Tersedia 150 kursi promo setiap hari",
    terms: [
      "Berlaku untuk rute Gambir (GMR) ke Bandung (BDO) atau arah sebaliknya.",
      "Potongan harga langsung berlaku pada kelas Eksekutif dan Ekonomi Premium.",
      "Pemesanan tiket dapat dilakukan setiap hari selama kuota promo tersedia.",
      "Tiket promo dapat dibatalkan atau diubah jadwal sesuai aturan reduksi resmi KAI.",
      "Masukkan kode promo PARAHYANGAN pada formulir pemesanan tiket sebelum proses pembayaran."
    ],
    discountPercent: 20
  },
  {
    id: "promo-2",
    route: "Jakarta ke Yogyakarta",
    headline: "Mulai dari Rp180.000",
    tagline: "Menikmati senja Malioboro, kuliner gudeg, dan kekayaan budaya istimewa.",
    description: "Kembali ke kota budaya yang selalu dirindukan. Rasakan kenyamanan perjalanan santai melintasi pulau Jawa bersama rangkaian kereta unggulan KAI dengan fasilitas lengkap dan pelayanan ramah.",
    code: "JOGJAISTIMEWA",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Jogja_-_Tugu_Monument_%282025%29_-_img_06.jpg/960px-Jogja_-_Tugu_Monument_%282025%29_-_img_06.jpg",
    city: "Yogyakarta",
    daysAgo: 5,
    category: "rute",
    badge: "Paling Populer",
    validUntil: "Hingga 15 November 2026",
    minTransaction: "Min. Transaksi Rp250.000",
    eligibleTrains: "KA Taksaka, KA Fajar Utama Yk, KA Senja Utama Yk",
    quotaInfo: "Tersedia 200 kursi promo per jadwal",
    terms: [
      "Berlaku untuk perjalanan menuju Stasiun Yogyakarta (YK) atau Lempuyangan (LPN).",
      "Berlaku untuk kelas Eksekutif dan Bisnis reguler.",
      "Dapat digunakan untuk pemesanan tiket satu arah maupun pulang-pergi.",
      "Tidak dapat digabungkan dengan diskon reduksi lansia atau veteran.",
      "Masukkan kode promo JOGJAISTIMEWA sebelum menyelesaikan pesanan."
    ],
    discountPercent: 20
  },
  {
    id: "promo-3",
    route: "Surabaya ke Malang",
    headline: "Mulai dari Rp35.000",
    tagline: "Perjalanan sejuk melintasi pegunungan menuju Kota Bunga dan wisata alam.",
    description: "Liburan akhir pekan seru ke Kota Malang dan Kota Batu makin hemat. Duduk nyaman di kereta api tanpa khawatir lelah menyetir di jalan raya macet.",
    code: "EXPLOREMALANG",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Tugu_Malang.jpg/960px-Tugu_Malang.jpg",
    city: "Malang",
    daysAgo: 14,
    category: "rute",
    badge: "Rute Favorit",
    validUntil: "Hingga 30 November 2026",
    minTransaction: "Tanpa Minimal Transaksi",
    eligibleTrains: "KA Penataran, KA Jayabaya, KA Arjuno Ekspres",
    quotaInfo: "Kuota fleksibel setiap jadwal keberangkatan",
    terms: [
      "Berlaku untuk relasi Surabaya Gubeng / Pasar Turi ke Malang Kota Baru PP.",
      "Berlaku untuk semua hari keberangkatan termasuk akhir pekan.",
      "Tiket dapat dibatalkan atau diubah jadwal sesuai regulasi resmi KAI.",
      "Gunakan kode voucher EXPLOREMALANG saat pemesanan."
    ],
    discountPercent: 15
  },
  {
    id: "promo-4",
    route: "Jakarta ke Surabaya",
    headline: "Flash Sale Diskon 25%",
    tagline: "Kenyamanan premium menembus jalur lintas utara bersama KA Argo Bromo Anggrek.",
    description: "Perjalanan eksekutif legendaris antara dua kota metropolitan terbesar di Indonesia. Nikmati waktu istirahat yang tenang dengan kursi ergonomis kelas utama dan makanan restorasi khas kereta api.",
    code: "ARGOSALE",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Central_Surabaya_view_taken_from_JW_Marriott_Surabaya.jpg/960px-Central_Surabaya_view_taken_from_JW_Marriott_Surabaya.jpg",
    city: "Surabaya",
    daysAgo: 22,
    category: "eksekutif",
    badge: "Eksklusif Eksekutif",
    validUntil: "Setiap Selasa & Kamis",
    minTransaction: "Tanpa Minimal Transaksi",
    eligibleTrains: "KA Argo Bromo Anggrek, KA Sembrani, KA Bima",
    quotaInfo: "Terbatas 100 kursi promo per rangkaian",
    terms: [
      "Berlaku khusus untuk kelas Eksekutif reguler rute Jakarta - Surabaya PP.",
      "Pemesanan dibuka setiap hari Selasa dan Kamis pukul 09.00 - 17.00 WIB.",
      "Kuota terbatas 100 kursi promo per keberangkatan kereta.",
      "Masukkan kode ARGOSALE pada kolom voucher pemesanan."
    ],
    discountPercent: 25
  },
  {
    id: "promo-5",
    route: "Semarang ke Solo",
    headline: "Mulai dari Rp25.000",
    tagline: "Jelajahi wisata sejarah Lawang Sewu hingga keraton dan batik khas Solo.",
    description: "Menghubungkan dua jantung kebudayaan Jawa Tengah secara cepat dan terjangkau. Pilihan tepat untuk perjalanan dinas, reuni, maupun belanja oleh-oleh khas nusantara.",
    code: "JATENGHEBAT",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Lawang_Sewu_in_Semarang_City.jpg/960px-Lawang_Sewu_in_Semarang_City.jpg",
    city: "Semarang",
    daysAgo: 45,
    category: "rute",
    badge: "Jelajah Jawa",
    validUntil: "Hingga 31 Oktober 2026",
    minTransaction: "Min. Transaksi Rp50.000",
    eligibleTrains: "KA Joglosemarkerto, KA Kaligung, KA Banyubiru",
    quotaInfo: "Kuota harian reguler",
    terms: [
      "Berlaku untuk rute penghubung Semarang Tawang/Poncol - Solo Balapan PP.",
      "Potongan tarif otomatis dihitung setelah memasukkan kode voucher.",
      "Berlaku untuk pemesanan secara daring melalui portal resmi KAI.",
      "Salin kode JATENGHEBAT untuk mengaktifkan potongan harga."
    ],
    discountPercent: 20
  },
  {
    id: "promo-6",
    route: "Bandung ke Solo Balapan",
    headline: "Mulai dari Rp95.000",
    tagline: "Menyusuri panorama eksotis jalur selatan pegunungan Priangan ke Kota Bengawan.",
    description: "Salah satu rute kereta terindah di Indonesia yang menyajikan pemandangan lereng gunung berhawa sejuk, jembatan tinggi peninggalan kolonial, dan hamparan sawah bertingkat.",
    code: "LODAYASOLO",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Surakarta_City_Hall.jpg/960px-Surakarta_City_Hall.jpg",
    city: "Solo",
    daysAgo: 60,
    category: "rute",
    badge: "Jalur Selatan",
    validUntil: "Hingga 30 November 2026",
    minTransaction: "Min. Transaksi Rp150.000",
    eligibleTrains: "KA Lodaya, KA Malabar",
    quotaInfo: "Tersedia 80 kursi promo per perjalanan",
    terms: [
      "Berlaku untuk perjalanan rute Bandung - Solo Balapan PP.",
      "Berlaku untuk kelas Eksekutif dan Ekonomi komersial.",
      "Masukkan kode promo LODAYASOLO pada formulir pemesanan tiket."
    ],
    discountPercent: 20
  },
  {
    id: "promo-7",
    route: "Semua Rute ke Jakarta",
    headline: "Diskon Tiket Rp75.000",
    tagline: "Kemudahan mobilitas bisnis dan liburan ke pusat ibu kota bersama armada KAI.",
    description: "Solusi cepat dan bebas macet untuk tiba di jantung kota Jakarta tepat waktu. Terintegrasi langsung dengan Commuter Line, MRT, dan LRT di berbagai stasiun penghubung.",
    code: "METROJAKARTA",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Bundaran_Hotel_Indonesia_%282025%29_%28cropped%29.jpg/960px-Bundaran_Hotel_Indonesia_%282025%29_%28cropped%29.jpg",
    city: "Jakarta",
    daysAgo: 80,
    category: "eksekutif",
    badge: "Bisnis & Wisata",
    validUntil: "Hingga 31 Desember 2026",
    minTransaction: "Min. Transaksi Rp200.000",
    eligibleTrains: "Seluruh KA Komersial tujuan Stasiun Gambir & Pasar Senen",
    quotaInfo: "Berlaku untuk semua relasi masuk Jakarta",
    terms: [
      "Berlaku untuk keberangkatan dari kota mana pun menuju Stasiun Gambir / Pasar Senen.",
      "Potongan langsung Rp75.000 per kode booking.",
      "Kode voucher METROJAKARTA wajib diisi saat reservasi tiket."
    ],
    discountAmount: 75000
  },
  {
    id: "promo-8",
    route: "Semua Kota di Pulau Jawa",
    headline: "Cashback QRIS & VA 20%",
    tagline: "Hemat bertransaksi dengan metode pembayaran Bank & Dompet Digital favoritmu.",
    description: "Nikmati kemudahan bayar tiket kereta api tanpa antre di stasiun. Dapatkan cashback instan ke rekening atau dompet digital Anda untuk setiap transaksi pembelian tiket resmi.",
    code: "KAIHEMAT",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Monumen_Bahari_Tegal.jpg/960px-Monumen_Bahari_Tegal.jpg",
    city: "semua",
    daysAgo: 120,
    category: "bank",
    badge: "Semua Perjalanan",
    validUntil: "Hingga 31 Desember 2026",
    minTransaction: "Min. Transaksi Rp150.000",
    eligibleTrains: "Seluruh Perjalanan KA Jarak Jauh & Menengah",
    quotaInfo: "Maksimal 2x transaksi per pengguna",
    terms: [
      "Berlaku untuk pembayaran menggunakan QRIS dan Virtual Account perbankan terdaftar.",
      "Cashback 20% maksimal Rp40.000 dikembalikan dalam waktu 1x24 jam.",
      "Maksimal 2 kali penggunaan voucher per akun selama periode promo.",
      "Gunakan kode voucher KAIHEMAT saat memilih metode pembayaran."
    ],
    discountPercent: 20
  }
];

export function getPromoById(id: string): PromoItem | undefined {
  return PROMOS_DATA.find((p) => p.id === id);
}

export function getPromoByCode(code?: string | null): PromoItem | undefined {
  if (!code) return undefined;
  const clean = code.trim().toUpperCase();
  return PROMOS_DATA.find((p) => p.code.toUpperCase() === clean);
}

export function isRouteEligibleForPromo(
  code?: string | null,
  originCode?: string | null,
  destCode?: string | null
): {
  isEligible: boolean;
  promo?: PromoItem;
  reason?: string;
  expectedRoute?: string;
} {
  const promo = getPromoByCode(code);
  if (!promo) {
    return { isEligible: false };
  }

  // Jika stasiun asal dan tujuan belum diisi, anggap eligible sementara
  if (!originCode && !destCode) {
    return { isEligible: true, promo };
  }

  const o = (originCode || "").toUpperCase();
  const d = (destCode || "").toUpperCase();

  const isJakarta = (c: string) => ["GMR", "PSE", "JNG"].includes(c);
  const isBandung = (c: string) => ["BDO", "BD", "KAC"].includes(c);
  const isJogja = (c: string) => ["YK", "LPN"].includes(c);
  const isSurabaya = (c: string) => ["SBI", "SBY"].includes(c);
  const isMalang = (c: string) => ["ML"].includes(c);
  const isSemarang = (c: string) => ["SMT", "SMC"].includes(c);
  const isSolo = (c: string) => ["SLO"].includes(c);

  switch (promo.code) {
    case "PARAHYANGAN":
      if ((isJakarta(o) && isBandung(d)) || (isBandung(o) && isJakarta(d))) {
        return { isEligible: true, promo };
      }
      return {
        isEligible: false,
        promo,
        expectedRoute: "Jakarta (Gambir/Pasar Senen) ↔ Bandung (PP)",
        reason: "Kode promo PARAHYANGAN hanya berlaku untuk relasi Jakarta ↔ Bandung (PP)."
      };

    case "JOGJAISTIMEWA":
      if ((isJakarta(o) && isJogja(d)) || (isJogja(o) && isJakarta(d))) {
        return { isEligible: true, promo };
      }
      return {
        isEligible: false,
        promo,
        expectedRoute: "Jakarta ↔ Yogyakarta (PP)",
        reason: "Kode promo JOGJAISTIMEWA hanya berlaku untuk relasi Jakarta ↔ Yogyakarta (PP)."
      };

    case "EXPLOREMALANG":
      if ((isSurabaya(o) && isMalang(d)) || (isMalang(o) && isSurabaya(d))) {
        return { isEligible: true, promo };
      }
      return {
        isEligible: false,
        promo,
        expectedRoute: "Surabaya ↔ Malang (PP)",
        reason: "Kode promo EXPLOREMALANG hanya berlaku untuk relasi Surabaya ↔ Malang (PP)."
      };

    case "ARGOSALE":
      if ((isJakarta(o) && isSurabaya(d)) || (isSurabaya(o) && isJakarta(d))) {
        return { isEligible: true, promo };
      }
      return {
        isEligible: false,
        promo,
        expectedRoute: "Jakarta ↔ Surabaya (PP)",
        reason: "Kode promo ARGOSALE hanya berlaku untuk relasi Jakarta ↔ Surabaya (PP)."
      };

    case "JATENGHEBAT":
      if ((isSemarang(o) && isSolo(d)) || (isSolo(o) && isSemarang(d))) {
        return { isEligible: true, promo };
      }
      return {
        isEligible: false,
        promo,
        expectedRoute: "Semarang ↔ Solo Balapan (PP)",
        reason: "Kode promo JATENGHEBAT hanya berlaku untuk relasi Semarang ↔ Solo Balapan (PP)."
      };

    case "LODAYASOLO":
      if ((isBandung(o) && isSolo(d)) || (isSolo(o) && isBandung(d))) {
        return { isEligible: true, promo };
      }
      return {
        isEligible: false,
        promo,
        expectedRoute: "Bandung ↔ Solo Balapan (PP)",
        reason: "Kode promo LODAYASOLO hanya berlaku untuk relasi Bandung ↔ Solo Balapan (PP)."
      };

    case "METROJAKARTA":
      if (isJakarta(d) && !isJakarta(o)) {
        return { isEligible: true, promo };
      }
      return {
        isEligible: false,
        promo,
        expectedRoute: "Semua Kota Asal → Menuju Jakarta (Gambir/Pasar Senen)",
        reason: "Kode promo METROJAKARTA hanya berlaku untuk perjalanan menuju Jakarta."
      };

    case "KAIHEMAT":
      return { isEligible: true, promo };

    default:
      return { isEligible: true, promo };
  }
}

export function calculatePromoDiscount(
  originalPrice: number,
  code?: string | null,
  originCode?: string | null,
  destCode?: string | null
): {
  discountAmount: number;
  finalPrice: number;
  promo?: PromoItem;
  isEligible: boolean;
  reason?: string;
  expectedRoute?: string;
} {
  const eligibility = isRouteEligibleForPromo(code, originCode, destCode);
  if (!eligibility.isEligible || !eligibility.promo || originalPrice <= 0) {
    return {
      discountAmount: 0,
      finalPrice: originalPrice,
      promo: eligibility.promo,
      isEligible: false,
      reason: eligibility.reason,
      expectedRoute: eligibility.expectedRoute
    };
  }

  const promo = eligibility.promo;
  let discount = 0;
  if (promo.discountAmount) {
    discount = Math.min(originalPrice, promo.discountAmount);
  } else if (promo.discountPercent) {
    discount = Math.round((originalPrice * promo.discountPercent) / 100);
  } else {
    discount = Math.round(originalPrice * 0.2); // default 20%
  }

  return {
    discountAmount: discount,
    finalPrice: Math.max(0, originalPrice - discount),
    promo,
    isEligible: true
  };
}
