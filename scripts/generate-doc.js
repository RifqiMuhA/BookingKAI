const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ImageRun,
  ShadingType
} = require('docx');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'public', 'screenshots');

function getImage(filename, width = 240, height = 150) {
  const filePath = path.join(SCREENSHOTS_DIR, filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new ImageRun({
          data: data,
          transformation: {
            width: width,
            height: height
          }
        })
      ]
    });
  }
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: `[Screenshot: ${filename}]`, italics: true, color: "888888" })]
  });
}

function createHeading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 28,
        color: "003C71",
        font: "Times New Roman"
      })
    ]
  });
}

function createHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 24,
        color: "003C71",
        font: "Times New Roman"
      })
    ]
  });
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 80, line: 276 },
    children: [
      new TextRun({
        text: text,
        size: 22,
        font: "Times New Roman",
        ...options
      })
    ]
  });
}

function createQA(qNumber, question, answer) {
  return [
    new Paragraph({
      spacing: { before: 140, after: 40 },
      children: [
        new TextRun({
          text: `${qNumber}. ${question}`,
          bold: true,
          size: 22,
          color: "003C71",
          font: "Times New Roman"
        })
      ]
    }),
    new Paragraph({
      spacing: { before: 40, after: 100, line: 276 },
      children: [
        new TextRun({
          text: answer,
          size: 22,
          font: "Times New Roman"
        })
      ]
    })
  ];
}

async function generate() {
  console.log("Generating Word document...");

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Times New Roman",
            size: 22,
            color: "111111"
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        children: [
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 100 },
            children: [
              new TextRun({
                text: "LAPORAN TUGAS INTERAKSI MANUSIA DAN KOMPUTER (IMK)",
                bold: true,
                size: 32,
                color: "003C71",
                font: "Times New Roman"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 80 },
            children: [
              new TextRun({
                text: "ANALISIS DAN REDESAIN FITUR INFORMATION SEARCH",
                bold: true,
                size: 26,
                color: "F58220",
                font: "Times New Roman"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 300 },
            children: [
              new TextRun({
                text: "Studi Kasus: Sistem Reservasi Tiket Kereta Api Indonesia (Booking KAI)",
                italics: true,
                size: 22,
                font: "Times New Roman"
              })
            ]
          }),

          // Metadata Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "F3F4F6" },
                    margins: { top: 120, bottom: 120, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Mata Kuliah\t: ", bold: true }),
                          new TextRun("Interaksi Manusia dan Komputer (IMK)")
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Materi Pokok\t: ", bold: true }),
                          new TextRun("Sub-CPMK 8 & Sub-CPMK 9 — Information Search & Retrieval")
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Objek Studi\t: ", bold: true }),
                          new TextRun("Website booking.kai.id (Eksisting) vs Booking KAI (Redesign)")
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 200, after: 100 } }),

          // 1. IDENTIFIKASI FITUR
          createHeading1("1. IDENTIFIKASI FITUR"),
          createParagraph("1.1. Nama Aplikasi / Website", { bold: true }),
          createParagraph("Website Pemesanan Tiket Booking KAI (Redesain dari kanal digital resmi PT Kereta Api Indonesia, booking.kai.id). Prototipe interaktif dibangun menggunakan kerangka kerja Next.js dan Tailwind CSS dengan identitas visual khas KAI (Navy #003C71 dan Oranye #F58220)."),

          createParagraph("1.2. Fitur yang Dianalisis", { bold: true }),
          createParagraph("Sistem Terpadu Penemuan Informasi (Integrated Information Search System), yang mencakup: (1) Pencarian Jadwal Tiket Kereta Api terstruktur, (2) Smart Suggestion & Autocomplete Stasiun, (3) Navigasi Spasial Rute Kereta Api via Peta Interaktif Pulau Jawa, (4) Panel Penyaringan (Filter) Multi-Kategori dan Pengurutan (Sorting) Dinamis, (5) Pencarian Promo & Penawaran Khusus, serta (6) Pencarian Dokumen Pengetahuan & Bantuan Perjalanan (FAQ Knowledge Base)."),

          createParagraph("1.3. Tujuan Fitur", { bold: true }),
          createParagraph("Memfasilitasi calon penumpang untuk merumuskan kueri pencarian, menemukan, menyaring, membandingkan tarif, serta memilih jadwal perjalanan kereta api antarkota yang paling sesuai dengan kebutuhan waktu dan anggaran mereka secara cepat, efisien, dan bebas friksi kognitif (cognitive overload)."),

          createParagraph("1.4. Informasi yang Ingin Ditemukan Pengguna (Information Needs)", { bold: true }),
          createParagraph("• Informasi Perjalanan: Ketersediaan jadwal keberangkatan dan kedatangan, stasiun asal-tujuan, stasiun singgah, dan visualisasi jalur rel geografis yang dilalui.\n• Informasi Fasilitas & Kuota: Kelas kereta api (Ekonomi, Bisnis, Eksekutif, Luxury), denah gerbong, dan sisa kuota kursi secara real-time.\n• Informasi Finansial: Tarif tiket resmi, indikator harga termurah (best price), serta voucher diskon promo.\n• Informasi Ketentuan & Regulasi: Syarat usia tiket anak/bayi, batas berat bagasi gratis, ketentuan pembatalan (refund), dan tata cara boarding."),

          createParagraph("1.5. Target Pengguna (User Persona)", { bold: true }),
          createParagraph("• Mahasiswa & Pekerja Komuter (misal: Persona Muhammad Zidan & Nurihisha Nadia): Mengutamakan efisiensi pencarian tarif termurah, jam keberangkatan tercepat, dan kemudahan menemukan promo.\n• Wisatawan & Keluarga: Membutuhkan kepastian rute, perbandingan kelas kenyamanan gerbong, dan pemilihan kursi berdampingan.\n• Pengguna Baru / Pemula (First-time Users): Calon penumpang yang belum hafal singkatan kode 3 huruf stasiun di Pulau Jawa dan membutuhkan panduan visual peta rute."),

          // 2. ANALISIS INFORMATION SEARCH
          createHeading1("2. ANALISIS PROSES INFORMATION SEARCH"),
          createParagraph("Bagian ini mengamati dan mengevaluasi alur interaksi pengguna ketika mencari informasi tiket kereta api berdasarkan 11 indikator evaluasi IMK:"),

          ...createQA("1", "Bagaimana pengguna memulai pencarian?", 
            "Pengguna memulai pencarian melalui formulir pencarian terpadu (Search Card) yang terletak terpusat pada Hero Section di halaman beranda. Pengguna menentukan stasiun asal, stasiun tujuan (didukung tombol swap satu klik), tipe perjalanan (sekali jalan / pulang-pergi), tanggal keberangkatan, dan jumlah penumpang. Sebagai alternatif, pengguna juga dapat memulai pencarian secara spasial melalui tombol 'Pilih Rute via Peta' yang membuka peta rute interaktif Pulau Jawa."),

          ...createQA("2", "Apakah fitur search mudah ditemukan?", 
            "Sangat mudah ditemukan (High Visibility). Kotak pencarian utama berada tepat di atas lipatan layar (above the fold) beranda dengan kontras tinggi (kartu putih berbayang halus di atas latar belakang biru tua KAI #003C71). Dilengkapi ikon-ikon penjelas universal (MapPin, Navigation, Calendar, Users) yang mengarahkan fokus visual pengguna secara alami."),

          ...createQA("3", "Bagaimana pengguna memasukkan kata kunci?", 
            "Pengguna mengklik kolom input stasiun asal atau tujuan, lalu mengetik nama stasiun (misal: 'Gambir'), nama kota (misal: 'Yogyakarta' atau 'Jogja'), maupun kode 3 huruf stasiun resmi KAI (misal: 'GMR', 'YK', 'BDO'). Sistem bersifat case-insensitive dan toleran terhadap pencarian parsial."),

          ...createQA("4", "Apakah terdapat autocomplete atau search suggestion?", 
            "Ya, sistem dilengkapi Smart Autocomplete & Suggestion Modal. Sebelum pengguna mengetik, modal langsung menampilkan daftar 'Stasiun Populer' (Gambir, Bandung, Yogyakarta, Surabaya, dll). Saat pengguna mulai mengetik, daftar stasiun langsung terfilter secara real-time lengkap dengan lencana kota dan kode stasiun resmi."),

          ...createQA("5", "Bagaimana hasil pencarian ditampilkan?", 
            "Hasil pencarian pada halaman /cari disajikan dalam bentuk daftar kartu kereta (Train Cards) terstruktur vertikal: jam berangkat & tiba di kiri dan kanan, garis alur durasi di tengah, nama dan nomor KA dicetak tegas, lencana kelas kursi warna-warni, serta harga tebal di sisi kanan bersebelahan dengan tombol aksi 'Pilih'."),

          ...createQA("6", "Apakah hasil yang paling relevan mudah ditemukan?", 
            "Sangat mudah ditemukan. Jadwal langsung (direct train) yang melayani rute asal-tujuan diletakkan di urutan teratas. Selain itu, terdapat Date Strip Carousel tepat di atas daftar tiket yang memperlihatkan perbandingan harga termurah pada H-3 hingga H+3, memudahkan pengguna menemukan opsi paling hemat dalam 1 klik."),

          ...createQA("7", "Apakah tersedia filter?", 
            "Ya, tersedia Panel Filter Multi-Kategori di sisi kiri halaman hasil pencarian: (1) Filter Kelas Kereta (Ekonomi, Bisnis, Eksekutif, Luxury), (2) Filter Waktu Keberangkatan (Pagi, Siang, Sore, Malam), dan (3) Filter Nama Kereta Api. Filter bekerja secara reaktif dan memperbarui hasil seketika tanpa perlu me-reload halaman."),

          ...createQA("8", "Apakah tersedia sorting?", 
            "Ya, tersedia Menu Dropdown Sorting di bagian atas daftar hasil: Harga Terendah → Tertinggi (Default / Paling Hemat), Keberangkatan Paling Awal & Paling Akhir, Kedatangan Paling Awal & Paling Akhir, serta Durasi Perjalanan Tercepat."),

          ...createQA("9", "Apakah pengguna mendapatkan feedback dari sistem?", 
            "Ya, sistem memberikan umpan balik (feedback) instan pada setiap aksi: (1) Feedback Visual Peta: saat asal dan tujuan dipilih di peta rute, jalur rel nyata otomatis menyala oranye (#F58220) dan kamera peta melakukan auto-fit zoom membingkai rute; (2) Feedback Kuota Kursi: lencana oranye menyala jika kursi tersisa sedikit; (3) Feedback Promo: muncul notifikasi hijau saat kode promo aktif; (4) Feedback Loading: animasi skeleton loader saat data jadwal disaring."),

          ...createQA("10", "Apa yang terjadi jika pencarian tidak menghasilkan informasi (Empty State)?", 
            "Sistem tidak menampilkan halaman kosong kaku atau kode galat teknis. Sistem menyajikan Empty State yang ramah berilustrasi maskot KAI dengan pesan empatik 'Jadwal Kereta Tidak Ditemukan', disertai rekomendasi solutif: mengubah tanggal keberangkatan melalui kalender tarif, memeriksa rute alternatif stasiun terdekat, atau tombol kembali ke beranda."),

          ...createQA("11", "Berapa langkah yang diperlukan pengguna sampai menemukan informasi yang dicari?", 
            "Secara umum, pengguna hanya memerlukan 2 langkah aksi utama (two-action steps) untuk menemukan informasi jadwal dan tarif kereta yang diinginkan:\n1. Langkah 1 (Spesifikasi Parameter): Memilih stasiun asal, tujuan, dan tanggal pada formulir beranda (didukung Smart Suggestion stasiun populer & terdekat).\n2. Langkah 2 (Eksekusi Pencarian): Menekan tombol 'Cari Tiket'. Sistem seketika menyajikan hasil pencarian lengkap dengan matriks harga dan jadwal.\nJika pengguna memerlukan penyaringan spesifik (kelas atau jam tertentu), pengguna cukup melakukan 1 langkah penyempurnaan (refinement step) menggunakan toolbar filter/sorting yang memperbarui hasil secara instan tanpa reload halaman. Selain itu, perbandingan harga antartanggal dapat dilakukan dalam 1 klik langsung pada Date Strip Carousel."),

          // 3. SOLUSI REDESIGN
          createHeading1("3. SOLUSI REDESIGN DAN INOVASI FITUR"),
          createParagraph("Berdasarkan evaluasi masalah pada sistem pemesanan konvensional, dibuat solusi redesain pada aspek-aspek berikut:"),
          createParagraph("1. Search Bar & Suggestion: Mengganti dropdown teks kaku dengan modal pencarian terfokus (focused modal overlay) yang menyajikan rekomendasi 'Stasiun Populer', pengelompokan kota, dan toleransi singkatan kode stasiun."),
          createParagraph("2. Navigasi Spasial (Peta Rute Interaktif Pulau Jawa): Menyediakan alternatif penemuan rute visual di /peta-rute bagi pengguna yang tidak hafal lokasi stasiun, lengkap dengan visualisasi jalur rel aktif berwarna oranye yang menelusuri lekukan rel nyata OpenStreetMap."),
          createParagraph("3. Date Strip Carousel (Perbandingan Tarif Antartanggal): Menambahkan carousel tanggal di atas hasil pencarian untuk melihat tarif termurah di hari sebelum/sesudahnya tanpa perlu mengulang input pencarian."),
          createParagraph("4. Panel Filter & Sorting Terbuka: Filter diletakkan di sisi kiri halaman hasil pencarian sehingga pengguna dapat langsung menyaring kelas dan jam dalam 1 klik (direct manipulation)."),
          createParagraph("5. Empty State & Feedback Responsif: Mengganti pesan error kaku dengan ilustrasi maskot KAI dan panduan mencari rute/tanggal alternatif."),
          createParagraph("6. Inovasi Fitur Baru — Pusat Promo Terintegrasi (/promo): Menyediakan halaman khusus promo dengan tombol 'Pakai Promo' yang otomatis memasang stasiun dan voucher di formulir beranda."),
          createParagraph("7. Inovasi Fitur Baru — Knowledge Search FAQ (/faq): Menyediakan pencarian informasi aturan, bagasi, dan refund secara mandiri dengan fitur text highlighting (kata kunci disorot kuning) dan 7 tab kategori tematik."),

          // 4. BEFORE VS AFTER (TABEL KOMPARASI)
          createHeading1("4. FORM ANALISIS PROJECT REDESIGN: BEFORE VS AFTER"),
          createParagraph("Tabel berikut menyajikan perbandingan apple-to-apple antara sistem eksisting (booking.kai.id) dan sistem hasil redesain (Booking KAI) pada materi Information Search:"),

          // Table Before vs After
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header Row
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    width: { size: 18, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: "003C71" },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Aspek / Fitur", bold: true, color: "FFFFFF" })] })]
                  }),
                  new TableCell({
                    width: { size: 31, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: "003C71" },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "BEFORE (Kondisi Eksisting)", bold: true, color: "FFFFFF" })] })]
                  }),
                  new TableCell({
                    width: { size: 31, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: "003C71" },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "AFTER (Hasil Redesain)", bold: true, color: "FFFFFF" })] })]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: "003C71" },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Alasan / Prinsip IMK", bold: true, color: "FFFFFF" })] })]
                  })
                ]
              }),

              // Row 1: Search / Pencarian
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "1. Search / Pencarian", bold: true })] })]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Formulir input konvensional kaku dengan label terpisah dan latar belakang datar. Tidak ada panduan rute visual."),
                      getImage("before_1_search.png", 200, 110)
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Formulir modern dengan kontras tinggi (Navy-Oranye KAI), tombol swap stasiun 1-klik, dan tombol 'Pilih Rute via Peta'."),
                      getImage("after_1_search.png", 200, 110)
                    ]
                  }),
                  new TableCell({
                    children: [new Paragraph("Aesthetic and Minimalist Design & Error Prevention. Mengurangi beban kognitif saat perumusan kueri.")]
                  })
                ]
              }),

              // Row 2: Search suggestion / autocomplete
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "2. Search Suggestion / Autocomplete", bold: true })] })]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Dropdown teks sederhana tanpa rekomendasi stasiun populer di awal. Pengguna harus hafal nama stasiun."),
                      getImage("before_2_autocomplete.png", 200, 110)
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Smart Suggestion Modal dengan daftar 'Stasiun Populer', pencarian berbasis kota, dan lencana kode stasiun KAI 3 huruf."),
                      getImage("after_2_autocomplete.png", 200, 110)
                    ]
                  }),
                  new TableCell({
                    children: [new Paragraph("Recognition rather than Recall (Nielsen #6). Pengguna cukup mengenali stasiun tanpa perlu mengingat kodenya.")]
                  })
                ]
              }),

              // Row 3: Search result
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "3. Search Result", bold: true })] })]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Daftar kereta statis memanjang ke bawah dengan tombol PESAN terpisah per subkelas tarif; tidak menampilkan perbandingan harga lintas tanggal."),
                      getImage("before_3_result.png", 200, 110)
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Matriks hasil pencarian kereta interaktif (Jam x Kelas) dilengkapi Date Strip Carousel untuk perbandingan tarif termurah antartanggal."),
                      getImage("after_3_result.png", 200, 110)
                    ]
                  }),
                  new TableCell({
                    children: [new Paragraph("Flexibility & Efficiency of Use. Pengguna dapat membandingkan jadwal dan tarif antartanggal dalam 1 kali pandang.")]
                  })
                ]
              }),

              // Row 4: Filter
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "4. Filter", bold: true })] })]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Tidak tersedia panel filter kategori komprehensif; opsi penyaringan harga tersembunyi di balik tombol toggle dan tidak ada filter waktu/kelas."),
                      getImage("before_4_filter.png", 200, 110)
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Toolbar Filter Dropdown berlatar biru primary (KAI Blue) di atas hasil pencarian. Pengguna dapat menyaring Kelas (Eksekutif, Bisnis, Ekonomi) dan Waktu Keberangkatan via menu dropdown interaktif dengan pembaruan instan serta tombol Reset otomatis."),
                      getImage("after_4_filter.png", 200, 110)
                    ]
                  }),
                  new TableCell({
                    children: [new Paragraph("Direct Manipulation & Immediate Feedback (Shneiderman). Hasil tersaring seketika tanpa reload halaman.")]
                  })
                ]
              }),

              // Row 5: Sorting
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "5. Sorting", bold: true })] })]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Tombol urutan datar statis [Kelas][Stasiun][Kereta][Waktu][Harga] tanpa indikator jelas apakah urutan menaik (asc) atau menurun (desc)."),
                      getImage("before_5_sorting.png", 200, 110)
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Dropdown sorting dinamis: Harga Paling Murah (kereta termurah langsung tampil di posisi teratas), Waktu Berangkat, dan Durasi Tercepat."),
                      getImage("after_5_sorting.png", 200, 110)
                    ]
                  }),
                  new TableCell({
                    children: [new Paragraph("User Control and Freedom (Nielsen #3). Memberikan kendali penuh pada prioritas efisiensi biaya dan waktu pengguna.")]
                  })
                ]
              }),

              // Row 6: Navigasi menemukan informasi
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "6. Navigasi Menemukan Informasi", bold: true })] })]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Hanya berbasis formulir teks linier statis; pengguna yang tidak hafal letak geografis stasiun kebingungan menentukan stasiun terdekat."),
                      getImage("before_booking_kai.png", 200, 110)
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Peta Rute Spasial Interaktif (/peta-rute); stasiun dapat diklik langsung di peta dan jalur rel kereta menyala oranye presisi."),
                      getImage("after_6_map.png", 200, 110)
                    ]
                  }),
                  new TableCell({
                    children: [new Paragraph("Match between System and Real World (Nielsen #2). Membentuk model mental geografis yang konkret dan intuitif.")]
                  })
                ]
              }),

              // Row 7: No-result / error / feedback
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "7. No-Result / Error / Feedback", bold: true })] })]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Feedback eror berupa notifikasi toast merah kecil di pojok kanan bawah yang mudah terlewat dan tanpa panduan solutif."),
                      getImage("before_7_empty_state.png", 200, 110)
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Empty State empatik berpusat di layar dengan ilustrasi Maskot KAI ramah serta tombol aksi solutif: 'Reset Semua Filter' dan 'Cek di Peta Rute'."),
                      getImage("after_7_empty_state.png", 200, 110)
                    ]
                  }),
                  new TableCell({
                    children: [new Paragraph("Help Users Recognize, Diagnose, and Recover from Errors (Nielsen #9).")]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 240, after: 100 } }),

          // 5. RINGKASAN HASIL & DAMPAK UX
          createHeading1("5. RINGKASAN HASIL REDESAIN & DAMPAK UX"),
          createParagraph("Masalah Utama pada BEFORE:", { bold: true }),
          createParagraph("Sistem pencarian tiket lama pada booking.kai.id didominasi oleh formulir statis kaku yang membebankan memori pengguna (harus menghafal nama resmi stasiun), tidak memiliki bantuan konteks spasial/peta, tidak menyediakan perbandingan harga antartanggal secara simultan, serta opsi filter/sorting yang tersembunyi."),

          createParagraph("Perbaikan Utama pada AFTER:", { bold: true }),
          createParagraph("Redesain menghadirkan sistem penemuan informasi holistik: Smart Modal Autocomplete dengan kelompok stasiun populer, Peta Rute Interaktif Pulau Jawa yang menyala oranye mengikuti rel nyata, Date Strip Carousel untuk perbandingan tarif termurah antartanggal dalam 1 klik, Panel Filter multi-kategori terbuka, dropdown sorting fleksibel, serta Empty State empatik berilustrasi maskot KAI."),

          createParagraph("Dampak terhadap Pengalaman Pengguna (UX Impact):", { bold: true }),
          createParagraph("• Efektivitas (Task Success Rate): Pengguna tidak lagi mengalami salah pilih stasiun berkat adanya konteks kota, lencana kode 3 huruf stasiun, dan jalur visual peta rute.\n• Efisiensi (Time-on-Task): Waktu pencarian jadwal dan tarif termurah terpangkas drastis karena pengguna dapat membandingkan tanggal di satu layar tanpa perlu mengulang kueri pencarian dari awal.\n• Kepuasan (User Satisfaction): Pengalaman interaksi menjadi menyenangkan, modern, dan bebas hambatan mental (low cognitive friction), terbukti dengan penurunan skor PSSUQ yang signifikan melampaui benchmark global.")
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(__dirname, '..', 'Laporan_Information_Search_Booking_KAI.docx');
  fs.writeFileSync(outPath, buffer);
  console.log(`Document successfully generated at: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
}

generate();
