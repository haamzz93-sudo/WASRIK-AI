import React, { useState } from 'react';

interface DatasheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatasheetModal: React.FC<DatasheetModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formFields = [
    {
      no: '5',
      label: 'Kategori Lomba Healthkathon 2026',
      value: 'Efisiensi Risiko pada Pemberi Kerja',
      note: 'PILIH OPSI KE-3 (Bukan Fasilitas Kesehatan dan Bukan Peserta JKN)',
      key: 'kategori',
    },
    {
      no: '6',
      label: 'Periode Rilis Data Sampel',
      value: '2024',
      note: 'Tahun 2024 terkonsolidasi penuh 12 bulan & regulasi UMR terbaru (atau centang 2024 dan 2025 jika checkbox)',
      key: 'periode',
    },
    {
      no: 'Deskripsi',
      label: 'Deskripsi Singkat Pemanfaatan Data Sampel (Siap Salin)',
      value: `1. Tujuan: Mengembangkan platform WasrikAgent AI sebagai sistem kecerdasan audit berbasis Autonomous Multi-Agent dan Human-in-the-Loop (HITL) untuk mendeteksi secara dini ketidakpatuhan Pemberi Kerja (Badan Usaha segmen PPU). Solusi ini berfokus mendeteksi modus Pelaporan Upah Lebih Rendah (Under-Reporting Wage), Pendaftaran Pekerja Sebagian (PDUK), dan penunggakan iuran guna mencegah kebocoran iuran (Revenue Leakage) serta mendukung penegakan sanksi administratif sesuai PP No. 86 Tahun 2013.

2. Data yang Dibutuhkan:
- Master Profil Badan Usaha (NIB/ID, Sektor Industri, Skala Usaha, Wilayah Kantor Cabang).
- Data Rekapitulasi Pekerja & Upah Terlaporkan (Jumlah pekerja terdaftar segmen PPU dan basis upah yang dilaporkan).
- Data Transaksi & Status Iuran (Histori pembayaran, lama penunggakan, dan status tagihan).
- Sampel Data Agregat Utilisasi Klaim Faskes (Data ter-anonimisasi untuk validasi grafik anomali).

3. Cara Dipakai: Data sampel akan digunakan dalam lingkungan tertutup (Sandbox) untuk melatih dan menguji 4 Agen AI terspesialisasi (Payroll Agent, Workforce Classification Agent, Collusion Agent, dan Orchestrator) serta mengkalibrasi Deterministic Rule Engine dalam menghasilkan Corporate Risk Score (0–100) dan estimasi potensi kerugian finansial JKN (Rp). Hasil analisis disajikan pada antarmuka Dual-Pane HITL Workbench untuk divalidasi oleh Petugas Wasrik guna menghasilkan draf Surat Teguran resmi. Seluruh data diproses dengan kepatuhan penuh terhadap UU No. 27/2022 (UU PDP) menggunakan pseudonimisasi Salted SHA-256 Hashing dan Data Masking.`,
      note: 'Versi lengkap 3 poin (Tujuan, Data yang dibutuhkan, Cara dipakai)',
      key: 'deskripsi',
    },
    {
      no: 'Pernyataan',
      label: 'Pernyataan Integritas (Centang Ketiganya)',
      value: '1. Data sampel hanya saya gunakan untuk keperluan Healthkathon 2026.\n2. Saya tidak akan menyebarluaskan data sampel atau mencoba mengidentifikasi individu.\n3. Saya akan menghapus data sampel setelah kegiatan selesai.',
      note: 'Wajib dicentang SEMUA ketiga-tiganya agar link data sampel dikirim panitia.',
      key: 'pernyataan',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-50/80 border-b border-emerald-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Panduan Isian Form Data Sampel Healthkathon 2026
              </h2>
              <p className="text-[10px] text-slate-500">
                Diselaraskan 100% dengan Spesifikasi Kebutuhan Perangkat Lunak (SRS)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors flex items-center justify-center cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Alert Notice */}
          <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-blue-900 leading-relaxed flex items-start gap-2.5">
            <svg className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong>Petunjuk:</strong> Salin isian di bawah ini langsung ke formulir Microsoft Forms Healthkathon 2026 Anda.
            </span>
          </div>

          {formFields.map((field) => (
            <div key={field.key} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-xs">
                  {field.no !== 'Deskripsi' && field.no !== 'Pernyataan' && `Pertanyaan Nomor ${field.no}: `}
                  {field.label}
                </span>
                <button
                  onClick={() => handleCopy(field.value, field.key)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    copiedKey === field.key
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {copiedKey === field.key ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Salin Teks</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 whitespace-pre-wrap leading-relaxed shadow-2xs">
                {field.value}
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-semibold mt-2">
                <svg className="w-3.5 h-3.5 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>{field.note}</span>
              </div>
            </div>
          ))}

          {/* e-Meterai Guidance Box with Custom Scale of Justice SVG Icon */}
          <div className="border border-amber-300 bg-amber-50/80 rounded-2xl p-4 text-amber-950">
            <h3 className="font-bold text-xs text-amber-900 mb-1.5 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-800 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <span>Keabsahan e-Meterai Rp 10.000 pada Dokumen Pakta Integritas</span>
            </h3>
            <p className="text-[11px] leading-relaxed text-amber-900">
              Berdasarkan <strong>UU No. 10 Tahun 2020 tentang Bea Meterai</strong>, per 1 Januari 2021 tarif meterai resmi Indonesia adalah tarif tunggal <strong>Rp 10.000</strong>. Meskipun template dokumen panitia masih tertulis format lama Rp 6.000 (template 2020), penggunaan e-Meterai Rp 10.000 dari Peruri adalah <strong>100% SAH dan WAJIB SECARA HUKUM</strong>.
            </p>
            <p className="text-[10px] text-amber-800 mt-2 font-semibold">
              Tips: Letakkan e-meterai di sebelah kiri tanda tangan agar kode QR tidak tertutup tanda tangan dan terbaca valid oleh sistem verifikasi.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
export default DatasheetModal;
