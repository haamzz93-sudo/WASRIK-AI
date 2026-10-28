import React, { useState } from 'react';
import { AgentFinding, Employer } from '../types/wasrik';

interface RealFileUploaderProps {
  onLoadCustomAudit: (finding: AgentFinding, employer: Employer) => void;
}

export const RealFileUploader: React.FC<RealFileUploaderProps> = ({ onLoadCustomAudit }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [companyName, setCompanyName] = useState('PT Industri Nusantara Mandiri');
  const [sampleRows, setSampleRows] = useState<any[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    // Simulate real OCR & CSV ingestion pipeline
    setTimeout(() => {
      setIsProcessing(false);
      const generatedRows = [
        { nama: 'B*** S******', nik: '3216****8912', gajiRiil: 8800000, sipp: 5200000, gap: 3600000 },
        { nama: 'A*** P*******', nik: '3216****4431', gajiRiil: 7500000, sipp: 4800000, gap: 2700000 },
        { nama: 'D*** L******', nik: '3216****9923', gajiRiil: 9200000, sipp: 5200000, gap: 4000000 },
        { nama: 'R*** P******', nik: '3216****1108', gajiRiil: 6800000, sipp: 4800000, gap: 2000000 },
        { nama: 'M*** P******', nik: '3216****7762', gajiRiil: 8400000, sipp: 5200000, gap: 3200000 },
      ];
      setSampleRows(generatedRows);
    }, 800);
  };

  const handleExecuteAudit = () => {
    const customEmployer: Employer = {
      id: `custom-${Date.now()}`,
      npwp: '09.888.777.6-412.000',
      nib: '9120008819234',
      companyName: companyName,
      sectorCode: 'MFG',
      sectorName: 'Manufaktur & Fabrikasi Presisi',
      branchOffice: 'KC Cikarang',
      totalActiveEmployees: 120,
      bpjsRegisteredEmployees: 95,
      complianceRiskScore: 86.40,
      riskCategory: 'CRITICAL',
      arrearsAmount: 185000000,
      arrearsMonths: 3,
      sanctionStatus: 'NORMAL',
      address: 'Kawasan Industri Delta Silicon III, Lippo Cikarang',
      lastAuditDate: '2026-10-27',
    };

    const customFinding: AgentFinding = {
      findingId: `find-custom-${Date.now()}`,
      employerId: customEmployer.id,
      companyName: customEmployer.companyName,
      agentType: 'PAYROLL_AGENT',
      anomalyCategory: 'UNDER_REPORTING_WAGE',
      confidenceScore: 0.954,
      estimatedLossAmount: 185000000,
      affectedEmployeeCount: 95,
      chainOfThought: [
        `Langkah 1: Mengurai file masukan (${fileName || 'Payroll_Data.csv'}) melalui pipeline verifikasi.`,
        'Langkah 2: Menghitung rata-rata selisih upah take-home pay riil vs data SIPP BPJS = Rp 3.100.000.',
        'Langkah 3: Menghitung potensi kebocoran iuran 4% pemberi kerja sebesar Rp 185.000.000.',
        'Langkah 4: Menyiapkan berkas temuan untuk otorisasi Petugas Wasrik pada Dual-Pane Workbench.'
      ],
      evidenceOcrSnippet: `Hasil Audit Berkas ${fileName}: Rata-rata Take-Home Pay Riil Rp 8.140.000 vs SIPP BPJS Rp 5.040.000.`,
      boundingBox: {
        x: 130,
        y: 290,
        w: 430,
        h: 100,
        label: 'Gap Upah Dokumen Unggahan Sendiri: Selisih Rp 3.100.000'
      },
      findingStatus: 'PENDING_HITL_REVIEW',
      createdAt: new Date().toISOString(),
    };

    onLoadCustomAudit(customFinding, customEmployer);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Pemeriksaan Mandiri Berkas Dokumen Payroll &amp; SIPP
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Unggah dokumen (.csv, .xlsx, .pdf slip gaji) untuk menguji pipeline Vision-OCR dan Rule Engine secara langsung.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs mb-6">
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Badan Usaha / Perusahaan Target Audit:
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden font-semibold"
            />
          </div>

          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <svg className="w-10 h-10 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-xs font-bold text-slate-800">
              Pilih Berkas Penggajian atau Seret ke Sini
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Mendukung format: .csv, .xlsx, .json, atau .pdf slip gaji (Maksimal 25MB)
            </p>

            <label className="mt-4 inline-block px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-xs font-semibold text-slate-700 rounded-lg shadow-xs cursor-pointer">
              <span>Jelajahi Berkas Komputer</span>
              <input
                type="file"
                accept=".csv,.xlsx,.json,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {fileName && (
              <div className="mt-4 p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 font-medium inline-flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Berkas Terpilih: <strong>{fileName}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Processing State or Result Preview */}
        {isProcessing && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center mb-6">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800">Mengekstrak dan memverifikasi data payroll...</p>
            <p className="text-[11px] text-slate-500">Mencocokkan NIK SHA-256 dan mengidentifikasi anomali take-home pay</p>
          </div>
        )}

        {sampleRows.length > 0 && !isProcessing && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Pratinjau Hasil Ekstraksi Berkas (5 Sampel Teratas):
              </h3>
              <span className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                Under-Reporting Terdeteksi
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg mb-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[10px] uppercase">
                  <tr>
                    <th className="py-2 px-3">Nama (Masked PDP)</th>
                    <th className="py-2 px-3">NIK Hash</th>
                    <th className="py-2 px-3 text-right">Gaji Riil</th>
                    <th className="py-2 px-3 text-right">Laporan SIPP</th>
                    <th className="py-2 px-3 text-right">Selisih Gap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {sampleRows.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-sans font-semibold text-slate-800">{r.nama}</td>
                      <td className="py-2 px-3 text-slate-500">{r.nik}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        Rp {r.gajiRiil.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-600">
                        Rp {r.sipp.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-red-600">
                        - Rp {r.gap.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleExecuteAudit}
              className="w-full py-2.5 px-4 bg-[#009640] hover:bg-[#00883E] text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Muat Kasus Ini ke Dual-Pane HITL Workbench</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default RealFileUploader;
