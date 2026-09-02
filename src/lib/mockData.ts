// ============================================================
// MOCK DATA — KAI Booking Redesign
// ============================================================

// ---- Stations ----
export interface Station {
  id: string;
  name: string;
  city: string;
  code: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
}

export const STATIONS: Station[] = [
  { id: "GMR", name: "Gambir", city: "Jakarta", code: "GMR", x: 24, y: 42, lat: -6.1767, lng: 106.8306 },
  { id: "PSE", name: "Pasar Senen", city: "Jakarta", code: "PSE", x: 25, y: 40, lat: -6.1748, lng: 106.8444 },
  { id: "JNG", name: "Jatinegara", city: "Jakarta", code: "JNG", x: 26, y: 41, lat: -6.2150, lng: 106.8681 },
  { id: "BDO", name: "Bandung", city: "Bandung", code: "BDO", x: 27, y: 48, lat: -6.9142, lng: 107.6022 },
  { id: "KAC", name: "Kiaracondong", city: "Bandung", code: "KAC", x: 28, y: 49, lat: -6.9249, lng: 107.6464 },
  { id: "CN", name: "Cirebon", city: "Cirebon", code: "CN", x: 32, y: 44, lat: -6.7053, lng: 108.5554 },
  { id: "TG", name: "Tegal", city: "Tegal", code: "TG", x: 35, y: 40, lat: -6.8673, lng: 109.1428 },
  { id: "PK", name: "Pekalongan", city: "Pekalongan", code: "PK", x: 38, y: 39, lat: -6.8890, lng: 109.6644 },
  { id: "SMT", name: "Semarang Tawang", city: "Semarang", code: "SMT", x: 44, y: 38, lat: -6.9644, lng: 110.4279 },
  { id: "SMC", name: "Semarang Poncol", city: "Semarang", code: "SMC", x: 43, y: 38, lat: -6.9729, lng: 110.4137 },
  { id: "CU", name: "Cepu", city: "Blora", code: "CU", x: 53, y: 40, lat: -7.1517, lng: 111.5833 },
  { id: "BJ", name: "Bojonegoro", city: "Bojonegoro", code: "BJ", x: 56, y: 41, lat: -7.1611, lng: 111.8847 },
  { id: "PWT", name: "Purwokerto", city: "Purwokerto", code: "PWT", x: 38, y: 48, lat: -7.4259, lng: 109.2205 },
  { id: "KYA", name: "Kroya", city: "Cilacap", code: "KYA", x: 40, y: 50, lat: -7.6288, lng: 109.2536 },
  { id: "KTA", name: "Kutoarjo", city: "Purworejo", code: "KTA", x: 43, y: 49, lat: -7.7259, lng: 109.9118 },
  { id: "YK", name: "Yogyakarta", city: "Yogyakarta", code: "YK", x: 46, y: 47, lat: -7.7892, lng: 110.3636 },
  { id: "LPN", name: "Lempuyangan", city: "Yogyakarta", code: "LPN", x: 47, y: 47, lat: -7.7901, lng: 110.3756 },
  { id: "SLO", name: "Solo Balapan", city: "Solo", code: "SLO", x: 50, y: 47, lat: -7.5570, lng: 110.8214 },
  { id: "MN", name: "Madiun", city: "Madiun", code: "MN", x: 55, y: 46, lat: -7.6186, lng: 111.5244 },
  { id: "JG", name: "Jombang", city: "Jombang", code: "JG", x: 59, y: 45, lat: -7.5583, lng: 112.2335 },
  { id: "MR", name: "Mojokerto", city: "Mojokerto", code: "MR", x: 61, y: 44, lat: -7.4722, lng: 112.4337 },
  { id: "SBI", name: "Surabaya Gubeng", city: "Surabaya", code: "SBI", x: 63, y: 43, lat: -7.2654, lng: 112.7520 },
  { id: "SBY", name: "Surabaya Pasar Turi", city: "Surabaya", code: "SBY", x: 62, y: 41, lat: -7.2458, lng: 112.7317 },
  { id: "SDA", name: "Sidoarjo", city: "Sidoarjo", code: "SDA", x: 63, y: 45, lat: -7.4568, lng: 112.7214 },
  { id: "ML", name: "Malang", city: "Malang", code: "ML", x: 65, y: 53, lat: -7.9774, lng: 112.6370 },
  { id: "PB", name: "Probolinggo", city: "Probolinggo", code: "PB", x: 68, y: 49, lat: -7.7424, lng: 113.2166 },
  { id: "JR", name: "Jember", city: "Jember", code: "JR", x: 70, y: 53, lat: -8.1633, lng: 113.7027 },
  { id: "KAL", name: "Kalilurang", city: "Blitar", code: "KAL", x: 60, y: 55, lat: -8.1026, lng: 112.1645 },
  { id: "BJR", name: "Banyuwangi", city: "Banyuwangi", code: "BJR", x: 76, y: 52, lat: -8.1400, lng: 114.3989 },
];

// ---- Train Schedules ----
export interface TrainSchedule {
  id: string;
  name: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  class: "Eksekutif" | "Bisnis" | "Ekonomi";
  price: number;
  availableSeats: number;
  origin: string;
  destination: string;
}

export const TRAIN_SCHEDULES: TrainSchedule[] = [
  {
    id: "T001",
    name: "Argo Bromo Anggrek",
    departureTime: "06:00",
    arrivalTime: "12:30",
    duration: "6j 30m",
    class: "Eksekutif",
    price: 750000,
    availableSeats: 24,
    origin: "GMR",
    destination: "SBI",
  },
  {
    id: "T002",
    name: "Argo Parahyangan",
    departureTime: "07:30",
    arrivalTime: "10:15",
    duration: "2j 45m",
    class: "Eksekutif",
    price: 250000,
    availableSeats: 12,
    origin: "GMR",
    destination: "BDO",
  },
  {
    id: "T003",
    name: "Gajayana",
    departureTime: "08:00",
    arrivalTime: "19:00",
    duration: "11j 00m",
    class: "Eksekutif",
    price: 600000,
    availableSeats: 8,
    origin: "GMR",
    destination: "ML",
  },
  {
    id: "T004",
    name: "Sancaka",
    departureTime: "09:15",
    arrivalTime: "16:45",
    duration: "7j 30m",
    class: "Bisnis",
    price: 350000,
    availableSeats: 40,
    origin: "YK",
    destination: "SBI",
  },
  {
    id: "T005",
    name: "Lodaya",
    departureTime: "10:00",
    arrivalTime: "13:00",
    duration: "3j 00m",
    class: "Bisnis",
    price: 180000,
    availableSeats: 56,
    origin: "BDO",
    destination: "YK",
  },
  {
    id: "T006",
    name: "Progo",
    departureTime: "11:45",
    arrivalTime: "23:00",
    duration: "11j 15m",
    class: "Ekonomi",
    price: 99000,
    availableSeats: 72,
    origin: "PSE",
    destination: "YK",
  },
  {
    id: "T007",
    name: "Tawang Jaya",
    departureTime: "14:00",
    arrivalTime: "21:30",
    duration: "7j 30m",
    class: "Ekonomi",
    price: 120000,
    availableSeats: 80,
    origin: "GMR",
    destination: "SMT",
  },
  {
    id: "T008",
    name: "Argo Wilis",
    departureTime: "17:00",
    arrivalTime: "04:30",
    duration: "11j 30m",
    class: "Eksekutif",
    price: 550000,
    availableSeats: 16,
    origin: "BDO",
    destination: "SBI",
  },
];

// ---- Seat Map per Gerbong ----
export type SeatStatus = "available" | "occupied";

export interface Seat {
  id: string; // e.g. "1A"
  row: number;
  col: "A" | "B" | "C" | "D";
  status: SeatStatus;
}

function generateCarriage(occupied: string[]): Seat[] {
  const seats: Seat[] = [];
  for (let row = 1; row <= 12; row++) {
    for (const col of ["A", "B", "C", "D"] as const) {
      const id = `${row}${col}`;
      seats.push({ id, row, col, status: occupied.includes(id) ? "occupied" : "available" });
    }
  }
  return seats;
}

export const SEAT_MAP: { carriageNumber: number; seats: Seat[] }[] = [
  {
    carriageNumber: 1,
    seats: generateCarriage(["1A", "1B", "2C", "3A", "4D", "5B", "6A", "6C", "7A", "8B", "9D", "10A"]),
  },
  {
    carriageNumber: 2,
    seats: generateCarriage(["1C", "2A", "2D", "3B", "4A", "4C", "5D", "7B", "8A", "9C", "10D"]),
  },
  {
    carriageNumber: 3,
    seats: generateCarriage(["1A", "1B", "1C", "1D", "2A", "2B", "3C", "4A", "5B", "5C", "6D"]),
  },
];

// ---- Price by Date ----
/** Returns a price map for the given month/year. Keys: "YYYY-MM-DD" */
export function getPricesByMonth(year: number, month: number): Record<string, number> {
  const prices: Record<string, number> = {};
  const daysInMonth = new Date(year, month, 0).getDate();
  const basePrices = [99000, 120000, 150000, 180000, 250000, 300000, 350000, 450000];

  // Deterministic pseudo-random using day seed
  for (let day = 1; day <= daysInMonth; day++) {
    const seed = (day * 7 + month * 13 + year) % basePrices.length;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    prices[dateStr] = basePrices[seed];
  }
  return prices;
}

// ---- Popular Routes ----
export const POPULAR_ROUTES = [
  { from: "GMR", to: "BDO", label: "Jakarta → Bandung" },
  { from: "GMR", to: "YK", label: "Jakarta → Yogyakarta" },
  { from: "GMR", to: "SBI", label: "Jakarta → Surabaya" },
  { from: "BDO", to: "SBI", label: "Bandung → Surabaya" },
  { from: "YK", to: "SBI", label: "Yogya → Surabaya" },
  { from: "GMR", to: "SMT", label: "Jakarta → Semarang" },
];

// ---- Payment Methods ----
export const PAYMENT_METHODS = [
  {
    id: "bca",
    group: "Transfer Bank",
    name: "BCA Virtual Account",
    logo: "🏦",
    fee: 4000,
  },
  {
    id: "bni",
    group: "Transfer Bank",
    name: "BNI Virtual Account",
    logo: "🏦",
    fee: 4000,
  },
  {
    id: "mandiri",
    group: "Transfer Bank",
    name: "Mandiri Virtual Account",
    logo: "🏦",
    fee: 4000,
  },
  {
    id: "bri",
    group: "Transfer Bank",
    name: "BRI Virtual Account",
    logo: "🏦",
    fee: 4000,
  },
  {
    id: "qris",
    group: "QRIS",
    name: "QRIS (Semua E-Wallet)",
    logo: "📱",
    fee: 0,
  },
  {
    id: "alfamart",
    group: "Gerai Ritel",
    name: "Alfamart",
    logo: "🏪",
    fee: 5000,
  },
  {
    id: "indomaret",
    group: "Gerai Ritel",
    name: "Indomaret",
    logo: "🏪",
    fee: 5000,
  },
];

// ---- Helpers ----
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getStationByCode(code: string): Station | undefined {
  return STATIONS.find((s) => s.code === code);
}

// ---- City Backgrounds ----
export const CITY_IMAGES: Record<string, string> = {
  // Real Wikipedia Images for specific cities
  "Jakarta": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Bundaran_Hotel_Indonesia_%282025%29_%28cropped%29.jpg/960px-Bundaran_Hotel_Indonesia_%282025%29_%28cropped%29.jpg",
  "Bandung": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bandung_View_dari_Gedung_Wisma_HSBC_Asia_Afrika_4.jpg/960px-Bandung_View_dari_Gedung_Wisma_HSBC_Asia_Afrika_4.jpg",
  "Surabaya": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Central_Surabaya_view_taken_from_JW_Marriott_Surabaya.jpg/960px-Central_Surabaya_view_taken_from_JW_Marriott_Surabaya.jpg",
  "Yogyakarta": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Jogja_-_Tugu_Monument_%282025%29_-_img_06.jpg/960px-Jogja_-_Tugu_Monument_%282025%29_-_img_06.jpg",
  "Semarang": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Lawang_Sewu_in_Semarang_City.jpg/960px-Lawang_Sewu_in_Semarang_City.jpg",
  "Malang": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Tugu_Malang.jpg/960px-Tugu_Malang.jpg",
  "Cirebon": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Sanctuary_of_Ong_Tien.jpg/960px-Sanctuary_of_Ong_Tien.jpg",
  "Tegal": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Monumen_Bahari_Tegal.jpg/960px-Monumen_Bahari_Tegal.jpg",
  "Pekalongan": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Museum_Batik_Pekalongan_-_Jawa_Tengah.jpg/960px-Museum_Batik_Pekalongan_-_Jawa_Tengah.jpg",
  "Purwokerto": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/View_of_the_General_Gatot_Subroto_Monument.jpg/960px-View_of_the_General_Gatot_Subroto_Monument.jpg",
  "Madiun": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Kantor_Pemerintahan_Kota_Madiun_tahun_2020.jpg/960px-Kantor_Pemerintahan_Kota_Madiun_tahun_2020.jpg",
  "Mojokerto": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Sunrise_Mall_Mojokerto.jpg/960px-Sunrise_Mall_Mojokerto.jpg",
  "Probolinggo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Gereja_Merah%2C_Kota_Probolinggo%2C_Jawa_Timur.jpg/960px-Gereja_Merah%2C_Kota_Probolinggo%2C_Jawa_Timur.jpg",
  "Blitar": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/C9421_Blitar_-_Monumen_Trisula.jpg/960px-C9421_Blitar_-_Monumen_Trisula.jpg",
  "Solo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Surakarta_City_Hall.jpg/960px-Surakarta_City_Hall.jpg",
  
  // High quality Unsplash representations for the rest
  "Banyuwangi": "https://images.unsplash.com/photo-1580228026190-2bd33e5c94bd?w=600&q=80",
  "Blora": "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600&q=80",
  "Bojonegoro": "https://images.unsplash.com/photo-1582236372561-c85265ab753a?w=600&q=80",
  "Cilacap": "https://images.unsplash.com/photo-1584067340632-15a98bf6862b?w=600&q=80",
  "Purworejo": "https://images.unsplash.com/photo-1604085444654-e0a5dbff4eb7?w=600&q=80",
  "Jombang": "https://images.unsplash.com/photo-1620021617277-28565b95a8ee?w=600&q=80",
  "Sidoarjo": "https://images.unsplash.com/photo-1549473889-14f410d83298?w=600&q=80",
  "Jember": "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=600&q=80"
};

export function getCityImage(city: string): string {
  // Use generic nature fallback for unknown cities
  return CITY_IMAGES[city] || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80";
}
