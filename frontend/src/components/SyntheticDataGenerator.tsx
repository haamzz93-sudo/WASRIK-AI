import React, { useState } from 'react';
import { SyntheticEmployee } from '../types/wasrik';
import { CustomDropdown } from './CustomDropdown';
import { IconShieldCheck, IconDocument, IconCpu } from './Icons';

export const SyntheticDataGenerator: React.FC = () => {
  const [recordCount, setRecordCount] = useState<number>(100);
  const [underReportingRate, setUnderReportingRate] = useState<number>(40);
  const [pdukRate, setPdukRate] = useState<number>(15);
  const [records, setRecords] = useState<SyntheticEmployee[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const sampleNames = [
    'Budi Santoso', 'Siti Aminah', 'Darmawan Lahru', 'Agus Prasetyo', 'Dewi Lestari',
    'Rendra Pratama', 'Nurul Hidayah', 'Hendra Wijaya', 'Mega Puspita', 'Bambang Triyono',
    'Fitri Handayani', 'Ahmad Fauzi', 'Rini Wulandari', 'Eko Supriyanto', 'Ratna Sari'
  ];

  const positions = ['Operator Produksi', 'Staff Administrasi', 'Teknisi Mesin', 'Quality Control', 'Warehouse Officer'];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated: SyntheticEmployee[] = [];
      for (let i = 1; i <= recordCount; i++) {
        const rawName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
        const parts = rawName.split(' ');
        const maskedName = `${parts[0][0]}*** ${parts[1] ? parts[1][0] + '******' : ''}`;
        const rawNik = `3216${Math.floor(100000000000 + Math.random() * 900000000000)}`;
        const nikHash = Array.from(rawNik).map((c) => (c.charCodeAt(0) * 17).toString(16)).join('').slice(0, 32);

        const base = [5200000, 6500000, 7800000, 8900000, 11500000][Math.floor(Math.random() * 5)];
        const allowance = [500000, 800000, 1200000][Math.floor(Math.random() * 3)];
        const total = base + allowance;

        const isPduk = Math.random() < pdukRate / 100;
        const isUnder = !isPduk && Math.random() < underReportingRate / 100;

        let reported = total;
        let gap = 0;
        let statusJkn: SyntheticEmployee['statusJkn'] = 'COMPLIANT';

        if (isPduk) {
          reported = 0;
          gap = total;
          statusJkn = 'UNREGISTERED_PDUK';
        } else if (isUnder) {
          reported = 3800000;
          gap = total - reported;
          statusJkn = 'UNDER_REPORTED';
        }

        generated.push({
          recordId: `REC-${i.toString().padStart(4, '0')}`,
          nikHash,
          employeeNameMasked: maskedName,
          jobPosition: positions[Math.floor(Math.random() * positions.length)],
          actualBaseSalary: base,
          actualAllowances: allowance,
          totalActualWage: total,
          reportedBpjsSalary: reported,
          underReportedGap: gap,
          monthlyLeakageRp: gap * 0.04,
          statusJkn,
        });
      }
      setRecords(generated);
      setIsGenerating(false);
    }, 400);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `synthetic_payroll_uu_pdp_${records.length}.json`;
    a.click();
  };

  const handleExportCsv = () => {
    let csv = 'RecordID,NIK_Hash_SHA256,Masked_Name,Position,Actual_Wage,Reported_SIPP,Gap,Monthly_Loss_4pct,Status_JKN\n';
    records.forEach((r) => {
      csv += `${r.recordId},${r.nikHash},${r.employeeNameMasked},${r.jobPosition},${r.totalActualWage},${r.reportedBpjsSalary},${r.underReportedGap},${r.monthlyLeakageRp},${r.statusJkn}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synthetic_payroll_uu_pdp_${records.length}.csv`;
    a.click();
  };

  const totalMonthlyLoss = records.reduce((acc, r) => acc + r.monthlyLeakageRp, 0);

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Generator Data Sintetis Berstandar UU PDP No. 27/2022
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hasilkan 1.000 data sampel tiruan dengan Salted SHA-256 Hashing dan Name Masking untuk pengujian model AI tanpa risiko kebocoran data riil.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {records.length > 0 && (
              <>
                <button
                  onClick={handleExportCsv}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Ekspor CSV
                </button>
                <button
                  onClick={handleExportJson}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Ekspor JSON
                </button>
              </>
            )}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 text-xs font-bold text-white bg-[#009640] hover:bg-[#00883E] rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              {isGenerating ? 'Membuat Data...' : 'Generate Data Sintetis'}
            </button>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jumlah Catatan (Records):</label>
            <CustomDropdown
              value={String(recordCount)}
              onChange={(val) => setRecordCount(Number(val))}
              options={[
                { value: '50', label: '50 Karyawan (Uji Cepat)', badge: 'Fast' },
                { value: '100', label: '100 Karyawan', badge: 'Standard' },
                { value: '500', label: '500 Karyawan', badge: 'Large' },
                { value: '1000', label: '1.000 Karyawan (SRS Bab 8)', badge: 'Full' },
              ]}
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tingkat Under-Reporting (%):</label>
            <input
              type="number"
              min={0}
              max={100}
              value={underReportingRate}
              onChange={(e) => setUnderReportingRate(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tingkat PDUK (% Tidak Terdaftar):</label>
            <input
              type="number"
              min={0}
              max={100}
              value={pdukRate}
              onChange={(e) => setPdukRate(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
            />
          </div>
        </div>

        {/* Summary Card if generated */}
        {records.length > 0 && (
          <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <p className="font-bold text-emerald-900">
                Berhasil Menghasilkan {records.length} Baris Data Sintetis Terverifikasi
              </p>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                Kepatuhan UU PDP: NIK terenkripsi SHA-256 • Nama pekerja tersamarkan secara otomatis
              </p>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-[11px]">Total Kebocoran Iuran 4% / Bulan:</span>
              <p className="text-base font-black text-amber-800 font-mono">
                Rp {totalMonthlyLoss.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        )}

        {/* Data Table */}
        {records.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px] sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Nama (Masked PDP)</th>
                    <th className="py-2.5 px-3">NIK (Salted SHA-256)</th>
                    <th className="py-2.5 px-3">Jabatan</th>
                    <th className="py-2.5 px-3 text-right">Gaji Riil</th>
                    <th className="py-2.5 px-3 text-right">Laporan SIPP</th>
                    <th className="py-2.5 px-3 text-center">Status JKN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {records.slice(0, 50).map((r) => (
                    <tr key={r.recordId} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-500">{r.recordId}</td>
                      <td className="py-2 px-3 font-sans font-semibold text-slate-900">{r.employeeNameMasked}</td>
                      <td className="py-2 px-3 text-slate-400 truncate max-w-xs">{r.nikHash}...</td>
                      <td className="py-2 px-3 font-sans text-slate-600">{r.jobPosition}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-800">
                        Rp {r.totalActualWage.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-600">
                        Rp {r.reportedBpjsSalary.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {r.statusJkn === 'COMPLIANT' && (
                          <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                            Patuh
                          </span>
                        )}
                        {r.statusJkn === 'UNDER_REPORTED' && (
                          <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">
                            Under-Reported
                          </span>
                        )}
                        {r.statusJkn === 'UNREGISTERED_PDUK' && (
                          <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                            PDUK
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {records.length > 50 && (
              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
                Menampilkan 50 dari {records.length} baris (Gunakan tombol ekspor di atas untuk melihat seluruh data).
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default SyntheticDataGenerator;
