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
      spacing: { before: 40, after: 40 },
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
        size: 26,
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
        size: 23,
        color: "003C71",
        font: "Times New Roman"
      })
    ]
  });
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    spacing: { before: 50, after: 70, line: 260 },
    children: [
      new TextRun({
        text: text,
        size: 21,
        font: "Times New Roman",
        ...options
      })
    ]
  });
}

function createCellBullet(text) {
  return new Paragraph({
    spacing: { before: 20, after: 30, line: 230 },
    children: [
      new TextRun({
        text: `• ${text}`,
        size: 19,
        font: "Times New Roman"
      })
    ]
  });
}

function createQA(qNumber, question, answer) {
  return [
    new Paragraph({
      spacing: { before: 120, after: 30 },
      children: [
        new TextRun({
          text: `${qNumber}. ${question}`,
          bold: true,
          size: 21,
          color: "003C71",
          font: "Times New Roman"
        })
      ]
    }),
    new Paragraph({
      spacing: { before: 30, after: 90, line: 260 },
      children: [
        new TextRun({
          text: answer,
          size: 21,
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
            size: 21,
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
              top: 1440,
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
            spacing: { before: 0, after: 80 },
            children: [
              new TextRun({
                text: "LAPORAN TUGAS INTERAKSI MANUSIA DAN KOMPUTER (IMK)",
                bold: true,
                size: 30,
                color: "003C71",
                font: "Times New Roman"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: "ANALISIS DAN REDESAIN FITUR INFORMATION SEARCH",
                bold: true,
                size: 25,
                color: "F58220",
                font: "Times New Roman"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 260 },
            children: [
              new TextRun({
                text: "Studi Kasus: Sistem Reservasi Tiket Kereta Api Indonesia (Booking KAI)",
                italics: true,
                size: 21,
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
                    margins: { top: 100, bottom: 100, left: 140, right: 140 },
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

          new Paragraph({ spacing: { before: 160, after: 80 } }),

          // 1. IDENTIFIKASI FITUR
          createHeading1("1. IDENTIFIKASI FITUR"),
          createParagraph("1.1. Nama Aplikasi / Website", { bold: true }),
          createParagraph("Website Pemesanan Tiket Booking KAI (Redesain dari portal resmi booking.kai.id). Prototipe interaktif dibangun menggunakan kerangka kerja Next.js dan Tailwind CSS dengan tema visual khas KAI (Navy #003C71 dan Oranye #F58220)."),

          createParagraph("1.2. Fitur yang Dianalisis", { bold: true }),
          createParagraph("Sistem Terpadu Penemuan Informasi (Information Search System), meliputi: (1) Form Pencarian Jadwal Tiket Kereta Api, (2) Smart Suggestion & Autocomplete Stasiun, (3) Navigasi Spasial Rute via Peta Interaktif Pulau Jawa, (4) Toolbar Filter Dropdown Multi-Kategori dan Pengurutan (Sorting) Dinamis, (5) Pusat Promo & Voucher Terintegrasi, serta (6) Knowledge Search / FAQ Mandiri."),

          createParagraph("1.3. Tujuan Fitur", { bold: true }),
          createParagraph("Memfasilitasi calon penumpang untuk merumuskan kueri, mencari, menyaring, membandingkan tarif antartanggal, serta memilih jadwal kereta api yang paling ideal secara cepat, akurat, dan bebas beban kognitif."),

          createParagraph("1.4. Kebutuhan Informasi Pengguna (Information Needs)", { bold: true }),
          createParagraph("• Informasi Jadwal & Rute: Waktu keberangkatan dan kedatangan, stasiun asal-tujuan, dan visualisasi rute spasial.\n• Informasi Fasilitas & Kursi: Kelas kereta (Ekonomi, Bisnis, Eksekutif, Luxury) dan sisa kuota kursi secara real-time.\n• Informasi Tarif & Promo: Harga tiket resmi, opsi tarif termurah, serta potongan voucher promo.\n• Informasi Regulasi: Aturan bagasi, ketentuan pembatalan/refund, dan persyaratan tiket anak."),

          createParagraph("1.5. Target Pengguna (User Persona)", { bold: true }),
          createParagraph("• Mahasiswa & Pekerja Komuter: Mengutamakan kecepatan pencarian tiket termurah dan jam berangkat pagi/malam.\n• Wisatawan & Keluarga: Membutuhkan kejelasan rute kota tujuan dan perbandingan kenyamanan kelas kursi.\n• Penumpang Pemula: Memerlukan bantuan visual rute peta karena belum hafal letak dan singkatan kode stasiun."),

          // 2. ANALISIS INFORMATION SEARCH
          createHeading1("2. ANALISIS PROSES INFORMATION SEARCH"),
          createParagraph("Berikut evaluasi alur penemuan informasi pengguna berdasarkan 11 indikator IMK:"),

          ...createQA("1", "Bagaimana pengguna memulai pencarian?", 
            "Pengguna memulai pencarian dari Search Card yang berada di halaman utama. Di bagian ini, pengguna memilih stasiun asal, stasiun tujuan, tipe perjalanan, tanggal keberangkatan, dan jumlah penumpang. Terdapat tombol swap untuk menukar stasiun secara instan, serta tombol 'Pilih Rute via Peta' untuk melihat rute secara visual."),

          ...createQA("2", "Apakah fitur search mudah ditemukan?", 
            "Ya, sangat mudah ditemukan. Kotak pencarian berada di posisi utama (above the fold) halaman beranda dengan kontras warna yang tegas terhadap latar belakang. Ikon penjelas pada setiap kolom membantu pengguna mengenali fungsi masing-masing elemen dengan cepat."),

          ...createQA("3", "Bagaimana pengguna memasukkan kata kunci?", 
            "Pengguna memilih kolom stasiun asal atau tujuan, kemudian mengetik nama stasiun, kota, atau kode 3 huruf stasiun (misalnya 'GMR' untuk Gambir, 'YK' untuk Yogyakarta, atau 'BDO' untuk Bandung). Pencarian bersifat toleran (case-insensitive dan pencarian parsial)."),

          ...createQA("4", "Apakah terdapat autocomplete atau search suggestion?", 
            "Ya, sistem menyediakan Smart Autocomplete Modal. Sebelum mengetik, pengguna langsung disajikan rekomendasi 'Stasiun Populer'. Saat pengguna mulai mengetik huruf awal, daftar pilihan otomatis tersaring secara real-time lengkap dengan lencana kota dan kode stasiun."),

          ...createQA("5", "Bagaimana hasil pencarian ditampilkan?", 
            "Hasil pencarian disajikan dalam bentuk daftar kartu kereta (Train Cards) terstruktur: waktu keberangkatan dan kedatangan di kiri-kanan, alur durasi perjalanan di tengah, nama KA dan lencana kelas kursi yang jelas, serta tarif tebal di samping tombol aksi 'Pilih'."),

          ...createQA("6", "Apakah hasil yang paling relevan mudah ditemukan?", 
            "Sangat mudah. Jadwal langsung (direct) diletakkan di urutan teratas. Selain itu, terdapat Date Strip Carousel di atas daftar hasil pencarian yang menampilkan tarif termurah pada H-3 hingga H+3, memudahkan pengguna membandingkan harga dalam 1 klik."),

          ...createQA("7", "Apakah tersedia filter?", 
            "Ya, tersedia Toolbar Filter Dropdown berlatar biru primary (KAI Blue) tepat di atas hasil pencarian. Pengguna dapat menyaring Kelas (Ekonomi, Bisnis, Eksekutif) dan Waktu Keberangkatan (Pagi, Siang, Malam) via menu dropdown interaktif. Tersedia tombol Reset otomatis yang muncul ketika filter aktif, memperbarui hasil seketika tanpa reload halaman."),

          ...createQA("8", "Apakah tersedia sorting?", 
            "Ya, tersedia Menu Dropdown Sorting pada toolbar di atas hasil pencarian: Harga Paling Murah (Default / Rekomendasi), Waktu: Paling Awal, Waktu: Paling Akhir, dan Durasi: Paling Cepat."),

          ...createQA("9", "Apakah pengguna mendapatkan feedback dari sistem?", 
            "Ya, sistem memberikan umpan balik langsung pada setiap aksi: (1) Feedback visual peta menyala oranye (#F58220) saat asal-tujuan dipilih, (2) Lencana oranye peringatan sisa kuota kursi, (3) Notifikasi hijau saat promo aktif, dan (4) Skeleton loading saat data diperbarui."),

          ...createQA("10", "Apa yang terjadi jika pencarian tidak menghasilkan informasi (Empty State)?", 
            "Sistem menyajikan Empty State empatik berilustrasi maskot KAI dengan pesan ramah 'Jadwal Kereta Tidak Ditemukan', dilengkapi rekomendasi solutif: tombol mengganti tanggal keberangkatan atau memeriksa rute alternatif via Peta Rute."),

          ...createQA("11", "Berapa langkah yang diperlukan pengguna sampai menemukan informasi yang dicari?", 
            "Pengguna hanya memerlukan sekitar 2 sampai 3 langkah utama:\n• Langkah 1: Memilih stasiun asal, stasiun tujuan, dan tanggal keberangkatan pada formulir beranda (atau via Peta Rute).\n• Langkah 2: Menekan tombol 'Cari Tiket' untuk mengeksekusi pencarian.\n• Langkah 3: Pengguna langsung melihat jadwal dan harga tiket pada halaman hasil, serta dapat menggunakan filter dropdown atau sorting jika memerlukan penyaringan lebih lanjut."),

          // 3. SOLUSI REDESAIN
          createHeading1("3. SOLUSI REDESAIN DAN INOVASI FITUR"),
          createParagraph("Berdasarkan masalah yang diidentifikasi pada sistem lama, solusi redesain dirumuskan pada aspek-aspek utama berikut:"),
          createParagraph("1. Search Bar & Suggestion: Mengganti dropdown teks kaku dengan modal pencarian terfokus yang menyajikan rekomendasi 'Stasiun Populer', pengelompokan kota, dan pencarian kode stasiun."),
          createParagraph("2. Navigasi Spasial (Peta Rute Interaktif Pulau Jawa): Menambahkan halaman /peta-rute untuk mencari rute secara visual bagi pengguna yang belum hafal lokasi stasiun."),
          createParagraph("3. Date Strip Carousel: Menambahkan pilihan tanggal di atas hasil pencarian untuk melihat tarif termurah di sekitar tanggal pilihan tanpa harus mengulang pencarian."),
          createParagraph("4. Toolbar Filter Dropdown & Sorting Terbuka: Filter dan sorting ditempatkan tepat di atas hasil pencarian agar mudah diakses dalam 1 baris terpadu."),
          createParagraph("5. Empty State Responsif: Mengganti pesan error kaku dengan ilustrasi maskot ramah dan tombol panduan solutif."),
          createParagraph("6. Pusat Promo Terintegrasi (/promo): Menyediakan pencarian promo dengan tombol 1-klik 'Pakai Promo' yang mengisi form pencarian secara otomatis."),
          createParagraph("7. Knowledge Search FAQ (/faq): Menyediakan pencarian informasi aturan bagasi dan refund dengan fitur text highlighting (sorotan kuning)."),

          // 4. BEFORE VS AFTER (TABEL KOMPARASI PER POIN)
          createHeading1("4. FORM ANALISIS PROJECT REDESIGN: BEFORE VS AFTER"),
          createParagraph("Tabel berikut menyajikan komparasi per poin (ringkas) antara sistem eksisting (booking.kai.id) dan sistem hasil redesain (Booking KAI):"),

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
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Aspek / Fitur", bold: true, color: "FFFFFF", size: 20 })] })]
                  }),
                  new TableCell({
                    width: { size: 31, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: "003C71" },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "BEFORE (Eksisting)", bold: true, color: "FFFFFF", size: 20 })] })]
                  }),
                  new TableCell({
                    width: { size: 31, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: "003C71" },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "AFTER (Redesain)", bold: true, color: "FFFFFF", size: 20 })] })]
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: "003C71" },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Prinsip IMK", bold: true, color: "FFFFFF", size: 20 })] })]
                  })
                ]
              }),

              // Row 1: Search / Pencarian
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "1. Search / Pencarian", bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Formulir konvensional dengan kontras rendah."),
                      createCellBullet("Tidak tersedia panduan visual rute."),
                      getImage("before_1_search.png", 190, 105)
                    ]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Search Card modern dengan kontras tinggi (Navy-Oranye KAI)."),
                      createCellBullet("Tombol swap stasiun 1-klik & opsi 'Pilih Rute via Peta'."),
                      getImage("after_1_search.png", 190, 105)
                    ]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Aesthetic & Minimalist Design."),
                      createCellBullet("Error Prevention (meminimalkan salah input).")
                    ]
                  })
                ]
              }),

              // Row 2: Search suggestion / autocomplete
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "2. Search Suggestion / Autocomplete", bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Dropdown teks standar tanpa saran awal."),
                      createCellBullet("Pengguna wajib hafal nama lengkap stasiun."),
                      getImage("before_2_autocomplete.png", 190, 105)
                    ]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Smart Modal dengan daftar 'Stasiun Populer'."),
                      createCellBullet("Mendukung pencarian nama kota maupun kode 3 huruf (GMR, YK, BDO)."),
                      getImage("after_2_autocomplete.png", 190, 105)
                    ]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Recognition rather than Recall (Nielsen #6).")
                    ]
                  })
                ]
              }),

              // Row 3: Search result
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "3. Search Result", bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Daftar jadwal statis memanjang ke bawah."),
                      createCellBullet("Tidak ada perbandingan harga lintas tanggal."),
                      getImage("before_3_result.png", 190, 105)
                    ]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Kartu kereta terstruktur (jam, durasi, kelas, harga)."),
                      createCellBullet("Date Strip Carousel untuk komparasi tarif H-3 s.d. H+3 dalam 1 klik."),
                      getImage("after_3_result.png", 190, 105)
                    ]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Flexibility & Efficiency of Use (Nielsen #7).")
                    ]
                  })
                ]
              }),

              // Row 4: Filter
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "4. Filter", bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Tidak ada filter kategori langsung di halaman hasil."),
                      createCellBullet("Pilihan filter kaku dan tersembunyi."),
                      getImage("before_4_filter.png", 190, 105)
                    ]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Toolbar Filter Dropdown berlatar biru primary KAI."),
                      createCellBullet("Filter Kelas dan Jam dengan tombol Reset otomatis."),
                      getImage("after_4_filter.png", 190, 105)
                    ]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Direct Manipulation & Immediate Feedback (Shneiderman).")
                    ]
                  })
                ]
              }),

              // Row 5: Sorting
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "5. Sorting", bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Tombol sorting statis tanpa arah urutan jelas."),
                      getImage("before_5_sorting.png", 190, 105)
                    ]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Menu Dropdown Sorting (Harga Termurah, Waktu, Durasi)."),
                      createCellBullet("Pembaruan urutan instan tanpa reload halaman."),
                      getImage("after_5_sorting.png", 190, 105)
                    ]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("User Control and Freedom (Nielsen #3).")
                    ]
                  })
                ]
              }),

              // Row 6: Navigasi menemukan informasi
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "6. Navigasi Menemukan Informasi", bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Hanya berbasis input formulir teks linier."),
                      createCellBullet("Sulit bagi pengguna yang belum hafal letak stasiun."),
                      getImage("before_booking_kai.png", 190, 105)
                    ]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Peta Rute Interaktif Pulau Jawa (/peta-rute)."),
                      createCellBullet("Stasiun dapat diklik langsung dengan visual rel oranye."),
                      getImage("after_6_map.png", 190, 105)
                    ]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Match between System and Real World (Nielsen #2).")
                    ]
                  })
                ]
              }),

              // Row 7: No-result / error / feedback
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "7. No-Result / Error / Feedback", bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Notifikasi error kecil di pojok layar tanpa solusi."),
                      getImage("before_7_empty_state.png", 190, 105)
                    ]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Empty State empatik dengan ilustrasi maskot ramah."),
                      createCellBullet("Tombol aksi solutif: ganti tanggal atau cek rute alternatif."),
                      getImage("after_7_empty_state.png", 190, 105)
                    ]
                  }),
                  new TableCell({
                    children: [
                      createCellBullet("Help Users Recognize, Diagnose, and Recover from Errors (Nielsen #9).")
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 200, after: 80 } }),

          // 5. FITUR REDESAIN TAMBAHAN (TANPA KOMPARASI BEFORE-AFTER)
          createHeading1("5. FITUR REDESAIN TAMBAHAN (TANPA KOMPARASI BEFORE-AFTER)"),
          createParagraph("Bagian ini memaparkan fitur-fitur baru hasil redesain yang tidak memiliki komparasi langsung (apple-to-apple) dengan sistem eksisting (booking.kai.id). Fitur-fitur ini merupakan inovasi penemuan informasi (information search) yang sebelumnya belum ada atau masih terpisah di luar sistem reservasi utama:"),

          createHeading2("5.1. Pusat Promo & Voucher Terintegrasi (/promo)"),
          createParagraph("• Latar Belakang Ketiadaan Fitur: Pada sistem reservasi lama KAI, informasi promo tiket dan diskon tarif hanya dipublikasikan melalui spanduk statis di situs eksternal atau media sosial. Pengguna harus mencatat kode voucher secara manual dan sering kali lupa saat mengisi formulir pemesanan."),
          createParagraph("• Solusi Redesain: Disediakan halaman khusus Pusat Promo (/promo) yang terintegrasi langsung dengan sistem pencarian tiket."),
          createParagraph("• Kemampuan Penemuan Informasi:"),
          createParagraph("  - Filter Kategori Promo: Menyaring promo berdasarkan kota destinasi favorit serta periode waktu berlaku."),
          createParagraph("  - Live Search Promo: Pencarian cepat nama event promo atau rute tujuan tertentu."),
          createParagraph("  - Aksi 1-Klik 'Pakai Promo': Tombol pada kartu promo langsung mengarahkan pengguna ke formulir pemesanan beranda dengan rute stasiun dan kode voucher yang sudah terpasang otomatis (pre-filled), mencegah kesalahan pengetikan."),
          createParagraph("• Prinsip IMK Terkait: Recognition rather than Recall & Flexibility and Efficiency of Use."),
          getImage("after_promo.png", 460, 240),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 120 },
            children: [new TextRun({ text: "Gambar 5.1 Antarmuka Pusat Promo Terintegrasi (/promo)", italics: true, size: 18, color: "555555" })]
          }),

          createHeading2("5.2. Knowledge Search & FAQ Mandiri Cerdas (/faq)"),
          createParagraph("• Latar Belakang Ketiadaan Fitur: Regulasi penting perjalanan (seperti batasan bagasi 20 kg, aturan pembatalan/refund 25%, reschedule, aturan tiket bayi, hingga hewan peliharaan) sebelumnya tersembunyi di dalam lembar syarat & ketentuan (T&C) statis yang sangat panjang tanpa sarana pencarian interaktif."),
          createParagraph("• Solusi Redesain: Dihadirkan modul Knowledge Search mandiri pada halaman /faq untuk memudahkan penemuan informasi regulasi non-jadwal secara cepat."),
          createParagraph("• Kemampuan Penemuan Informasi:"),
          createParagraph("  - Live Search Bar: Pengguna cukup mengetik kata kunci pertanyaan (misal: 'bagasi', 'refund', 'anak')."),
          createParagraph("  - Search Text Highlighting: Kata kunci yang cocok pada pertanyaan dan jawaban langsung disorot dengan latar belakang kuning cerah (yellow highlight), mempercepat pemindaian visual (scanning & skimming)."),
          createParagraph("  - 7 Tab Kategori Tematik: Navigasi terstruktur mencakup Pemesanan, Pembatalan & Refund, Reschedule, Bagasi & Hewan, Pembayaran, Fasilitas Kereta, serta Akun & Keamanan."),
          createParagraph("  - Accordion Interaktif: Format tanya-jawab yang dapat dibuka-tutup menjaga antarmuka tetap bersih dan ringkas."),
          createParagraph("• Prinsip IMK Terkait: Help and Documentation (Nielsen #10) & Information Scent."),
          getImage("after_faq.png", 460, 240),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 120 },
            children: [new TextRun({ text: "Gambar 5.2 Antarmuka Knowledge Search FAQ Cerdas dengan Text Highlighting (/faq)", italics: true, size: 18, color: "555555" })]
          }),

          // 6. RINGKASAN HASIL & DAMPAK UX
          createHeading1("6. RINGKASAN HASIL REDESAIN & DAMPAK UX"),
          createParagraph("Masalah Utama pada Sistem Lama (BEFORE):", { bold: true }),
          createParagraph("Sistem pencarian tiket lama pada booking.kai.id didominasi formulir teks kaku yang membebani daya ingat pengguna (harus hafal nama stasiun), ketiadaan konteks spasial/peta, tidak ada perbandingan harga antartanggal, serta opsi filter dan pengurutan yang tersembunyi."),

          createParagraph("Perbaikan Utama pada Sistem Baru (AFTER):", { bold: true }),
          createParagraph("Redesain menghadirkan sistem penemuan informasi yang utuh: Smart Modal Autocomplete dengan kelompok stasiun populer, Peta Rute Spasial Interaktif Pulau Jawa, Date Strip Carousel untuk perbandingan tarif termurah dalam 1 klik, Toolbar Filter Dropdown dan sorting terpadu di atas hasil pencarian, Empty State empatik berilustrasi maskot, serta integrasi Pusat Promo (/promo) dan Knowledge Search FAQ (/faq)."),

          createParagraph("Dampak terhadap Pengalaman Pengguna (UX Impact):", { bold: true }),
          createParagraph("• Efektivitas (Task Success Rate): Pengguna tidak lagi salah memilih stasiun berkat adanya lencana kota, kode resmi 3 huruf, serta panduan rute visual pada peta.\n• Efisiensi (Time-on-Task): Waktu pencarian tiket termurah berkurang signifikan karena pengguna dapat membandingkan tanggal langsung pada satu layar tanpa mengulang formulir pencarian.\n• Kepuasan (User Satisfaction): Antarmuka modern, interaktif, dan responsif memberikan kenyamanan optimal dan mengurangi beban mental pengguna dalam merencanakan perjalanan.")
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
