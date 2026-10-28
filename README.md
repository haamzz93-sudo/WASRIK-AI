# WasrikAgent AI: Autonomous Multi-Agent Web Intelligence Platform

**Corporate Compliance & JKN Risk Intelligence**  
*BPJS Kesehatan Healthkathon 2026 — Kategori 3: Efisiensi Risiko pada Pemberi Kerja*

---

## 1. Ikhtisar Eksekutif & Latar Belakang Masalah

Program Jaminan Kesehatan Nasional (JKN) di Indonesia menghadapi tantangan struktural terkait kepatuhan Pemberi Kerja (Badan Usaha segmen Pekerja Penerima Upah / PPU). Berdasarkan data resmi Dewan Pengawas dan Kementerian Ketenagakerjaan per akhir 2025:

- **Total Badan Usaha Aktif**: 878.000 entitas nasional.
- **Badan Usaha Belum Patuh**: **523.000 entitas (59,5%)**.
- **Modus Utama**:
  1. **Under-Reporting Wage**: Perusahaan memanipulasi pelaporan gaji pekerja jauh di bawah *take-home pay* riil untuk mengecilkan setoran iuran 4% pemberi kerja.
  2. **PDUK (Pendaftaran Pekerja Sebagian)**: Mendaftarkan hanya staf kantor pusat dan menyembunyikan pekerja harian/outsourcing (terdampak 1,82 juta pekerja).
  3. **Penunggakan Iuran**: Menahan setoran iuran pekerja lebih dari 3 bulan.
- **Potensi Kebocoran Iuran (Revenue Leakage)**: **Rp 4,25 Triliun per tahun**.

**WasrikAgent AI** mentransformasi proses pengawasan manual berbasis sampel acak menjadi sistem intelijen pengawasan otonom proaktif yang memadukan **Multi-Agent AI** dengan **Dual-Pane Human-in-the-Loop (HITL) Workbench**.

---

## 2. Arsitektur Multi-Agent & Good Governance (HITL)

Sistem dikoordinasikan menggunakan **LangGraph State Machine** dengan 4 agen AI berotonomi terisolasi:

```
+-----------------------------------------------------------------------------------+
|                        WASRIKAGENT AI MULTI-AGENT ARCHITECTURE                    |
|                                                                                   |
|  [ Ingestion Service ] ---> ( Vision-LLM OCR & PDF Parser Pipeline )              |
|                                         |                                         |
|                                         v                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                 LANGGRAPH MULTI-AGENT ORCHESTRATOR ENGINE                   |  |
|  |                                                                             |  |
|  |   +-----------------------+           +---------------------------------+   |  |
|  |   | Agent 1: Payroll &    |           | Agent 2: Workforce              |   |  |
|  |   | Document Intel        |           | Classification                  |   |  |
|  |   | (OCR, Slip Gaji, SPT) |           | (PDUK, Misklasifikasi Status)   |   |  |
|  |   +-----------+-----------+           +----------------+----------------+   |  |
|  |               |                                        |                    |  |
|  |               +-------------------+--------------------+                    |  |
|  |                                   |                                         |  |
|  |   +-------------------------------+--------------------+                    |  |
|  |   | Agent 3: Collusion &          | Agent 4: Supervisor|                    |  |
|  |   | MCU Anomaly                   | Audit Orchestrator |                    |  |
|  |   | (Surat Sakit/MCU Fraud)       | (Risk Score & Loss)|                    |  |
|  |   +-------------------------------+---------+----------+                    |  |
|  +---------------------------------------------|-------------------------------+  |
|                                                v                                  |
|               [ HITL AUDIT WORKBENCH - AUDITOR VERIFICATION GATE ]                |
+-----------------------------------------------------------------------------------+
```

### Prinsip Good Governance (AI Sebagai Co-Pilot)
Sesuai **Asas-Asas Umum Pemerintahan yang Baik (AUPB)** dan regulasi jaminan sosial:
- AI **DILARANG** menerbitkan sanksi hukum secara otonom.
- Seluruh temuan disajikan berdampingan (*Dual-Pane*): bukti visual OCR (kotak merah) bersanding dengan alur penalaran AI (*Chain-of-Thought*).
- Petugas Wasrik memegang wewenang mutlak melalui gerbang keputusan: **[APPROVE TEMUAN]**, **[ADJUST / OVERRIDE VALUE]**, atau **[REJECT]**.
- Penyesuaian oleh auditor dicatat ke dalam tabel `active_learning_feedbacks` untuk menyempurnakan bobot AI secara berkala.

---

## 3. Landasan Hukum & Kepatuhan Regulasi

1. **Undang-Undang No. 24 Tahun 2011 tentang Badan Penyelenggara Jaminan Sosial**:
   - Kewajiban pemberi kerja mendaftarkan seluruh pekerja dan membayar iuran tepat waktu (Pasal 15 & 16).
2. **Peraturan Pemerintah No. 86 Tahun 2013 tentang Tata Cara Pengenaan Sanksi Administratif**:
   - Penerbitan Surat Teguran I (10 hari kerja), Surat Teguran II, Denda Administratif, hingga Rekomendasi Sanksi **Tidak Mendapat Pelayanan Publik Tertentu (TMP2T)** pada OSS BKPM.
3. **Undang-Undang No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)**:
   - Pseudonimisasi NIK menggunakan **Salted SHA-256 Hashing**.
   - Masking otomatis nama pekerja pada antarmuka web (`B*** S******`).
   - Enkripsi transmisi TLS 1.3 dan penyimpanan data aman.
4. **Undang-Undang No. 10 Tahun 2020 tentang Bea Meterai**:
   - Standar e-Meterai tunggal **Rp 10.000** pada dokumen resmi Pakta Integritas penggunaan dataset penelitian BPJS Kesehatan.

---

## 4. Struktur Direktori Proyek (`D:\projek warasik`)

```
D:\projek warasik\
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # Server RESTful FastAPI & WebSocket Streaming
│   │   ├── config.py                  # Pydantic Settings & Secret PDP Keys
│   │   ├── models.py                  # Skema Pydantic & Data Transfer Objects
│   │   ├── agent_orchestrator.py      # StateGraph LangGraph 4 Agen AI Wasrik
│   │   └── synthetic_generator.py     # Generator 1.000 Data Sintetis Berstandar UU PDP
│   ├── database.sql                   # Skrip DDL PostgreSQL 16 + pgvector, Views, Triggers
│   ├── requirements.txt               # Dependensi Python Backend
│   ├── Dockerfile                     # Dockerfile Kontainer Backend
│   └── .env                           # Konfigurasi Environment Aktif
├── frontend/
│   ├── public/
│   │   ├── assets/
│   │   │   └── wasrik-logo.svg        # Logo Vektor Elegan Non-AI-Slop Resmi Wasrik
│   │   └── favicon.svg                # Favicon Emblem Perisai Wasrik
│   ├── src/
│   │   ├── components/
│   │   │   ├── WasrikLogo.tsx         # Komponen Logo Vektor Interaktif
│   │   │   ├── TopHeader.tsx          # Navigasi Breadcrumbs & Switcher Peran RBAC
│   │   │   ├── Sidebar.tsx            # Sidebar 100vh Sticky Fleksibel
│   │   │   ├── Footer.tsx             # Footer Institusional Kepatuhan Hukum
│   │   │   ├── LandingPageView.tsx    # Halaman Pitch Eksekutif Healthkathon 2026
│   │   │   ├── LoginView.tsx          # Portal Single Sign-On (SSO) BPJS Wasrik
│   │   │   ├── DualPaneWorkbench.tsx  # HITL Dual-Pane Evidence Viewer & Decision Gate
│   │   │   ├── PriorityQueueView.tsx  # Antrean Matriks 523.000 BU Berisiko
│   │   │   ├── DashboardView.tsx      # Heatmap Sebaran KC & Analitik Kebocoran Rp 4,25T
│   │   │   ├── MultiAgentLiveRunner.tsx # Simulator Real-Time WebSocket 4 Agen AI
│   │   │   ├── RealFileUploader.tsx   # Modul Pemeriksaan Mandiri Berkas CSV/PDF
│   │   │   ├── SyntheticDataGenerator.tsx # Generator Data Sintetis UU PDP
│   │   │   ├── SanctionLetterModal.tsx # Generator Surat Teguran PP 86/2013 Siap Cetak
│   │   │   ├── DatasheetModal.tsx     # Panduan Form Data Sampel & e-Meterai 10k
│   │   │   └── ArchitectureDocsView.tsx # Viewer Terpadu Blueprint & DDL Schema
│   │   ├── types/wasrik.ts            # Definisi Type TypeScript
│   │   ├── data/mockData.ts           # Dataset Audit Realistis (KC Cikarang, dll.)
│   │   ├── App.tsx                    # Komponen Utama Aplikasi
│   │   ├── main.tsx                   # Entrypoint React 18
│   │   └── index.css                  # Desain Token Korporat Bersih (Tailwind)
│   ├── package.json                   # Dependensi Frontend
│   ├── vite.config.ts                 # Konfigurasi Vite Bundler
│   ├── tailwind.config.js             # Konfigurasi Palet Warna BPJS Green (#009640)
│   └── index.html                     # HTML Entrypoint
├── docker-compose.yml                 # Orkestrasi Kontainer Lengkap
├── setup_local.bat                    # Skrip Windows 1-Klik Otomatisasi Instalasi
├── run_backend.bat                    # Skrip Windows Menjalankan FastAPI (Port 8000)
├── run_frontend.bat                   # Skrip Windows Menjalankan React Vite (Port 5173)
├── run_all.bat                        # Skrip Windows Menjalankan Backend + Frontend
└── README.md                          # Dokumentasi Lengkap Proyek
```

---

## 5. Panduan Instalasi & Menjalankan Proyek (Windows 1-Click)

### Cara Cepat (Rekomendasi untuk Windows):
1. Buka folder `D:\projek warasik` di Windows Explorer.
2. Klik ganda berkas **`setup_local.bat`**.
   - Skrip akan otomatis membuat *Python Virtual Environment*, menginstal pustaka `requirements.txt`, dan menjalankan `npm install` untuk frontend.
3. Setelah instalasi selesai, klik ganda berkas **`run_all.bat`**.
   - Jendela 1: Menjalankan Backend FastAPI di `http://localhost:8000`.
   - Jendela 2: Menjalankan Frontend Vite di `http://localhost:5173`.
4. Buka peramban (browser) dan akses **`http://localhost:5173`**.

---

## 6. Skenario Demonstrasi untuk Dewan Juri Healthkathon

1. **Halaman Landing Pitch (`/`)**:
   - Paparkan latar belakang masalah 523.000 pemberi kerja tidak patuh dan potensi kebocoran iuran Rp 4,25 Triliun.
2. **Login Portal SSO (`/login`)**:
   - Gunakan fitur preset 1-klik untuk beralih antara akun:
     - *Auditor Wasrik Madya* (Darmawan Lahru Riatma)
     - *Kepala Kantor Cabang* (Siti Rahmawati, S.E.)
     - *Perwakilan Badan Usaha* (Bambang Triyono - HR Director)
     - *System Administrator*
3. **Priority Queue (`Antrean Prioritas BU`)**:
   - Tinjau urutan prioritas risiko: Critical, High, Medium, Low dengan filter dan pencarian instan.
4. **Dual-Pane HITL Workbench**:
   - Tunjukkan bukti digital slip gaji dengan *bounding box* sorotan merah anomali upah Rp 3.200.000/bln.
   - Periksa jejak logika AI (*Chain-of-Thought*).
   - Klik **Approve Temuan** atau **Override Value**.
   - Klik **Draf Surat Teguran (PP 86/2013)** untuk melihat surat dinas resmi siap cetak.
5. **Pemeriksaan Mandiri Berkas Dokumen (`Upload Berkas`)**:
   - Unggah berkas data payroll Anda sendiri dan muat langsung ke workbench.
6. **Data Sintetis UU PDP (`Data Sintetis`)**:
   - Uji pembuatan 1.000 sampel data terenkripsi SHA-256 dan unduh berkas CSV/JSON.
7. **Panduan Formulir Data Sampel & e-Meterai 10k**:
   - Buka melalui tombol hijau di header atau sidebar untuk menyalin teks resmi permohonan dataset Healthkathon 2026.

---

*Hak Cipta © 2026 Tim Pengembang WasrikAgent AI — BPJS Kesehatan Healthkathon 2026.*
