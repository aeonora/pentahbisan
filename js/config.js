/**
 * CONFIGURASI UNDANGAN DIGITAL
 * Pentahbisan dan Peresmian Gedung GKST Jemaat Karmel Winowanga
 * Semua data teks, tanggal, lokasi, susunan acara, dan opsi ada di sini agar mudah diedit.
 */

const INVITATION_CONFIG = {
  // Informasi Acara Utama
  event: {
    category: "PENTAHBISAN & PERESMIAN",
    title: "PENTAHBISAN DAN PERESMIAN GEDUNG GEREJA KRISTEN SULAWESI TENGAH",
    churchName: "Gedung Gereja Kristen Sulawesi Tengah Jemaat Karmel Winowanga",
    venue: "Gedung Gereja Kristen Sulawesi Tengah Jemaat Karmel Winowanga",
    affiliation: "ANGGOTA PERSEKUTUAN GEREJA-GEREJA DI INDONESIA (PGI)",
    klasis: "KLASIS NAPU",
    
    // Waktu Acara (WITA: UTC+8)
    day: "Kamis",
    dateFormatted: "29 Oktober 2026",
    timeFormatted: "10.00 WITA",
    letterDate: "Winowanga, 01 Oktober 2026",
    
    // ISO Date untuk Countdown & Kalender (2026-10-29T10:00:00+08:00)
    isoDateTime: "2026-10-29T10:00:00+08:00",
    endIsoDateTime: "2026-10-29T14:00:00+08:00",
    timezone: "WITA (UTC+8)",
    
    // Lokasi Acara
    locationName: "Gedung Gereja Kristen Sulawesi Tengah Jemaat Karmel Winowanga",
    address: "Desa Winowanga, Kecamatan Lore Timur, Kabupaten Poso, Sulawesi Tengah (Klasis Napu)",
    mapsUrl: "https://maps.google.com/?q=GKST+Jemaat+Karmel+Winowanga,+Lore+Timur,+Poso,+Sulawesi+Tengah",
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127641.8794158496!2d120.25!3d-1.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d8e3b2e79685ab7%3A0x6a0a0ffaa8ecbbf7!2sWinowanga%2C%20Lore%20Timur%2C%20Kabupaten%20Poso%2C%20Sulawesi%20Tengah!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
  },

  // Ayat Alkitab
  verse: {
    text: "Adapun rumah ini, kemegahannya yang kemudian akan melebihi kemegahannya yang semula, firman TUHAN semesta alam, dan di tempat ini Aku akan memberi damai sejahtera, demikianlah firman TUHAN semesta alam.",
    reference: "Hagai 2:10 (TB)"
  },

  // Teks Surat Undangan Resmi
  letter: {
    greeting: "Syalom!",
    opening: "Mensyukuri kasih dan anugerah Tuhan Yesus Kristus sebagai Kepala Gereja yang telah menyertai proses pembangunan Gedung GKST Jemaat Karmel Winowanga, maka kami akan melaksanakan Pentahbisan dan peresmian Gedung Gereja tersebut, yang akan dilaksanakan pada:",
    closing: "Sehubungan dengan hal itu, kami mengundang Bapak/Ibu/Saudara(i) sekiranya berkenan hadir dalam acara dimaksud. Demikian undangan ini kami sampaikan atas kehadiran Bapak/Ibu/Saudara(i) diucapkan terima kasih, Tuhan Yesus Memberkati."
  },

  // Penandatangan Surat Resmi
  signatories: [
    {
      role: "Majelis Jemaat Karmel Winowanga",
      position: "Ketua",
      name: "Pdt. Nonce A Rompis, S.Th.",
      signatureImg: "assets/img/ttd-ketua-majelis.webp",
      signatureFallback: "assets/img/ttd-ketua-majelis.png",
      stampNote: "Stempel Majelis Jemaat"
    },
    {
      role: "Panitia Pentahbisan",
      position: "Ketua",
      name: "Yordan Torai",
      signatureImg: "assets/img/ttd-ketua-panitia.webp",
      signatureFallback: "assets/img/ttd-ketua-panitia.png",
      stampNote: "Stempel Panitia Pentahbisan"
    },
    {
      role: "Mengetahui",
      position: "Ketua Majelis Klasis Napu",
      name: "Pdt. Augustin Marjam Babao, S.Th., M.A.",
      signatureImg: "assets/img/ttd-ketua-klasis.webp",
      signatureFallback: "assets/img/ttd-ketua-klasis.png",
      stampNote: "Stempel Majelis Klasis Napu"
    }
  ],

  // Susunan Acara
  rundown: [
    { number: 1, title: "Pembukaan" },
    { number: 2, title: "Laporan Ketua Panitia Pentahbisan" },
    { number: 3, title: "Sambutan-sambutan" },
    { number: 4, title: "Pembukaan Selubung Papan Gereja" },
    { number: 5, title: "Penandatanganan Prasasti" },
    { number: 6, title: "Pengguntingan Pita" },
    { number: 7, title: "Penyerahan Kunci dan Pembukaan Pintu Gereja" },
    { number: 8, title: "Ibadah" },
    { number: 9, title: "Istirahat" }
  ],

  // Audio / Musik Latar
  audio: {
    enabled: true,
    autoplayOnOpen: true,
    file: "assets/audio/instrumental.mp3",
    fallbackFile: "assets/audio/instrumental.wav",
    title: "Instrumental Rohani - Hymn of Praise"
  },

  // Konfirmasi Kehadiran (RSVP)
  rsvp: {
    enabled: true,
    maxGuestPerRsvp: 5,
    // adapter: 'localStorage' atau 'webhook' / 'googlesheets'
    adapter: "localStorage",
    webhookUrl: "", // Isi jika ingin menghubungkan ke Google Sheets Script atau Zapier
    initialGreetings: [
      {
        name: "Keluarga Besar Klasis Napu",
        attendance: "Hadir",
        guests: 4,
        date: "2026-10-02 14:20",
        message: "Puji Tuhan atas selesainya pembangunan rumah Tuhan ini. Kami sekeluarga siap hadir dan bersukacita bersama jemaat GKST Karmel Winowanga."
      },
      {
        name: "Jemaat GKST Kasiguncu",
        attendance: "Hadir",
        guests: 2,
        date: "2026-10-03 09:15",
        message: "Selamat atas pentahbisan dan peresmian gedung gereja baru. Kiranya kasih Tuhan senantiasa melimpah bagi jemaat Karmel Winowanga."
      }
    ]
  },

  // Pengaturan Berbagi (WhatsApp & Sosmed)
  share: {
    text: "Undangan Pentahbisan & Peresmian Gedung Gereja GKST Jemaat Karmel Winowanga - Kamis, 29 Oktober 2026 pukul 10.00 WITA.",
    url: window.location.href.split('?')[0]
  }
};

// Ekspor ke window agar dapat diakses oleh main.js
if (typeof window !== "undefined") {
  window.INVITATION_CONFIG = INVITATION_CONFIG;
}

