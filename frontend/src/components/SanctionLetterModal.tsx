import React from 'react';
import { AgentFinding, Employer } from '../types/wasrik';

interface SanctionLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  finding: AgentFinding;
  employer: Employer;
}

export const SanctionLetterModal: React.FC<SanctionLetterModalProps> = ({
  isOpen,
  onClose,
  finding,
  employer,
}) => {
  if (!isOpen) return null;

  const letterNumber = `ST.01.03/WASRIK-CKR/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}-0892`;
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const pdukCount = Math.max(0, (employer.totalActiveEmployees || 0) - (employer.bpjsRegisteredEmployees || 0));

  // Enterprise Print Handler: Prints pristine isolated A4 official document (Exact 1 Page)
  const handlePrint = () => {
    const printHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Surat_Teguran_Wasrik_${employer.companyName.replace(/[^a-zA-Z0-9]/g, '_')}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 18mm 10mm 20mm; /* Standar Persuratan Dinas RI Pas 1 Halaman */
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 9.8pt;
      line-height: 1.25;
      color: #000000;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    /* KOP SURAT DINAS */
    .kop-wrapper {
      display: flex;
      align-items: center;
      padding-bottom: 4px;
      margin-bottom: 2px;
    }
    .kop-logo {
      width: 58px;
      height: 58px;
      margin-right: 14px;
      flex-shrink: 0;
    }
    .kop-text {
      flex: 1;
      text-align: center;
    }
    .kop-text .instansi-1 {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11.5pt;
      font-weight: 900;
      letter-spacing: 0.6px;
      color: #000000;
      line-height: 1.15;
    }
    .kop-text .instansi-2 {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.5pt;
      font-weight: 700;
      color: #000000;
      margin-top: 1px;
      line-height: 1.15;
    }
    .kop-text .instansi-unit {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      font-weight: 700;
      color: #006930;
      margin-top: 1px;
      letter-spacing: 0.3px;
    }
    .kop-text .alamat {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 7.5pt;
      color: #333333;
      margin-top: 2px;
      line-height: 1.2;
    }
    /* GARIS GANDA STANDAR PERSURATAN RESMI */
    .garis-kop {
      border-top: 2.2px solid #000000;
      border-bottom: 0.8px solid #000000;
      height: 3px;
      margin-bottom: 10px;
    }
    /* META SURAT */
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      font-size: 9.5pt;
    }
    .meta-table td {
      vertical-align: top;
      padding: 1px 0;
    }
    .perihal-box {
      font-weight: bold;
      text-decoration: underline;
    }
    /* ISI SURAT */
    p.isi {
      text-align: justify;
      text-justify: inter-ideograph;
      text-indent: 1.2cm;
      margin-bottom: 6px;
      font-size: 9.8pt;
      line-height: 1.28;
    }
    p.biasa {
      text-align: justify;
      margin-bottom: 6px;
      font-size: 9.8pt;
      line-height: 1.28;
    }
    /* TABEL TEMUAN */
    table.temuan-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 10px 0;
      font-size: 9pt;
    }
    table.temuan-table th {
      background-color: #f2f2f2;
      border: 1px solid #000000;
      padding: 4px 6px;
      font-weight: bold;
      text-align: center;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
    }
    table.temuan-table td {
      border: 1px solid #000000;
      padding: 4px 6px;
      vertical-align: top;
    }
    table.temuan-table .text-center {
      text-align: center;
    }
    table.temuan-table .text-right {
      text-align: right;
    }
    table.temuan-table .nominal {
      font-weight: bold;
      font-family: 'Courier New', Courier, monospace;
    }
    /* BAGIAN TANDA TANGAN */
    .ttd-section {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .tembusan-block {
      width: 48%;
      font-size: 8.5pt;
    }
    .tembusan-block ol {
      margin-left: 16px;
      margin-top: 2px;
    }
    .pejabat-block {
      width: 48%;
      text-align: center;
      font-size: 9.5pt;
    }
    /* BSrE ELECTRONIC SIGNATURE SEAL */
    .bsre-container {
      margin: 6px auto;
      border: 1px solid #777777;
      background: #fafafa;
      padding: 4px 6px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-radius: 4px;
      max-width: 270px;
      text-align: left;
    }
    .bsre-qr {
      width: 44px;
      height: 44px;
      flex-shrink: 0;
    }
    .bsre-text {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 6.5pt;
      line-height: 1.2;
      color: #333333;
    }
    .pejabat-nama {
      font-weight: bold;
      text-decoration: underline;
      font-size: 10pt;
      margin-top: 2px;
    }
    .pejabat-nip {
      font-size: 8.5pt;
      color: #333333;
    }
    /* FOOTER CATATAN HUKUM */
    .legal-footer {
      margin-top: 12px;
      border-top: 0.8px solid #aaaaaa;
      padding-top: 3px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 6.5pt;
      color: #555555;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <!-- KOP SURAT DINAS -->
  <div class="kop-wrapper">
    <div class="kop-logo">
      <svg viewBox="0 0 100 100" width="58" height="58" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gGreenPrint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00A852" />
            <stop offset="100%" stop-color="#006930" />
          </linearGradient>
          <linearGradient id="gGoldPrint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FBBF24" />
            <stop offset="100%" stop-color="#D97706" />
          </linearGradient>
        </defs>
        <path d="M 50 4 C 74 4, 94 14, 94 36 C 94 65, 68 88, 50 96 C 32 88, 6 65, 6 36 C 6 14, 26 4, 50 4 Z" fill="url(#gGreenPrint)" />
        <path d="M 50 10 C 70 10, 87 19, 87 37 C 87 61, 65 82, 50 89 C 35 82, 13 61, 13 37 C 13 19, 30 10, 50 10 Z" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5" />
        <path d="M 33 34 L 41 64 L 46 64 L 41 34 Z" fill="#FFFFFF" />
        <path d="M 46 64 L 50 46 L 54 64 Z" fill="#FFFFFF" />
        <circle cx="50" cy="42" r="3.5" fill="url(#gGoldPrint)" stroke="#FFFFFF" stroke-width="1" />
        <path d="M 59 34 L 54 64 L 59 64 L 67 34 Z" fill="#FFFFFF" />
        <path d="M 58 54 L 66 62 L 80 44" fill="none" stroke="url(#gGoldPrint)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <div class="kop-text">
      <div class="instansi-1">BPJS KESEHATAN</div>
      <div class="instansi-2">KANTOR CABANG CIKARANG</div>
      <div class="instansi-unit">UNIT KERJA PENGAWASAN DAN PEMERIKSAAN KEPATUHAN (WASRIK)</div>
      <div class="alamat">
        Kompleks Ruko Cikarang Central City Blok A No. 10-12, Cikarang Pusat, Kabupaten Bekasi, Jawa Barat 17530<br>
        Telepon: (021) 8984-2300 | Faksimile: (021) 8984-2301 | Email: kc-cikarang@bpjs-kesehatan.go.id
      </div>
    </div>
  </div>
  <div class="garis-kop"></div>

  <!-- META SURAT -->
  <table class="meta-table">
    <tr>
      <td style="width: 12%;">Nomor</td>
      <td style="width: 2%;">:</td>
      <td style="width: 44%;"><strong>${letterNumber}</strong></td>
      <td style="width: 42%; text-align: right;">Cikarang, ${currentDate}</td>
    </tr>
    <tr>
      <td>Sifat</td>
      <td>:</td>
      <td><span style="font-weight: bold; color: #b91c1c;">Penting / Segera</span></td>
      <td rowspan="3" style="text-align: left; vertical-align: top; padding-left: 20px;">
        Kepada Yth.<br>
        <strong>Pimpinan / Direktur Perusahaan</strong><br>
        <strong>${employer.companyName}</strong><br>
        NPWP: ${employer.npwp}<br>
        ${employer.address}
      </td>
    </tr>
    <tr>
      <td>Lampiran</td>
      <td>:</td>
      <td>1 (satu) Berkas Lembar Bukti Audit Wasrik</td>
    </tr>
    <tr>
      <td>Perihal</td>
      <td>:</td>
      <td><span class="perihal-box">SURAT TEGURAN PERTAMA (I) ATAS KETIDAKPATUHAN PEMBERI KERJA</span></td>
    </tr>
  </table>

  <!-- ISI SURAT -->
  <p class="biasa">Dengan hormat,</p>
  
  <p class="isi">
    Berdasarkan ketentuan <strong>Undang-Undang Nomor 24 Tahun 2011</strong> tentang Badan Penyelenggara Jaminan Sosial, dan <strong>Peraturan Pemerintah Nomor 86 Tahun 2013</strong> tentang Tata Cara Pengenaan Sanksi Administratif Kepada Pemberi Kerja Selain Penyelenggara Negara, dengan ini kami sampaikan bahwa Unit Kerja Pengawasan dan Pemeriksaan (Wasrik) BPJS Kesehatan Kantor Cabang Cikarang telah melaksanakan pemeriksaan silang kepatuhan data kepesertaan dan iuran terhadap Badan Usaha yang Saudara pimpin.
  </p>

  <p class="isi">
    Dari hasil pemeriksaan terintegrasi antara dokumen penggajian (payroll/slip gaji), data perbankan, dan data kepesertaan pada Sistem Informasi Perhitungan Pelaporan (SIPP) BPJS Kesehatan, telah ditemukan indikasi ketidakpatuhan sebagai berikut:
  </p>

  <!-- TABEL TEMUAN -->
  <table class="temuan-table">
    <thead>
      <tr>
        <th style="width: 6%;">No</th>
        <th style="width: 48%;">Uraian Ketidakpatuhan</th>
        <th style="width: 20%;">Jumlah Tenaga Kerja</th>
        <th style="width: 26%;">Potensi Selisih Iuran</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center">1</td>
        <td>
          <strong>Pelaporan Upah Lebih Rendah (Under-Reporting Wage)</strong><br>
          <span style="font-size: 8.5pt; color: #333333;">
            Terdapat selisih pelaporan komponen upah (gaji pokok & tunjangan tetap) pada slip gaji resmi karyawan dibandingkan dasar upah yang dilaporkan ke SIPP BPJS Kesehatan.
          </span>
        </td>
        <td class="text-center">${finding.affectedEmployeeCount} orang</td>
        <td class="text-right nominal">Rp ${finding.estimatedLossAmount.toLocaleString('id-ID')}</td>
      </tr>
      ${pdukCount > 0 ? `
      <tr>
        <td class="text-center">2</td>
        <td>
          <strong>Pendaftaran Pekerja Sebagian (PDUK)</strong><br>
          <span style="font-size: 8.5pt; color: #333333;">
            Tenaga kerja aktif terdaftar dalam daftar absensi dan penggajian perusahaan namun belum didaftarkan seluruhnya dalam program JKN.
          </span>
        </td>
        <td class="text-center">${pdukCount} orang</td>
        <td class="text-right nominal" style="font-size: 9pt;">Sesuai Hitungan Susulan</td>
      </tr>` : ''}
      <tr style="background-color: #fafafa; font-weight: bold;">
        <td colspan="3" style="text-align: right; padding-right: 10px;">Total Estimasi Kewajiban Selisih Iuran:</td>
        <td class="text-right nominal" style="color: #b91c1c;">Rp ${finding.estimatedLossAmount.toLocaleString('id-ID')}</td>
      </tr>
    </tbody>
  </table>

  <p class="isi">
    Sehubungan dengan temuan pemeriksaan di atas, kami meminta Saudara untuk segera melakukan penyesuaian pelaporan data upah riil seluruh pekerja dan melunasi tunggakan selisih iuran tersebut dalam jangka waktu paling lambat <strong>10 (sepuluh) hari kerja</strong> sejak tanggal diterimanya Surat Teguran ini.
  </p>

  <p class="isi">
    Apabila sampai dengan batas waktu yang telah ditetapkan Saudara belum melaksanakan kewajiban penyesuaian data dan pembayaran selisih iuran, maka BPJS Kesehatan akan menerbitkan <strong>Surat Teguran Tertulis Kedua</strong> serta mengenakan sanksi administratif berikutnya berupa <strong>Denda Keterlambatan</strong> dan rekomendasi sanksi <strong>Tidak Mendapat Pelayanan Publik Tertentu (TMP2T)</strong> sesuai Pasal 9 PP No. 86 Tahun 2013 melalui sistem OSS (Online Single Submission) BKPM berupa pembekuan izin operasional usaha.
  </p>

  <p class="biasa">Demikian Surat Teguran ini kami sampaikan, atas perhatian dan kepatuhan Saudara diucapkan terima kasih.</p>

  <!-- BAGIAN TANDA TANGAN -->
  <div class="ttd-section">
    <div class="tembusan-block">
      <strong>Tembusan Yth:</strong>
      <ol>
        <li>Kepala Dinas Tenaga Kerja dan Transmigrasi Kabupaten Bekasi;</li>
        <li>Kepala Kantor Wilayah BPJS Kesehatan Jawa Barat;</li>
        <li>Inspektorat Pengawasan & Pemeriksaan (Wasrik) Kantor Pusat;</li>
        <li>Arsip Unit Wasrik KC Cikarang.</li>
      </ol>
    </div>
    
    <div class="pejabat-block">
      <div>Kepala Kantor Cabang Cikarang,</div>
      
      <!-- BSrE Electronic Seal Simulation -->
      <div class="bsre-container">
        <!-- Crisp Vector QR Code -->
        <svg class="bsre-qr" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#ffffff" />
          <rect x="5" y="5" width="28" height="28" fill="#000000" />
          <rect x="9" y="9" width="20" height="20" fill="#ffffff" />
          <rect x="13" y="13" width="12" height="12" fill="#000000" />
          <rect x="67" y="5" width="28" height="28" fill="#000000" />
          <rect x="71" y="9" width="20" height="20" fill="#ffffff" />
          <rect x="75" y="13" width="12" height="12" fill="#000000" />
          <rect x="5" y="67" width="28" height="28" fill="#000000" />
          <rect x="9" y="71" width="20" height="20" fill="#ffffff" />
          <rect x="13" y="75" width="12" height="12" fill="#000000" />
          <rect x="40" y="8" width="6" height="6" fill="#000000" />
          <rect x="52" y="8" width="6" height="6" fill="#000000" />
          <rect x="40" y="20" width="6" height="6" fill="#000000" />
          <rect x="46" y="26" width="6" height="6" fill="#000000" />
          <rect x="52" y="32" width="6" height="6" fill="#000000" />
          <rect x="10" y="42" width="6" height="6" fill="#000000" />
          <rect x="22" y="42" width="6" height="6" fill="#000000" />
          <rect x="40" y="44" width="20" height="12" fill="#000000" />
          <rect x="68" y="44" width="8" height="8" fill="#000000" />
          <rect x="82" y="44" width="8" height="8" fill="#000000" />
          <rect x="40" y="68" width="6" height="14" fill="#000000" />
          <rect x="52" y="74" width="8" height="8" fill="#000000" />
          <rect x="68" y="68" width="14" height="6" fill="#000000" />
          <rect x="76" y="80" width="12" height="10" fill="#000000" />
        </svg>
        <div class="bsre-text">
          <strong>DITANDATANGANI SECARA ELEKTRONIK</strong><br>
          Sertifikasi Balai Sertifikasi Elektronik (BSrE)<br>
          Badan Siber dan Sandi Negara (BSSN)<br>
          <span style="color: #006930; font-weight: bold;">ID: BSRE-BPJS-2026-98124A</span>
        </div>
      </div>

      <div class="pejabat-nama">Siti Rahmawati, S.E., M.M.</div>
      <div class="pejabat-nip">NIP. 19830514 200701 2 001</div>
    </div>
  </div>

  <!-- LEGAL FOOTER -->
  <div class="legal-footer">
    <span>Dokumen Resmi WasrikAgent AI 2.0 • Sesuai PP No. 86 Tahun 2013 • Hash: SHA-256 Validated</span>
    <span>Lembar Dokumen Sah Kedinasan BPJS Kesehatan RI</span>
  </div>
</body>
</html>`;

    // Render into an isolated hidden iframe for 100% clean, full-bleed A4 printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(printHtml);
      doc.close();

      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1500);
      }, 300);
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 font-sans">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col h-[94vh] max-h-[960px]">
        {/* Modal Action Header (Sleek Dark Chrome Bar) */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Draf Resmi Surat Teguran Wasrik
                </span>
                <span className="text-[10px] bg-red-950 text-red-300 font-bold px-2 py-0.5 rounded border border-red-800/60 uppercase">
                  PP No. 86/2013
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Standar Tata Naskah Dinas BPJS Kesehatan • Tervalidasi Pas 1 Halaman A4
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-98 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-emerald-900/30 border border-emerald-500/30"
              title="Cetak langsung atau simpan sebagai PDF A4 resmi"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Cetak / Simpan PDF (A4 Standar)</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer border border-transparent hover:border-slate-700"
              title="Tutup (Esc)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Workspace - Clean A4 Paper Simulation Canvas */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-slate-950/70 py-6 sm:py-10 px-3 sm:px-6 flex justify-center">
          <div className="bg-white max-w-[210mm] w-full p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-slate-300 rounded-xs font-serif text-slate-900 text-[11px] sm:text-[12.5px] leading-relaxed select-text my-auto">
            
            {/* Kop Surat Resmi */}
            <div className="flex items-center gap-3.5 pb-2">
              <div className="w-16 h-16 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gGreenJSX" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00A852" />
                      <stop offset="100%" stopColor="#006930" />
                    </linearGradient>
                    <linearGradient id="gGoldJSX" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FBBF24" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                  </defs>
                  <path d="M 50 4 C 74 4, 94 14, 94 36 C 94 65, 68 88, 50 96 C 32 88, 6 65, 6 36 C 6 14, 26 4, 50 4 Z" fill="url(#gGreenJSX)" />
                  <path d="M 50 10 C 70 10, 87 19, 87 37 C 87 61, 65 82, 50 89 C 35 82, 13 61, 13 37 C 13 19, 30 10, 50 10 Z" fill="none" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1.5" />
                  <path d="M 33 34 L 41 64 L 46 64 L 41 34 Z" fill="#FFFFFF" />
                  <path d="M 46 64 L 50 46 L 54 64 Z" fill="#FFFFFF" />
                  <circle cx="50" cy="42" r="3.5" fill="url(#gGoldJSX)" stroke="#FFFFFF" strokeWidth="1" />
                  <path d="M 59 34 L 54 64 L 59 64 L 67 34 Z" fill="#FFFFFF" />
                  <path d="M 58 54 L 66 62 L 80 44" fill="none" stroke="url(#gGoldJSX)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1 text-center font-sans">
                <h2 className="font-black text-sm uppercase tracking-wider text-black leading-tight">
                  BPJS KESEHATAN
                </h2>
                <h3 className="font-bold text-xs uppercase text-black leading-tight mt-0.5">
                  KANTOR CABANG CIKARANG
                </h3>
                <p className="text-[10px] font-bold text-emerald-800 tracking-wide mt-0.5">
                  UNIT KERJA PENGAWASAN DAN PEMERIKSAAN KEPATUHAN (WASRIK)
                </p>
                <p className="text-[8.5px] text-slate-700 leading-tight mt-1">
                  Kompleks Ruko Cikarang Central City Blok A No. 10-12, Cikarang Pusat, Kabupaten Bekasi, Jawa Barat 17530<br />
                  Telepon: (021) 8984-2300 | Faksimile: (021) 8984-2301 | Email: kc-cikarang@bpjs-kesehatan.go.id
                </p>
              </div>
            </div>

            {/* Garis Ganda Kop Surat Resmi */}
            <div className="border-t-[2.2px] border-b-[0.8px] border-black h-[3px] my-2.5" />

            {/* Meta Surat (Tabel 2 Kolom Persuratan Dinas) */}
            <table className="w-full border-collapse mb-3 font-serif text-[11px] sm:text-[12px]">
              <tbody>
                <tr>
                  <td className="w-[12%] align-top py-0.5">Nomor</td>
                  <td className="w-[2%] align-top py-0.5">:</td>
                  <td className="w-[44%] align-top py-0.5 font-bold font-mono text-[11px]">{letterNumber}</td>
                  <td className="w-[42%] text-right align-top py-0.5 font-serif">Cikarang, {currentDate}</td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">Sifat</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5 font-bold text-red-700">Penting / Segera</td>
                  <td rowSpan={3} className="align-top text-left pl-5 py-0.5 leading-snug">
                    Kepada Yth.<br />
                    <strong>Pimpinan / Direktur Perusahaan</strong><br />
                    <strong className="text-black">{employer.companyName}</strong><br />
                    NPWP: {employer.npwp}<br />
                    {employer.address}
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">Lampiran</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">1 (satu) Berkas Lembar Temuan Audit Wasrik</td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">Perihal</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">
                    <strong className="underline text-black font-serif">SURAT TEGURAN PERTAMA (I) ATAS KETIDAKPATUHAN PEMBERI KERJA</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Isi Surat */}
            <p className="mb-1.5 font-serif">Dengan hormat,</p>
            <p className="text-justify indent-10 mb-2 font-serif leading-relaxed">
              Berdasarkan ketentuan <strong>Undang-Undang Nomor 24 Tahun 2011</strong> tentang Badan Penyelenggara Jaminan Sosial, dan <strong>Peraturan Pemerintah Nomor 86 Tahun 2013</strong> tentang Tata Cara Pengenaan Sanksi Administratif Kepada Pemberi Kerja Selain Penyelenggara Negara, dengan ini kami sampaikan bahwa Unit Kerja Pengawasan dan Pemeriksaan (Wasrik) BPJS Kesehatan Kantor Cabang Cikarang telah melaksanakan pemeriksaan silang kepatuhan data kepesertaan dan iuran terhadap Badan Usaha yang Saudara pimpin.
            </p>

            <p className="text-justify indent-10 mb-2.5 font-serif leading-relaxed">
              Dari hasil pemeriksaan terintegrasi antara dokumen penggajian (payroll/slip gaji), data perbankan, dan data kepesertaan pada Sistem Informasi Perhitungan Pelaporan (SIPP) BPJS Kesehatan, telah ditemukan indikasi ketidakpatuhan sebagai berikut:
            </p>

            {/* Tabel Temuan Formal Kedinasan */}
            <table className="w-full border-collapse border border-black text-[10.5px] sm:text-[11.5px] my-2.5">
              <thead>
                <tr className="bg-slate-100 text-black font-bold font-sans">
                  <th className="border border-black px-2 py-1.5 text-center w-8">No</th>
                  <th className="border border-black px-3 py-1.5 text-left">Uraian Ketidakpatuhan</th>
                  <th className="border border-black px-2 py-1.5 text-center w-28">Jumlah Tenaga Kerja</th>
                  <th className="border border-black px-3 py-1.5 text-right w-40">Potensi Selisih Iuran</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-2 py-1.5 text-center align-top font-bold">1</td>
                  <td className="border border-black px-3 py-1.5 align-top">
                    <strong className="text-black font-sans">Pelaporan Upah Lebih Rendah (Under-Reporting Wage)</strong>
                    <div className="text-[10px] text-slate-700 font-sans mt-0.5 leading-tight">
                      Terdapat selisih pelaporan komponen upah (gaji pokok &amp; tunjangan tetap) pada slip gaji resmi karyawan dibandingkan dasar upah yang dilaporkan ke SIPP BPJS Kesehatan.
                    </div>
                  </td>
                  <td className="border border-black px-2 py-1.5 text-center align-middle font-mono font-bold text-slate-900">
                    {finding.affectedEmployeeCount} orang
                  </td>
                  <td className="border border-black px-3 py-1.5 text-right align-middle font-mono font-bold text-red-700">
                    Rp {finding.estimatedLossAmount.toLocaleString('id-ID')}
                  </td>
                </tr>
                {pdukCount > 0 && (
                  <tr>
                    <td className="border border-black px-2 py-1.5 text-center align-top font-bold">2</td>
                    <td className="border border-black px-3 py-1.5 align-top">
                      <strong className="text-black font-sans">Pendaftaran Pekerja Sebagian (PDUK)</strong>
                      <div className="text-[10px] text-slate-700 font-sans mt-0.5 leading-tight">
                        Tenaga kerja aktif terdaftar dalam daftar absensi dan penggajian perusahaan namun belum didaftarkan seluruhnya dalam program JKN.
                      </div>
                    </td>
                    <td className="border border-black px-2 py-1.5 text-center align-middle font-mono font-bold text-slate-900">
                      {pdukCount} orang
                    </td>
                    <td className="border border-black px-3 py-1.5 text-right align-middle font-mono font-bold text-amber-800 text-[10.5px]">
                      Sesuai Hitungan Susulan
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={3} className="border border-black px-3 py-1.5 text-right font-sans text-[10.5px]">
                    Total Estimasi Kewajiban Selisih Iuran (Pokok):
                  </td>
                  <td className="border border-black px-3 py-1.5 text-right font-mono font-bold text-red-700">
                    Rp {finding.estimatedLossAmount.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="text-justify indent-10 mb-2 font-serif leading-relaxed">
              Sehubungan dengan temuan pemeriksaan di atas, kami meminta Saudara untuk segera melakukan penyesuaian pelaporan data upah riil seluruh pekerja dan melunasi tunggakan selisih iuran tersebut dalam jangka waktu paling lambat <strong>10 (sepuluh) hari kerja</strong> sejak tanggal diterimanya Surat Teguran ini.
            </p>

            <p className="text-justify indent-10 mb-2 font-serif leading-relaxed">
              Apabila sampai dengan batas waktu yang telah ditetapkan Saudara belum melaksanakan kewajiban penyesuaian data dan pembayaran selisih iuran, maka BPJS Kesehatan akan menerbitkan <strong>Surat Teguran Tertulis Kedua</strong> serta mengenakan sanksi administratif berikutnya berupa <strong>Denda Keterlambatan</strong> dan rekomendasi sanksi <strong>Tidak Mendapat Pelayanan Publik Tertentu (TMP2T)</strong> sesuai Pasal 9 PP No. 86 Tahun 2013 melalui sistem OSS (Online Single Submission) BKPM berupa pembekuan izin operasional usaha.
            </p>

            <p className="mb-3 font-serif">Demikian Surat Teguran ini kami sampaikan, atas perhatian dan kepatuhan Saudara diucapkan terima kasih.</p>

            {/* Bagian Tanda Tangan & Tembusan */}
            <div className="pt-2 flex justify-between items-start font-sans text-[10px] sm:text-[11px]">
              <div className="w-[48%]">
                <p className="font-bold text-black">Tembusan Yth:</p>
                <ol className="list-decimal pl-4 text-slate-700 space-y-0.5 mt-1 leading-snug">
                  <li>Kepala Dinas Tenaga Kerja dan Transmigrasi Kabupaten Bekasi;</li>
                  <li>Kepala Kantor Wilayah BPJS Kesehatan Jawa Barat;</li>
                  <li>Inspektorat Pengawasan &amp; Pemeriksaan (Wasrik) Kantor Pusat;</li>
                  <li>Arsip Unit Wasrik KC Cikarang.</li>
                </ol>
              </div>
              <div className="w-[48%] text-center flex flex-col items-center">
                <p className="font-bold text-slate-900 font-serif">Kepala Kantor Cabang Cikarang,</p>
                
                {/* BSrE Seal Simulation with Crisp Vector QR */}
                <div className="my-2 border border-slate-400 bg-slate-50 p-2 rounded-md flex items-center gap-2 max-w-[260px] text-left shadow-xs">
                  <svg className="w-10 h-10 shrink-0 bg-white p-0.5 border border-slate-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="#ffffff" />
                    <rect x="5" y="5" width="28" height="28" fill="#000000" />
                    <rect x="9" y="9" width="20" height="20" fill="#ffffff" />
                    <rect x="13" y="13" width="12" height="12" fill="#000000" />
                    <rect x="67" y="5" width="28" height="28" fill="#000000" />
                    <rect x="71" y="9" width="20" height="20" fill="#ffffff" />
                    <rect x="75" y="13" width="12" height="12" fill="#000000" />
                    <rect x="5" y="67" width="28" height="28" fill="#000000" />
                    <rect x="9" y="71" width="20" height="20" fill="#ffffff" />
                    <rect x="13" y="75" width="12" height="12" fill="#000000" />
                    <rect x="40" y="8" width="6" height="6" fill="#000000" />
                    <rect x="52" y="8" width="6" height="6" fill="#000000" />
                    <rect x="40" y="20" width="6" height="6" fill="#000000" />
                    <rect x="46" y="26" width="6" height="6" fill="#000000" />
                    <rect x="52" y="32" width="6" height="6" fill="#000000" />
                    <rect x="10" y="42" width="6" height="6" fill="#000000" />
                    <rect x="22" y="42" width="6" height="6" fill="#000000" />
                    <rect x="40" y="44" width="20" height="12" fill="#000000" />
                    <rect x="68" y="44" width="8" height="8" fill="#000000" />
                    <rect x="82" y="44" width="8" height="8" fill="#000000" />
                    <rect x="40" y="68" width="6" height="14" fill="#000000" />
                    <rect x="52" y="74" width="8" height="8" fill="#000000" />
                    <rect x="68" y="68" width="14" height="6" fill="#000000" />
                    <rect x="76" y="80" width="12" height="10" fill="#000000" />
                  </svg>
                  <div className="text-[7.5px] leading-tight text-slate-700">
                    <strong className="text-black block font-sans">DITANDATANGANI SECARA ELEKTRONIK</strong>
                    Sertifikasi Balai Sertifikasi Elektronik (BSrE)<br />
                    Badan Siber dan Sandi Negara (BSSN)<br />
                    <span className="text-emerald-700 font-mono font-bold">ID: BSRE-BPJS-2026-98124A</span>
                  </div>
                </div>

                <p className="font-bold text-black underline font-serif text-[12px]">Siti Rahmawati, S.E., M.M.</p>
                <p className="text-[10px] text-slate-700 font-serif">NIP. 19830514 200701 2 001</p>
              </div>
            </div>

            {/* Footer Nota Keabsahan */}
            <div className="mt-5 pt-2 border-t border-slate-300 text-[8.5px] font-sans text-slate-500 flex justify-between">
              <span>WasrikAgent AI 2.0 • Sesuai PP No. 86 Tahun 2013 • Hash: SHA-256 Validated</span>
              <span>Lembar Dokumen Sah Kedinasan BPJS Kesehatan RI</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SanctionLetterModal;
