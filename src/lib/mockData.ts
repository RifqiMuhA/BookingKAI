// ============================================================
// MOCK DATA — KAI Booking Redesign
// ============================================================

// ---- Stations ----
export interface Station {
  id: string;
  name: string;
  city: string;
  code: string;
  /** SVG coordinate (percentage of map container: 0-100) */
  x: number;
  y: number;
}

export const STATIONS: Station[] = [
  { id: "GMR", name: "Gambir", city: "Jakarta", code: "GMR", x: 24, y: 42 },
  { id: "PSE", name: "Pasar Senen", city: "Jakarta", code: "PSE", x: 25, y: 40 },
  { id: "BDO", name: "Bandung", city: "Bandung", code: "BDO", x: 27, y: 48 },
  { id: "KAC", name: "Kiaracondong", city: "Bandung", code: "KAC", x: 28, y: 49 },
  { id: "CN", name: "Cirebon", city: "Cirebon", code: "CN", x: 32, y: 44 },
  { id: "SMT", name: "Semarang Tawang", city: "Semarang", code: "SMT", x: 44, y: 38 },
  { id: "YK", name: "Yogyakarta", city: "Yogyakarta", code: "YK", x: 46, y: 47 },
  { id: "SLO", name: "Solo Balapan", city: "Solo", code: "SLO", x: 50, y: 47 },
  { id: "SBI", name: "Surabaya Gubeng", city: "Surabaya", code: "SBI", x: 63, y: 43 },
  { id: "SBY", name: "Surabaya Pasar Turi", city: "Surabaya", code: "SBY", x: 62, y: 41 },
  { id: "ML", name: "Malang", city: "Malang", code: "ML", x: 65, y: 53 },
  { id: "KAL", name: "Kalilurang", city: "Blitar", code: "KAL", x: 60, y: 55 },
  { id: "BJR", name: "Banyuwangi", city: "Banyuwangi", code: "BJR", x: 76, y: 52 },
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
  "Jakarta": "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=600&q=80",
  "Bandung": "https://images.unsplash.com/photo-1549473889-14f410d83298?w=600&q=80",
  "Surabaya": "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600&q=80",
  "Yogyakarta": "https://images.unsplash.com/photo-1582236372561-c85265ab753a?w=600&q=80",
  "Semarang": "https://images.unsplash.com/photo-1584067340632-15a98bf6862b?w=600&q=80",
  "Malang": "https://images.unsplash.com/photo-1604085444654-e0a5dbff4eb7?w=600&q=80",
  "Cirebon": "https://images.unsplash.com/photo-1620021617277-28565b95a8ee?w=600&q=80",
  "Banyuwangi": "https://images.unsplash.com/photo-1580228026190-2bd33e5c94bd?w=600&q=80",
  "Solo": "https://images.unsplash.com/photo-1584067340632-15a98bf6862b?w=600&q=80", // fallback using Semarang for now
};

export function getCityImage(city: string): string {
  return CITY_IMAGES[city] || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80";
}
