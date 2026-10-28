import React, { useState } from 'react';
import { Employer, RiskLevel } from '../types/wasrik';

interface PriorityQueueViewProps {
  employers: Employer[];
  onSelectEmployer: (employer: Employer) => void;
  selectedEmployerId?: string;
}

export const PriorityQueueView: React.FC<PriorityQueueViewProps> = ({
  employers,
  onSelectEmployer,
  selectedEmployerId,
}) => {
  const [filterLevel, setFilterLevel] = useState<RiskLevel | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = employers.filter((emp) => {
    const matchesLevel = filterLevel === 'ALL' || emp.riskCategory === filterLevel;
    const matchesSearch =
      emp.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.npwp.includes(searchTerm) ||
      emp.branchOffice.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const getBadgeStyle = (category: RiskLevel) => {
    switch (category) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-800 border-red-300 font-bold';
      case 'HIGH':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
      case 'MEDIUM':
        return 'bg-sky-50 text-sky-800 border-sky-300';
      case 'LOW':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Header & National Scope Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Antrean Prioritas Pengawasan Badan Usaha (Priority Queue)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Diurutkan berdasarkan Algoritma Scoring Wasrik Multi-Agent • Matriks 523.000 Perusahaan Berisiko
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-xs text-xs">
            <span className="text-slate-500">Total Terpantau:</span>{' '}
            <span className="font-extrabold text-slate-900">523.000 BU</span>
          </div>
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-xs text-xs">
            <span className="text-slate-500">Potensi Revenue Leakage:</span>{' '}
            <span className="font-extrabold text-emerald-700">Rp 4,25 Triliun</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Risk Category Tabs */}
        <div className="flex items-center gap-1.5">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterLevel === lvl
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl === 'ALL' ? 'Semua Risiko' : lvl}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari Badan Usaha / NPWP / KC..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Priority Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Badan Usaha &amp; Sektor</th>
                <th className="py-3 px-4">Kantor Cabang</th>
                <th className="py-3 px-4 text-center">Rasio Pekerja</th>
                <th className="py-3 px-4 text-right">Tunggakan Iuran</th>
                <th className="py-3 px-4 text-center">Skor Risiko</th>
                <th className="py-3 px-4 text-center">Status Sanksi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((emp) => {
                const isSelected = emp.id === selectedEmployerId;
                const pdukCount = emp.totalActiveEmployees - emp.bpjsRegisteredEmployees;
                return (
                  <tr
                    key={emp.id}
                    onClick={() => onSelectEmployer(emp)}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                      isSelected ? 'bg-emerald-50/60' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-slate-900">{emp.companyName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        NPWP: {emp.npwp} • {emp.sectorName}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-semibold">
                      {emp.branchOffice}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-slate-800">
                        {emp.bpjsRegisteredEmployees} / {emp.totalActiveEmployees}
                      </span>
                      {pdukCount > 0 && (
                        <p className="text-[10px] text-red-600 font-semibold mt-0.5 flex items-center justify-center gap-1"><svg className="w-3 h-3 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> -{pdukCount} PDUK</p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono">
                      {emp.arrearsAmount > 0 ? (
                        <>
                          <p className="font-bold text-amber-800">
                            Rp {emp.arrearsAmount.toLocaleString('id-ID')}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {emp.arrearsMonths} bulan menunggak
                          </p>
                        </>
                      ) : (
                        <span className="text-emerald-700 font-bold">Lunas (0 bln)</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded text-xs border ${getBadgeStyle(emp.riskCategory)}`}>
                        {emp.complianceRiskScore} • {emp.riskCategory}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {emp.sanctionStatus === 'NORMAL' && (
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                          Belum Sanksi
                        </span>
                      )}
                      {emp.sanctionStatus === 'TEGURAN_1' && (
                        <span className="text-[10px] text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded font-bold">
                          Surat Teguran I
                        </span>
                      )}
                      {emp.sanctionStatus === 'TEGURAN_2' && (
                        <span className="text-[10px] text-red-800 bg-red-100 border border-red-300 px-2 py-0.5 rounded font-bold">
                          Surat Teguran II
                        </span>
                      )}
                      {emp.sanctionStatus === 'TMP2T_REKOMENDASI' && (
                        <span className="text-[10px] text-purple-900 bg-purple-100 border border-purple-300 px-2 py-0.5 rounded font-bold">
                          Rekomendasi TMP2T
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEmployer(emp);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-[#009640] hover:bg-[#00883E] rounded-md shadow-xs transition-colors"
                      >
                        Buka Audit HITL
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default PriorityQueueView;
