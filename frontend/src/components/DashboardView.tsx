import React from 'react';

export const DashboardView: React.FC = () => {
  const branches = [
    { name: 'KC Cikarang (Pusat Industri Terbesar)', count: 18450, leakage: 'Rp 640 Miliar', risk: 'CRITICAL', pct: '88%' },
    { name: 'KC Karawang (Kawasan KIIC / Suryacipta)', count: 14200, leakage: 'Rp 510 Miliar', risk: 'HIGH', pct: '74%' },
    { name: 'KC Surabaya (Rungkut & Margomulyo)', count: 12100, leakage: 'Rp 430 Miliar', risk: 'HIGH', pct: '69%' },
    { name: 'KC Bandung (Tekstil & Manufaktur)', count: 15300, leakage: 'Rp 480 Miliar', risk: 'CRITICAL', pct: '82%' },
    { name: 'KC Tangerang (Batuceper & Cikupa)', count: 11900, leakage: 'Rp 390 Miliar', risk: 'HIGH', pct: '65%' },
    { name: 'KC Semarang (Kawasan Industri Candi)', count: 8700, leakage: 'Rp 290 Miliar', risk: 'MEDIUM', pct: '54%' },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Peta Sebaran Risiko Nasional &amp; Analitik Kebocoran Iuran
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Monitoring Makro 523.000 Pemberi Kerja Berisiko • BPJS Kesehatan Seluruh Indonesia
        </p>
      </div>

      {/* Top 4 Macro KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Potensi Revenue Leakage Nasional</span>
          <p className="text-2xl font-black text-slate-900 mt-2">Rp 4,25 Triliun</p>
          <p className="text-[10px] text-red-600 font-semibold mt-1">↑ Selisih iuran 4% pemberi kerja</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Badan Usaha Belum Patuh</span>
          <p className="text-2xl font-black text-red-700 mt-2">523.000 BU</p>
          <p className="text-[10px] text-slate-500 mt-1">59,5% dari 878.000 total BU aktif</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Pekerja Terdampak PDUK</span>
          <p className="text-2xl font-black text-amber-700 mt-2">1.820.000 Jiwa</p>
          <p className="text-[10px] text-slate-500 mt-1">Belum didaftarkan ke program JKN</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-300 bg-emerald-50/40 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase">Estimasi Pemulihan Iuran (Recovery)</span>
          <p className="text-2xl font-black text-emerald-700 mt-2">Rp 2,89 Triliun</p>
          <p className="text-[10px] text-emerald-800 font-semibold mt-1 flex items-center gap-1"><svg className="w-3 h-3 text-emerald-600 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Melalui intervensi WasrikAgent AI</p>
        </div>
      </div>

      {/* Regional Branch Breakdown & Heatmap Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch Office Hotspots */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">
              Sebaran Hotspot Kantor Cabang (KC) Wasrik Prioritas
            </h2>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
              Aggregated Live Feed
            </span>
          </div>

          <div className="space-y-4">
            {branches.map((b, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800">{b.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-800">{b.leakage}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      b.risk === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.risk}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${b.risk === 'CRITICAL' ? 'bg-red-600' : 'bg-amber-500'}`}
                    style={{ width: b.pct }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                  <span>{b.count.toLocaleString()} Badan Usaha Terdaftar</span>
                  <span>Tingkat Anomali: {b.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown by Non-Compliance Modus */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-4">
              Komposisi Modus Ketidakpatuhan
            </h2>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex justify-between font-bold text-red-900">
                  <span>Under-Reporting Wage</span>
                  <span>54% (Rp 2,29 T)</span>
                </div>
                <p className="text-[10px] text-red-700 mt-1">
                  Melaporkan upah di bawah take-home pay riil untuk mengecilkan porsi iuran 4% pemberi kerja.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex justify-between font-bold text-amber-900">
                  <span>PDUK (Pekerja Sebagian)</span>
                  <span>32% (Rp 1,36 T)</span>
                </div>
                <p className="text-[10px] text-amber-700 mt-1">
                  Mendaftarkan hanya karyawan kantor pusat dan menyembunyikan pekerja harian/outsourcing pabrik.
                </p>
              </div>

              <div className="p-3 bg-sky-50 rounded-lg border border-sky-200">
                <div className="flex justify-between font-bold text-sky-900">
                  <span>Penunggakan &amp; Fraud Sakit</span>
                  <span>14% (Rp 0,60 T)</span>
                </div>
                <p className="text-[10px] text-sky-700 mt-1">
                  Pemotongan 1% iuran dari gaji pekerja namun tidak disetorkan atau tunggakan melebihi 3 bulan.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Sumber Data: Data Konsolidasi SIPP &amp; WLKP Kemnaker (Validasi Wasrik 2026)
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardView;
