# Brief: Redesign Booking.kai.id

**Tipe:** Frontend build brief (untuk coding agent)
**Scope:** Tambah 6 fitur baru di atas flow booking existing, restyle sesuai brand kai.id

---

## 1. Ringkasan Proyek

Redesign booking.kai.id dengan menambahkan 6 fitur pada UI, tanpa mengubah alur booking inti (search → pilih jadwal → isi data penumpang → pembayaran). Semua komponen mengikuti design system di bagian 3.

**Prinsip penting:** Booking tetap **guest checkout** seperti web lama — user bisa langsung pesan tanpa login/register. Akun bersifat opsional, bukan gate wajib.

---

## 2. Fitur yang Dibangun

### 2.1 Diskon dengan Subscribe/Notifikasi
- Halaman promo dengan struktur:
  1. Hero/banner promo utama (1 promo unggulan, full-width, boleh pakai countdown kalau ada batas waktu)
  2. Filter/tab kategori promo (mis. "Semua", "Rute Favorit", "Diskon Member", "Promo Bank")
  3. Grid card promo — tiap card: judul, besaran diskon (badge oranye), periode berlaku, kode voucher dengan tombol "Copy", link "Syarat & Ketentuan" yang expand tanpa pindah halaman
  4. Subscribe section di bagian akhir halaman — input email saja (tidak perlu akun), CTA "Berlangganan"
- State tombol subscribe: belum subscribe / sudah subscribe ("Berlangganan ✓")
- Referensi pola: struktur kategori ala Eurostar Deals (eurostar.com/deals) + detail card kode voucher ala Traveloka (traveloka.com/en-id/promotion/promo-tiket-kereta)
- Klik card promo yang terikat rute tertentu → ke search form dengan rute/tanggal ter-prefill, jangan reset progress booking yang sedang berjalan kalau user datang dari mid-flow

### 2.2 Pilih Kursi via Ilustrasi Kereta
- Ganti tabel/dropdown kursi dengan denah kereta visual (grid kursi per gerbong, bisa diklik)
- 3 state kursi: kosong (klik-able), dipilih (highlight navy), terisi (disabled, abu-abu)
- Navigasi antar-gerbong (tab atau swipe)
- Menampilkan nomor kursi & harga per kursi jika ada perbedaan kelas

### 2.3 Pilih Lokasi/Rute via Peta 2D
- Trigger: pill full-width "Pilih Stasiun Lewat Peta Rute" di bawah card asal/tujuan pada form pemesanan
- Dibuka sebagai **halaman tersendiri (dedicated page)**, bukan modal/bottom sheet — referensi: Amtrak plan-your-trip
- **Teknologi: Leaflet.js + OpenStreetMap (OSM) tile** — open source, gratis, tidak perlu API key. Tile default pakai `tile.openstreetmap.org` untuk fase prototype; kalau traffic produksi tinggi, ganti ke provider tile berbasis OSM dengan free tier lebih besar (mis. MapTiler, Stadia Maps) — cukup ganti tile URL, kode Leaflet tidak berubah
- Isi halaman: search box asal (atas) dan tujuan (bawah) berurutan, toggle "Set sebagai ASAL/TUJUAN" untuk menentukan field mana yang aktif diisi, peta Leaflet dengan pin stasiun asli mengisi sebagian besar layar, tombol "Cari Kereta"/"Terapkan" di bagian bawah untuk konfirmasi lalu lanjut (balik ke form terisi atau langsung ke hasil pencarian — pilih salah satu, jangan dua-duanya)
- Layout responsive: desktop — panel search di kiri, peta dominan di kanan (mirip Amtrak); mobile — search box di atas, peta mengisi sisa layar di bawah (stacked)
- Pin stasiun terpilih pakai warna aksen oranye, pin lain navy/abu-abu netral
- **Data yang perlu disiapkan:** koordinat (lat/long) tiap stasiun KAI — mulai dari stasiun-stasiun utama dulu, tidak perlu lengkap semua di awal. Polyline rute/jalur kereta di atas peta bersifat opsional untuk fase awal, bisa ditambahkan belakangan setelah pin stasiun berfungsi. Sumber data: dataset resmi Kemenhub Hubnet (lat/lon siap pakai) dan/atau query Overpass API dari data OpenStreetMap
- Opsional (nice-to-have, ambil inspirasi dari Amtrak plan-your-trip): panel info stasiun singkat saat pin diklik — fasilitas yang tersedia (toilet, wifi, akses difabel, dll)
- **Skema warna peta:**
  ```
  --map-rail-line: #003C71;      /* rel/jalur kereta */
  --map-pin-default: #003C71;    /* pin stasiun belum dipilih */
  --map-pin-selected: #F58220;   /* pin stasiun asal/tujuan aktif */
  --map-cluster-badge: #003C71;  /* background angka saat beberapa stasiun berdekatan di-cluster jadi satu pin */
  ```

### 2.4 Kalender + Harga Sekaligus
- Kalender bulan yang menampilkan estimasi harga tiket langsung di tiap tanggal (bukan harus klik dulu)
- Highlight visual pada tanggal dengan harga termurah
- Klik tanggal → tampilkan ringkasan tanggal + harga terpilih

### 2.5 Chatbot / Virtual Assistant
- Bagian dari **Floating Action Stack** di pojok kanan bawah (lihat 2.7)
- Klik ikon assistant → buka panel chat
- Bubble chat: sistem (kiri, navy) vs user (kanan, putih/border)
- Quick reply buttons untuk pertanyaan umum (jadwal, refund, reschedule, FAQ)
- Tidak perlu logic AI backend — cukup scripted response / placeholder untuk fase awal

### 2.6 Accessibility Mode
- Bagian dari **Floating Action Stack** di pojok kanan bawah (lihat 2.7)
- Klik ikon accessibility → buka panel: toggle high contrast, slider/step ukuran font (normal/besar/lebih besar), opsional toggle reduce motion
- High contrast: background lebih gelap, teks putih murni, border lebih tegas
- Struktur HTML semantik + alt text + aria-label untuk screen reader
- Tombol ini sendiri harus accessible: aria-label jelas, bisa dijangkau & dioperasikan via keyboard, fokus terlihat

### 2.7 Floating Action Stack (wadah untuk 2.5 + 2.6)
- Posisi: pojok kanan bawah, di atas semua konten (fixed position)
- Berisi 2 ikon: **Virtual Assistant** (chat bubble) dan **Accessibility** (ikon person/aksesibilitas)
- Warna: navy `#003C71` sebagai base, bisa dibedakan sedikit per ikon (mis. accent border) supaya fungsinya kebeda
- **Pola responsive:**
  - **Desktop** — always-visible stack, kedua ikon langsung terlihat tersusun vertikal (tidak perlu klik dulu untuk expand)
  - **Mobile** — expandable FAB: satu tombol utama, klik dulu baru muncul 2 pilihan (assistant, accessibility), supaya tidak menutupi CTA utama di layar sempit (terutama di step pilih kursi & pembayaran)
- Tap target minimal ~44px per ikon
- Auto-hide saat user scroll ke bawah, muncul lagi saat scroll ke atas — supaya tidak menutupi CTA/konten
- Tidak boleh overlap dengan tombol CTA utama (mis. "Lanjutkan", "Bayar") di manapun posisinya

### 2.8 Form Pemesanan (Landing/Search)
- Toggle tipe perjalanan: **Sekali Jalan / Pulang-Pergi** — field tanggal kembali muncul/nonaktif sesuai pilihan
- Stasiun Asal & Tujuan — dengan tombol swap (↔) di tengah, terhubung ke peta modal (2.3)
- Tanggal keberangkatan (+ tanggal kembali jika pulang-pergi) — terintegrasi kalender+harga (2.4), field menampilkan preview harga singkat sebelum dibuka full calendar
- Jumlah penumpang — stepper dewasa (+bayi jika berlaku, karena tarif biasanya beda/gratis tanpa kursi)
- Kode promo/voucher — input collapsible, tersembunyi default agar form tidak penuh
- CTA utama "Cari Kereta"
- Rute populer / rute terakhir dicari — chip shortcut di bawah form

### 2.9 Hasil Pencarian
- Referensi pola: halaman search results Eurostar (eurostar.com), diadaptasi untuk konteks KAI
- **Sticky bar ringkasan pencarian** di paling atas — rute (asal → tujuan), tanggal, jumlah penumpang, plus link "Ubah Pencarian" agar user bisa edit tanpa balik ke landing/reload form dari nol
- **Strip tanggal horizontal** di bawah sticky bar — beberapa tanggal berdekatan (mis. H-2 sampai H+2 dari tanggal terpilih) ditampilkan sebagai tab, tiap tab menunjukkan harga termurah hari itu, bisa digeser/scroll. Ini pelengkap ringkas dari kalender+harga (2.4), bukan pengganti
- **Matriks jam keberangkatan × kelas** sebagai konten utama:
  - Baris = jam berangkat–tiba, durasi perjalanan
  - Kolom = kelas kereta (Ekonomi / Bisnis / Eksekutif)
  - Cell kosong/tidak tersedia ditandai jelas ("Tidak tersedia"), bukan dikosongkan begitu saja
  - Badge kecil pada cell: "Harga termurah" untuk opsi termurah di baris/kolom tsb, dan indikator sisa kursi (mis. "12 kursi tersisa") sebagai urgency info bila relevan
  - Header kolom kelas dibedakan lewat label & garis tipis (bukan warna-warni beda-beda per kelas), tetap konsisten dengan design system navy/oranye
- **Sidebar "Ringkasan Perjalanan"** (sticky di desktop, collapsible/bottom bar di mobile):
  - Total harga real-time, update begitu user pilih kereta+kelas
  - Tombol "Lanjutkan" — **disabled** selama belum ada kereta yang dipilih, kasih placeholder jelas ("Belum ada kereta dipilih")
  - Begitu kereta+kelas dipilih, tombol aktif dan lanjut ke step Pilih Kursi (3)

---

## 3. Design System

### Warna

```
--color-primary: #003C71;      /* navy - header, navbar, CTA utama, state aktif/terpilih */
--color-primary-dark: #001F3F; /* navy gelap - dipakai di accessibility mode */
--color-accent: #F58220;       /* orange - CTA sekunder, badge promo, highlight harga termurah */
--color-bg: #FFFFFF;
--color-bg-muted: #F5F6F8;
--color-bg-card: #EDEFF2;
--color-text: #1A202C;
--color-text-secondary: #4A5568;
--color-success: #2E7D32;      /* kursi tersedia */
--color-danger: #D32F2F;       /* kursi terisi / error */
--color-info-bg: #E8F0FE;
```

> Nilai hex ini estimasi berbasis brand resmi KAI (navy + orange), bukan hasil ekstraksi CSS langsung dari kai.id. Kalau butuh presisi, cek Inspect Element di kai.id lalu update variabel di atas.

### Tipografi

```
--font-primary: 'Zalando Sans Variable', 'Inter', sans-serif; /* dipakai untuk heading & body sekaligus, variable font (weight 200-900, width 75-125) */
--font-numeric: 'Zalando Sans Variable', sans-serif; /* aktifkan OpenType feature tabular-nums untuk harga/jam/kursi */
```

Load sebagai variable font (satu file, range weight/width lewat CSS), bukan static per-weight, supaya performa lebih ringan. Gunakan `'Inter'` sebagai fallback kalau font gagal load. Sumber: sama seperti font yang dipakai kai.id, gratis & open source (SIL OFL).

### Komponen dasar yang dipakai berulang
- Card (radius 12px, border tipis, shadow minimal)
- Badge (radius 6px, dipakai untuk "harga termurah", "promo", status kursi)
- Button primary (navy solid) / secondary (orange solid) / outline
- Bottom sheet / modal untuk mobile (kursi, chatbot, peta)

### Navbar (2 lapis, mengikuti pola kai.id tapi isi disesuaikan untuk konteks transaksional)

**Strip atas (utility, kecil, secondary)**
- FAQ/Bantuan
- Bahasa (ID/EN, jika perlu)
- Login/Daftar — kecil, non-mencolok, bukan CTA utama (selaras prinsip guest checkout)

**Navbar utama**
- Logo KAI (klik → landing/search)
- Cek Pesanan (lihat 6.3)
- Promo (lihat 2.1)
- Jadwal & Tarif *(opsional)*

Menu korporat ala kai.id (Tentang Kami, Keberlanjutan, Hubungan Investor, Publikasi, Heritage, Informasi Publik) **tidak** dipakai di navbar booking.kai.id — kalau dibutuhkan taruh di footer. Navbar utama harus fokus ke task completion (pesan tiket), bukan eksplorasi konten korporat.

Accessibility toggle **tidak** ada di navbar — pindah ke Floating Action Stack (lihat 2.7).

---

## 4. Di Luar Scope
- Real-time tracking posisi kereta
- AR Whoosh
- Integrasi AI/NLP nyata untuk chatbot (fase awal cukup scripted)

---

## 5. Alur Booking Existing (jangan diubah urutannya)

```
1. Search           → pilih stasiun asal, stasiun destinasi, jumlah penumpang, tanggal (TANPA login)
2. List hasil        → muncul pilihan kereta beserta harga per kereta
3. Pilih kursi       → user pilih kursi
4. Isi data penumpang → nama, no. identitas per penumpang, email (untuk kirim e-tiket)
5. Pembayaran        → user pilih metode pembayaran & bayar
6. Konfirmasi        → e-tiket/invoice dikirim ke email setelah pembayaran berhasil
```

Fitur baru **menempel/menyisip** ke step existing, tidak mengubah urutan atau logic transaksi di atas. Seluruh alur ini bisa diselesaikan **tanpa login**.

Login/Register hanya opsi tambahan, bukan step wajib — lihat bagian 6.

## 6. Halaman

### 6.1 Alur Booking Inti (guest, tanpa login)
| Halaman | Isi |
|---|---|
| Landing / Search | Form pesan: asal, tujuan, penumpang, tanggal — kalender+harga (2.4) menyisip di sini |
| Pilih Rute via Peta | Halaman tersendiri, dibuka dari pill "Pilih Stasiun Lewat Peta Rute" (2.3) |
| Hasil Pencarian | Sticky ringkasan pencarian, strip tanggal, matriks jam×kelas, sidebar ringkasan perjalanan (2.9) |
| Pilih Kursi | Denah kursi visual (2.2) |
| Isi Data Penumpang | Form nama, identitas, email |
| Ringkasan Pesanan | Recap rute, kursi, penumpang, total harga sebelum bayar |
| Pilih Metode Pembayaran | VA/QRIS/dsb |
| Halaman Pembayaran | Instruksi bayar + status pending |
| Konfirmasi | Sukses/gagal, trigger email e-tiket |

### 6.2 Auth (opsional, bukan gate — pola OTP, bukan email+password)
| Halaman | Catatan |
|---|---|
| Masuk/Daftar | **1 halaman saja**, gabungan login & register — bukan 3 halaman terpisah. Input nomor HP (atau email) → kirim OTP → verifikasi kode → kalau belum terdaftar otomatis jadi akun baru, kalau sudah terdaftar langsung masuk |

**Tidak ada halaman Register terpisah** — register terjadi otomatis di flow OTP yang sama saat nomor/email belum terdaftar.
**Tidak ada halaman Lupa Password** — karena tidak ada password yang perlu diingat, jadi tidak relevan.
Diakses lewat link kecil di strip atas navbar, bukan blocking screen. Bisa juga ditawarkan setelah pembayaran sukses ("Simpan sebagai akun?" — data penumpang & email sudah terisi, tinggal verifikasi OTP).

### 6.3 Cek Pesanan (pengganti "My Orders" untuk guest)
| Halaman | Isi |
|---|---|
| Cek Pesanan | Input kode booking + email → tampilkan detail/e-tiket, tanpa perlu login |
| Riwayat Pemesanan | Khusus user yang login — list semua tiket yang pernah dibeli otomatis |

### 6.4 Fitur Baru Lain
| Halaman | Catatan |
|---|---|
| Promo/Diskon | Card promo + tombol subscribe (2.1) — subscribe cukup pakai email, tidak perlu akun |

Chatbot (2.5) dan Accessibility mode (2.6) tidak perlu halaman sendiri — keduanya jadi satu Floating Action Stack (2.7) di pojok kanan bawah, berlaku di semua halaman termasuk sebelum login.

### 6.5 Pendukung
- FAQ/Bantuan — terhubung ke chatbot sebagai eskalasi
- 404 / Error page

---

## 7. Struktur Halaman yang Terdampak (mapping ke fitur baru)

| Step existing | Fitur baru yang menyisip | Perubahan |
|---|---|---|
| 1. Search — input stasiun asal/tujuan | Peta 2D pilih rute (2.3) | Tambah opsi peta di samping search box, titik stasiun bisa diklik jadi "dari"/"ke" |
| 1. Search — input tanggal | Kalender + harga (2.4) | Ganti date-picker polos jadi kalender yang langsung menampilkan estimasi harga per tanggal |
| 2. List hasil kereta + harga | — | Tidak berubah, hanya ikut restyle warna/font sesuai design system (bagian 3) |
| 3. Pilih kursi | Denah kursi visual (2.2) | Ganti komponen jadi ilustrasi kereta yang bisa diklik, ganti tabel/dropdown lama |
| 4. Isi data penumpang | — | Tidak berubah, hanya ikut restyle |
| 5. Pembayaran | — | Tidak berubah, hanya ikut restyle warna/font |
| 6. Konfirmasi / email | Opsi "Simpan sebagai akun?" | Setelah sukses, tawarkan buat akun ringan dari data yang sudah terisi |
| Halaman terpisah: Promo | Subscribe notifikasi (2.1) | Redesign card promo + tambah tombol subscribe |
| Global — semua halaman | Chatbot + Accessibility (2.5, 2.6, 2.7) | Floating Action Stack di kanan bawah, muncul di semua step |

---

## 8. Catatan Teknis
- Semua fitur baru harus tetap kompatibel dengan alur booking existing (tidak mengubah endpoint/API pembayaran)
- Prioritaskan mobile-first, karena mayoritas user booking.kai.id akses via HP
- State kursi & harga bisa pakai data dummy dulu jika API belum tersedia
- Booking flow tidak boleh mensyaratkan login di step manapun — session/guest identifier cukup pakai kode booking + email
- Login/Register tidak boleh muncul sebagai blocking modal/redirect paksa di tengah alur booking