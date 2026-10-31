import React, { useState, useEffect } from 'react';

export interface TourStep {
  id: string;
  view: string;
  category: string;
  badge: string;
  title: string;
  whatIsIt: string;        // Artinya apa?
  howToUse: string;        // Cara penggunaannya & yang harus diapakan
  keyInsight: string;      // Dampak / Nilai Inti
  targetSelector?: string; // Optional element to highlight
  suggestedAction?: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'landing',
    view: 'landing',
    category: 'PORTAL EKSEKUTIF',
    badge: 'Langkah 1/9',
    title: 'Portal Pitching & Visi Solusi WasrikAgent AI',
    whatIsIt: 'Halaman pengantar eksekutif yang merangkum masalah defisit JKN akibat ketidakpatuhan pemberi kerja (pelaporan upah rendah & pekerja tidak didaftarkan) serta bagaimana sistem multi-agen AI menjawabnya.',
    howToUse: 'Gulir ke bawah untuk meninjau 4 tantangan utama wasrik konvensional, matriks kepatuhan PP 86/2013, dan video/diagram arsitektur sistem.',
    keyInsight: 'Memberikan gambaran holistik bagi Pimpinan BPJS Kesehatan & Dewan Juri sebelum menguji fungsionalitas teknis operasional.',
    suggestedAction: 'Klik "Selanjutnya" untuk masuk langsung ke ruang kerja verifikasi berkas audit (Workbench).',
  },
  {
    id: 'workbench',
    view: 'workbench',
    category: 'INTI INOVASI WASRIK',
    badge: 'Langkah 2/9',
    title: 'Dual-Pane Human-in-the-Loop (HITL) Workbench',
    whatIsIt: 'Ruang kerja inti petugas Wasrik. Sisi kiri menampilkan dokumen fisik slip gaji riil hasil pemindaian OCR Vision 300 DPI (dengan deteksi gap selisih upah 37.6%), dan sisi kanan menyajikan penalaran otonom 4 Agen AI (Chain-of-Thought).',
    howToUse: 'Bandingkan data fisik gaji riil vs data SIPP. Klik tombol merah "Draf Surat Teguran (PP 86/2013)" untuk melihat draf surat dinas resmi, lalu pilih gerbang keputusan: [Approve], [Override], atau [Tolak].',
    keyInsight: 'Mencegah AI "berhalusinasi" dengan tetap menempatkan otoritas hukum akhir di tangan Petugas Wasrik resmi (Human-in-the-Loop Governance).',
    suggestedAction: 'Coba klik tombol "Draf Surat Teguran" lalu periksa cetak A4 1 halaman dinas.',
  },
  {
    id: 'queue',
    view: 'queue',
    category: 'PRIORITAS AUDIT',
    badge: 'Langkah 3/9',
    title: 'Antrean Prioritas 523.000 Badan Usaha (Risk Engine)',
    whatIsIt: 'Daftar cerdas yang menyortir seluruh badan usaha di Indonesia dari tingkat risiko tertinggi (Highest Risk First), bukan sampling acak.',
    howToUse: 'Gunakan filter "Tingkat Risiko" (Critical, High, Medium), pilih Kantor Cabang (KC), atau cari nama perusahaan pada kolom pencarian. Klik salah satu kartu BU untuk langsung menginvestigasinya di Workbench.',
    keyInsight: 'Mengoptimalkan waktu kerja auditor yang terbatas agar berfokus pada 20% perusahaan dengan 80% potensi kebocoran iuran terbesar.',
    suggestedAction: 'Klik salah satu Badan Usaha di tabel antrean untuk melihat perpindahan kasus otomatis.',
  },
  {
    id: 'dashboard',
    view: 'dashboard',
    category: 'VISUALISASI MAKRO',
    badge: 'Langkah 4/9',
    title: 'Peta Sebaran Risiko & Potensi Kerugian Rp 4,25T',
    whatIsIt: 'Dasbor analitik geospasial nasional yang memetakan persebaran tingkat ketidakpatuhan di 38 provinsi serta agregat estimasi kebocoran dana JKN.',
    howToUse: 'Arahkan kursor pada kartu ringkasan eksekutif (Total Kerugian, Rasio Under-Reporting, Tingkat PDUK), serta pantau grafik sebaran industri paling rentan.',
    keyInsight: 'Membantu Direksi dan Kepala Kedeputian Wilayah dalam merumuskan kebijakan penegakan hukum dan alokasi personel wasrik ke zona merah.',
    suggestedAction: 'Amati visualisasi metrik kepatuhan makro lalu klik "Selanjutnya".',
  },
  {
    id: 'hermes',
    view: 'hermes',
    category: 'AI INVESTIGASI INTERAKTIF',
    badge: 'Langkah 5/9',
    title: 'Hermes Agent Console (:8787 Standalone)',
    whatIsIt: 'Antarmuka investigasi berbasis obrolan cerdas bertenaga model penalaran Nous-Hermes-3. Dilengkapi fallback otomatis ke Rule Engine MySQL untuk menjamin respons cepat tanpa resiko timeout.',
    howToUse: 'Ketik perintah audit pada input prompt atau klik chip pertanyaan cepat (misalnya: "Analisis BU-001 PT Cipta Busana Mandiri"). Amati bagaimana AI menjabarkan rantai berpikirnya langkah demi langkah.',
    keyInsight: 'Auditor dapat bertanya dalam bahasa Indonesia alami untuk membedah latar belakang temuan tanpa perlu menulis kueri SQL manual.',
    suggestedAction: 'Klik salah satu chip prompt rekomendasi untuk menguji respons inferensi live.',
  },
  {
    id: 'agents',
    view: 'agents',
    category: 'SIMULASI MULTI-AGENT',
    badge: 'Langkah 6/9',
    title: 'Simulator Multi-Agent LangGraph (4 Agen Spesialis)',
    whatIsIt: 'Simulasi interaktif orkestrasi 4 agen AI: Agen 1 (Payroll Intel OCR), Agen 2 (Workforce Classification PDUK), Agen 3 (Collusion & MCU Anomaly), dan Agen 4 (Supervisor Orchestrator).',
    howToUse: 'Klik tombol "Mulai Simulasi Multi-Agent" dan saksikan data dialirkan antar agen secara sekuensial dengan visualisasi status real-time.',
    keyInsight: 'Pemisahan tugas per agen menjamin isolasi logika pemeriksaan sehingga akurasi kalkulasi denda dan selisih iuran tetap terverifikasi.',
    suggestedAction: 'Perhatikan kartu output Agen 1 hingga Agen 4 yang saling memvalidasi data.',
  },
  {
    id: 'uploader',
    view: 'uploader',
    category: 'SELF-AUDIT & PENGUJIAN MANDIRI',
    badge: 'Langkah 7/9',
    title: 'Upload Berkas Payroll Mandiri (Bring Your Own Data)',
    whatIsIt: 'Fitur audit mandiri yang memungkinkan pengguna atau HR Badan Usaha mengunggah berkas penggajian asli (CSV / Excel) untuk diuji langsung oleh sistem.',
    howToUse: 'Klik tombol "Unduh Template CSV" atau seret berkas penggajian ke area upload, kemudian klik "Jalankan Audit OCR & SIPP". Sistem akan langsung mengkalkulasi anomali.',
    keyInsight: 'Membuktikan bahwa WasrikAgent AI bukan sekadar demo statis, melainkan produk fungsional yang siap memproses data mentah di dunia nyata.',
    suggestedAction: 'Gunakan tombol muat data sampel untuk melihat analisis instan berkas penggajian.',
  },
  {
    id: 'synthetic',
    view: 'synthetic',
    category: 'KEPATUHAN PRIVASI DATA',
    badge: 'Langkah 8/9',
    title: 'Generator Data Sintetis Berstandar UU PDP No. 27/2022',
    whatIsIt: 'Modul pembuat data pengujian tiruan dengan kepatuhan hukum privasi ketat: NIK disamarkan dengan Salted SHA-256 Hashing dan Nama Pekerja disamarkan (Name Masking).',
    howToUse: 'Tentukan jumlah baris data, persentase Under-Reporting, dan rasio PDUK, lalu klik "Generate Data Sintetis". Data dapat langsung diekspor ke CSV atau JSON.',
    keyInsight: 'Menjamin AI dapat dilatih dan diaudit oleh pihak ketiga secara aman tanpa pernah membocorkan data pribadi riil peserta BPJS Kesehatan.',
    suggestedAction: 'Klik "Generate Data Sintetis" lalu tinjau tabel hash enkripsi SHA-256.',
  },
  {
    id: 'docs',
    view: 'docs',
    category: 'STANDAR TEKNIS & INTEGRASI',
    badge: 'Langkah 9/9',
    title: 'Cetak Biru Arsitektur & 6 Port Federated Data Lake',
    whatIsIt: 'Dokumentasi teknis menyeluruh (Software Requirements Specification) dan pengujian live 6 port mikroservis Data Lake eksternal (DS-001 s/d DS-006).',
    howToUse: 'Klik tab navigasi bab (Arsitektur Multi-Agent, Skema SQL DDL, Spesifikasi REST/WebSocket, Skenario BDD Gherkin), atau klik tombol "Uji BU-001 / BU-002" untuk menembak API live port mikro.',
    keyInsight: 'Membuktikan kesiapan produksi tingkat enterprise sesuai standar regulasi BPJS Kesehatan, Kemnaker (WLKP), dan OSS BKPM.',
    suggestedAction: 'Klik tombol "Uji Langsung Endpoint BU-001" untuk melihat integrasi live Data Lake.',
  },
];

interface InteractiveTourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const InteractiveTourGuide: React.FC<InteractiveTourGuideProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [autoNavigate, setAutoNavigate] = useState(true);

  // Sync step with currentView if user navigates manually via sidebar
  useEffect(() => {
    const idx = TOUR_STEPS.findIndex((s) => s.view === currentView);
    if (idx !== -1 && idx !== currentStepIndex) {
      setCurrentStepIndex(idx);
    }
  }, [currentView]);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;
  const progressPercent = Math.round(((currentStepIndex + 1) / TOUR_STEPS.length) * 100);

  const goToStep = (index: number) => {
    if (index >= 0 && index < TOUR_STEPS.length) {
      setCurrentStepIndex(index);
      if (autoNavigate) {
        onNavigate(TOUR_STEPS[index].view);
      }
    }
  };

  const handleNext = () => {
    if (!isLast) {
      goToStep(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      goToStep(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-lg w-[calc(100vw-2rem)] sm:w-[480px] font-sans transition-all duration-300 animate-slide-up select-none">
      <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-2xl border border-emerald-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col text-white ring-1 ring-white/10">
        
        {/* Top Header Bar with Progress */}
        <div className="px-4 py-3 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)] shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
                  {currentStep.category}
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                  {currentStep.badge}
                </span>
              </div>
              <p className="text-xs font-bold text-white truncate">
                Panduan Interaktif WasrikAgent AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Minimize / Maximize Button */}
            <button
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isMinimized ? 'Perbesar Panduan' : 'Kecilkan Panduan'}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMinimized ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                )}
              </svg>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer"
              title="Tutup Panduan Tur"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Smooth Animated Progress Bar */}
        <div className="w-full bg-slate-800 h-1 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Content Body (Collapsible if Minimized) */}
        {!isMinimized && (
          <div className="p-4 sm:p-5 space-y-3.5 max-h-[70vh] overflow-y-auto">
            
            {/* Step Title */}
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug flex items-center gap-2">
                <span className="text-emerald-400">#{currentStepIndex + 1}</span>
                {currentStep.title}
              </h3>
            </div>

            {/* Box 1: Apa Artinya? (Konsep & Esensi) */}
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
                <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Apa Artinya? (Konsep &amp; Fungsi)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {currentStep.whatIsIt}
              </p>
            </div>

            {/* Box 2: Yang Harus Diapakan? (Cara Penggunaan Langsung) */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-1">
                <svg className="w-3.5 h-3.5 text-emerald-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span>Cara Menggunakan (Yang Harus Diapakan):</span>
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
                {currentStep.howToUse}
              </p>
            </div>

            {/* Box 3: Nilai Inti & Dampak */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <span className="text-amber-400 font-bold shrink-0">⚡ Insight:</span>
              <span className="text-slate-300 leading-tight">{currentStep.keyInsight}</span>
            </div>

            {/* Quick Step Indicators (Dots) */}
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                Langkah {currentStepIndex + 1} dari {TOUR_STEPS.length}
              </span>
              <div className="flex items-center gap-1">
                {TOUR_STEPS.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToStep(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentStepIndex
                        ? 'w-5 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                        : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={`Lompat ke langkah ${idx + 1}: ${s.title}`}
                  />
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handlePrev}
                disabled={isFirst}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Sebelumnya</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Lewati Tur
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 shadow-md shadow-emerald-950/40 transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-400/40"
                >
                  <span>{isLast ? 'Selesai Panduan ✓' : 'Selanjutnya »'}</span>
                  {!isLast && (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Minimized Compact Bar View */}
        {isMinimized && (
          <div className="px-4 py-2.5 flex items-center justify-between bg-slate-900 text-xs">
            <span className="text-slate-300 truncate max-w-[280px]">
              <strong className="text-emerald-400">#{currentStepIndex + 1}:</strong> {currentStep.title}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNext}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
              >
                {isLast ? 'Selesai' : 'Lanjut »'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InteractiveTourGuide;
