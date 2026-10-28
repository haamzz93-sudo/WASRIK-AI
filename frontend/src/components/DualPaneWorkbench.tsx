import React, { useState } from 'react';
import { AgentFinding, Employer } from '../types/wasrik';

interface DualPaneWorkbenchProps {
  finding: AgentFinding;
  employer: Employer;
  onApprove: (findingId: string, notes: string) => void;
  onOverride: (findingId: string, adjustedLoss: number, notes: string) => void;
  onReject: (findingId: string, notes: string) => void;
  onOpenSanctionModal: (finding: AgentFinding, employer: Employer) => void;
}

export const DualPaneWorkbench: React.FC<DualPaneWorkbenchProps> = ({
  finding,
  employer,
  onApprove,
  onOverride,
  onReject,
  onOpenSanctionModal,
}) => {
  const [decisionMode, setDecisionMode] = useState<'APPROVED' | 'OVERRIDDEN' | 'REJECTED' | null>(null);
  const [adjustedLoss, setAdjustedLoss] = useState<number>(finding.estimatedLossAmount);
  const [notes, setNotes] = useState<string>(
    'Bukti slip gaji dan data absensi telah diverifikasi silang dengan SIPP. Terkonfirmasi selisih pelaporan upah.'
  );
  const [activeTab, setActiveTab] = useState<'xai' | 'timeline' | 'regulasi'>('xai');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(finding.findingStatus !== 'PENDING_HITL_REVIEW');

  const handleActionSubmit = () => {
    if (!decisionMode) return;
    if (decisionMode === 'APPROVED') {
      onApprove(finding.findingId, notes);
    } else if (decisionMode === 'OVERRIDDEN') {
      onOverride(finding.findingId, adjustedLoss, notes);
    } else if (decisionMode === 'REJECTED') {
      onReject(finding.findingId, notes);
    }
    setIsSubmitted(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F17] overflow-hidden font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Banner / Case Overview */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-3.5 sm:px-6 py-3 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 shrink-0 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800">
              SKOR RISIKO: {employer.complianceRiskScore} • {employer.riskCategory}
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {finding.findingId}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            {employer.companyName}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            NPWP: {employer.npwp} • Sektor: {employer.sectorName} • {employer.branchOffice}
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between md:justify-end gap-3 sm:gap-6 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
          <div className="text-right">
            <p className="text-[11px] font-semibold text-slate-500">Potensi Kebocoran Iuran JKN</p>
            <p className="text-lg font-black text-amber-700 dark:text-amber-400 font-mono">
              Rp {finding.estimatedLossAmount.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[11px] font-semibold text-slate-500">Karyawan Terdampak</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-100">
              {finding.affectedEmployeeCount} <span className="text-xs font-normal text-slate-500">Orang</span>
            </p>
          </div>

          <button
            onClick={() => onOpenSanctionModal(finding, employer)}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Draf Surat Teguran (PP 86/2013)
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Screen */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* ================= LEFT PANE: OCR PDF & EVIDENCE VIEWER ================= */}
        <div className="w-full lg:w-1/2 p-4 md:p-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 overflow-y-auto bg-slate-100/60 dark:bg-slate-950/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Bukti Dokumen Fisik OCR (300 DPI Vision Pipeline)
              </h2>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
              Batch: Slip_Gaji_Q3_2026.pdf • Hal 12/150
            </span>
          </div>

          {/* Interactive OCR Physical Slip Simulation in Official Document Font (Times New Roman) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700/80 shadow-sm p-6 relative overflow-hidden font-document text-slate-900 dark:text-slate-100 leading-normal">
            {/* Watermark Tag */}
            <div className="absolute right-4 top-4 font-sans text-[9px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full">
              VERIFIKASI OCR WASRIK AI: 94.2% CONFIDENCE
            </div>

            {/* Slip Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-black text-sm uppercase tracking-wide text-slate-900 dark:text-white font-sans">
                {employer.companyName}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                SLIP GAJI KARYAWAN TETAP • PERIODE: SEPTEMBER 2026
              </p>
              <div className="mt-3 grid grid-cols-2 text-xs text-slate-700 dark:text-slate-300 font-sans gap-2">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Nama:</span> B*** S****** (Masked PDP)
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">NIK (SHA-256):</span> e3b0c442...89a
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Jabatan:</span> Teknisi Manufaktur Senior
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">No. Rekening:</span> 0088-****-1982
                </div>
              </div>
            </div>

            {/* Salary Breakdown Table */}
            <div className="space-y-2 text-xs font-sans">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300">Gaji Pokok Riil</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">Rp 7.000.000</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300">Tunjangan Jabatan &amp; Tetap</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">Rp 1.500.000</span>
              </div>
              <div className="flex justify-between py-2 bg-slate-100/90 dark:bg-slate-800/90 px-3 rounded-xl font-bold">
                <span className="text-slate-900 dark:text-slate-100">Total Take-Home Pay Riil (Dasar Iuran PP 86):</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 text-sm">Rp 8.500.000</span>
              </div>
            </div>

            {/* Red Bounding Box Anomaly Highlighter with Vector Icon */}
            <div className="mt-4 p-3.5 rounded-xl border-2 border-red-500 bg-red-50/70 dark:bg-red-950/40 relative font-sans">
              <div className="absolute -top-3 left-3 bg-red-600 text-white text-[9.5px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
                </svg>
                <span>Bounding Box Deteksi Anomali</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                <div>
                  <p className="text-[10.5px] text-red-700 dark:text-red-400 font-semibold">Gaji Dilaporkan ke SIPP JKN:</p>
                  <p className="text-base font-black text-red-900 dark:text-red-300 font-mono">Rp 5.300.000</p>
                </div>
                <div>
                  <p className="text-[10.5px] text-red-700 dark:text-red-400 font-semibold">Under-Reporting Gap:</p>
                  <p className="text-base font-black text-red-900 dark:text-red-300 font-mono">- Rp 3.200.000 (37.6%)</p>
                </div>
              </div>
              <p className="text-[10.5px] text-red-800 dark:text-red-300 mt-2 font-medium leading-relaxed">
                Potongan Iuran Terlaporkan: 4% x Rp 5.300.000 = Rp 212.000. Harusnya: 4% x Rp 8.500.000 = Rp 340.000 (Selisih Rp 128.000/karyawan/bln).
              </p>
            </div>

            {/* Document Footer */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-sans">
              <span>Dicetak otomatis oleh payroll core HRIS</span>
              <span>Dokumen Bukti Audit Wasrik No: AUD-2026-CKR-0012</span>
            </div>
          </div>

          <div className="mt-4 p-3.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 rounded-xl text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5 font-sans">
            <svg className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong className="font-bold">Dasar Regulasi Pemeriksaan:</strong> Sesuai Pasal 16 UU BPJS No. 24/2011 dan PP No. 86/2013, Pemberi Kerja wajib memungut dan menyetorkan iuran dari total upah riil yang diterima pekerja.
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANE: XAI & HITL DECISION GATE ================= */}
        <div className="w-full lg:w-1/2 p-4 md:p-6 overflow-y-auto bg-white dark:bg-slate-900 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('xai')}
                className={`py-2 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'xai'
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Explainable AI (Chain-of-Thought)
              </button>
              <button
                onClick={() => setActiveTab('regulasi')}
                className={`py-2 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'regulasi'
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Matriks Regulasi &amp; UU PDP
              </button>
            </div>

            {/* TAB CONTENT: XAI Chain of Thought */}
            {activeTab === 'xai' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Penalaran Multi-Agent (Autonomous Reasoning):
                  </h3>
                  <div className="space-y-2.5">
                    {finding.chainOfThought.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed font-medium">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tingkat Keyakinan AI</span>
                    <p className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                      {(finding.confidenceScore * 100).toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Model: Gemini 3.8 Flash Vision</p>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Validasi HITL</span>
                    <p className="text-xl font-black text-amber-700 dark:text-amber-400 mt-1">
                      {isSubmitted ? 'TERCATAT' : 'PENDING'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Otorisasi Petugas Wasrik</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Matriks Regulasi */}
            {activeTab === 'regulasi' && (
              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-white mb-1">PP No. 86 Tahun 2013 - Tata Cara Pengenaan Sanksi</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-document text-sm">
                    Pemberi Kerja yang tidak memungut atau menyetor iuran dikenakan sanksi administratif bertahap: Surat Teguran I (10 hari kerja), Surat Teguran II (10 hari kerja), Denda 0,1%, dan Rekomendasi Tidak Mendapat Pelayanan Publik Tertentu (TMP2T).
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-white mb-1">UU No. 27 Tahun 2022 - Perlindungan Data Pribadi (PDP)</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-document text-sm">
                    Seluruh identitas pekerja dalam sistem ini telah melalui Salted SHA-256 Hashing dan Data Masking pada nama, sehingga mematuhi prinsip keabsahan pemrosesan data privasi.
                  </p>
                </div>
              </div>
            )}

            {/* ================= HITL DECISION GATE BOX ================= */}
            <div className="p-5 bg-slate-50/90 dark:bg-slate-900/90 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xs">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-700 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <span>Gerbang Keputusan Auditor (HITL Governance Gate)</span>
                </span>
                {decisionMode && (
                  <span className="text-[10px] font-bold text-emerald-900 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    Pilihan: {decisionMode}
                  </span>
                )}
              </h3>

              <div className="grid grid-cols-3 gap-2.5 mb-3.5">
                <button
                  type="button"
                  onClick={() => setDecisionMode('APPROVED')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    decisionMode === 'APPROVED'
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-emerald-600'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Approve</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDecisionMode('OVERRIDDEN')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    decisionMode === 'OVERRIDDEN'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-amber-600'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Override</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDecisionMode('REJECTED')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    decisionMode === 'REJECTED'
                      ? 'bg-red-700 text-white border-red-800 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-red-600'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Tolak</span>
                </button>
              </div>

              {decisionMode === 'OVERRIDDEN' && (
                <div className="mb-3.5 p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-amber-300 dark:border-amber-700/60 shadow-2xs">
                  <label className="block text-[11px] font-bold text-amber-950 dark:text-amber-300 mb-1">
                    Koreksi Nominal Kerugian Iuran (Rp):
                  </label>
                  <input
                    type="number"
                    value={adjustedLoss}
                    onChange={(e) => setAdjustedLoss(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] text-amber-800 mt-1">
                    Nilai penyesuaian akan memicu Active Learning Feedback Loop ke basis data MySQL.
                  </p>
                </div>
              )}

              <div className="mb-3.5">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Resmi Auditor Wasrik (Audit Trail):
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full p-3 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium text-slate-900 dark:text-slate-100"
                  placeholder="Tuliskan justifikasi hukum atau bukti tambahan..."
                />
              </div>

              <button
                type="button"
                onClick={handleActionSubmit}
                disabled={!decisionMode}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  decisionMode
                    ? 'bg-[#009640] hover:bg-[#00883E] text-white shadow-md cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Konfirmasi Tindakan &amp; Catat Audit Trail</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DualPaneWorkbench;
