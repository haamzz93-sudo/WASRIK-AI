import React from 'react';
import { WasrikLogo } from './WasrikLogo';
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

  // Enterprise Print Handler: Prints pristine isolated A4 official document
  const handlePrint = () => {
    const printHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Surat_Teguran_Wasrik_${employer.companyName.replace(/[^a-zA-Z0-9]/g, '_')}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 16mm 20mm 15mm 22mm; /* Standar Persuratan Dinas RI */
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.35;
      color: #000000;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    /* KOP SURAT DINAS */
    .kop-wrapper {
      display: flex;
      align-items: center;
      padding-bottom: 6px;
      margin-bottom: 2px;
    }
    .kop-logo {
      width: 68px;
      height: 68px;
      margin-right: 16px;
      flex-shrink: 0;
    }
    .kop-text {
      flex: 1;
      text-align: center;
    }
    .kop-text .instansi-1 {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13pt;
      font-weight: 900;
      letter-spacing: 0.8px;
      color: #000000;
      line-height: 1.15;
    }
    .kop-text .instansi-2 {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11.5pt;
      font-weight: 700;
      color: #000000;
      margin-top: 1px;
      line-height: 1.15;
    }
    .kop-text .instansi-unit {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9.5pt;
      font-weight: 700;
      color: #006930;
      margin-top: 2px;
      letter-spacing: 0.3px;
    }
    .kop-text .alamat {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      color: #333333;
      margin-top: 3px;
      line-height: 1.25;
    }
    /* GARIS GANDA STANDAR PERSURATAN RESMI */
    .garis-kop {
      border-top: 2.5px solid #000000;
      border-bottom: 0.8px solid #000000;
      height: 4px;
      margin-bottom: 14px;
    }
    /* META SURAT */
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 10.5pt;
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
      text-indent: 1.25cm;
      margin-bottom: 9px;
      font-size: 11pt;
      line-height: 1.38;
    }
    p.biasa {
      text-align: justify;
      margin-bottom: 9px;
      font-size: 11pt;
      line-height: 1.38;
    }
    /* TABEL TEMUAN */
    table.temuan-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 14px 0;
      font-size: 10pt;
    }
    table.temuan-table th {
      background-color: #f2f2f2;
      border: 1px solid #000000;
      padding: 6px 8px;
      font-weight: bold;
      text-align: center;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9.5pt;
    }
    table.temuan-table td {
      border: 1px solid #000000;
      padding: 5px 8px;
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
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .tembusan-block {
      width: 48%;
      font-size: 9pt;
    }
    .tembusan-block ol {
      margin-left: 18px;
      margin-top: 3px;
    }
    .pejabat-block {
      width: 48%;
      text-align: center;
      font-size: 10.5pt;
    }
    /* BSrE ELECTRONIC SIGNATURE SEAL */
    .bsre-container {
      margin: 8px auto;
      border: 1px solid #777777;
      background: #fafafa;
      padding: 5px 8px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      border-radius: 4px;
      max-width: 290px;
      text-align: left;
    }
    .bsre-qr {
      width: 50px;
      height: 50px;
      flex-shrink: 0;
    }
    .bsre-text {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 7pt;
      line-height: 1.25;
      color: #333333;
    }
    .pejabat-nama {
      font-weight: bold;
      text-decoration: underline;
      font-size: 11pt;
      margin-top: 2px;
    }
    .pejabat-nip {
      font-size: 9pt;
      color: #333333;
    }
    /* FOOTER CATATAN HUKUM */
    .legal-footer {
      margin-top: 18px;
      border-top: 0.8px solid #aaaaaa;
      padding-top: 4px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 7pt;
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
      <svg viewBox="0 0 100 100" width="68" height="68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00A852" />
            <stop offset="100%" stop-color="#006930" />
          </linearGradient>
          <linearGradient id="gGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FBBF24" />
            <stop offset="100%" stop-color="#D97706" />
          </linearGradient>
        </defs>
        <path d="M 50 4 C 74 4, 94 14, 94 36 C 94 65, 68 88, 50 96 C 32 88, 6 65, 6 36 C 6 14, 26 4, 50 4 Z" fill="url(#gGreen)" />
        <path d="M 50 10 C 70 10, 87 19, 87 37 C 87 61, 65 82, 50 89 C 35 82, 13 61, 13 37 C 13 19, 30 10, 50 10 Z" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5" />
        <path d="M 33 34 L 41 64 L 46 64 L 41 34 Z" fill="#FFFFFF" />
        <path d="M 46 64 L 50 46 L 54 64 Z" fill="#FFFFFF" />
        <circle cx="50" cy="42" r="3.5" fill="url(#gGold)" stroke="#FFFFFF" stroke-width="1" />
        <path d="M 59 34 L 54 64 L 59 64 L 67 34 Z" fill="#FFFFFF" />
        <path d="M 58 54 L 66 62 L 80 44" fill="none" stroke="url(#gGold)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
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
        <th style="width: 50%;">Uraian Ketidakpatuhan</th>
        <th style="width: 18%;">Jumlah Tenaga Kerja</th>
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="bg-slate-100 rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Action Header (Screen View) */}
        <div className="px-5 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Draf Resmi Surat Teguran Wasrik (PP No. 86 Tahun 2013)
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                ✓ Siap Cetak A4 Standar Dinas Kedinasan RI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-98 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:shadow"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak / Simpan PDF (A4 Standar)
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
              title="Tutup (Esc)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Workspace - Displays Crisp A4 Document Sheet */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-200/70 flex justify-center">
          <div className="bg-white max-w-[210mm] w-full p-8 sm:p-12 shadow-lg border border-slate-300 font-document text-slate-900 text-xs sm:text-[13px] leading-relaxed select-text">
            
            {/* Kop Surat Resmi */}
            <div className="flex items-center gap-4 pb-2">
              <div className="w-16 h-16 shrink-0">
                <WasrikLogo variant="emblem" size="lg" />
              </div>
              <div className="flex-1 text-center font-sans">
                <h2 className="font-black text-sm uppercase tracking-wider text-slate-900 leading-tight">
                  BPJS KESEHATAN
                </h2>
                <h3 className="font-bold text-xs uppercase text-slate-900 leading-tight">
                  KANTOR CABANG CIKARANG
                </h3>
                <p className="text-[11px] font-bold text-emerald-800 tracking-wide mt-0.5">
                  UNIT KERJA PENGAWASAN DAN PEMERIKSAAN KEPATUHAN (WASRIK)
                </p>
                <p className="text-[9px] text-slate-600 leading-tight mt-1">
                  Kompleks Ruko Cikarang Central City Blok A No. 10-12, Cikarang Pusat, Kabupaten Bekasi, Jawa Barat 17530<br />
                  Telepon: (021) 8984-2300 | Faksimile: (021) 8984-2301 | Email: kc-cikarang@bpjs-kesehatan.go.id
                </p>
              </div>
            </div>

            {/* Garis Ganda Kop Surat Resmi */}
            <div className="border-t-[2.5px] border-b-[0.8px] border-black h-[4px] my-3" />

            {/* Meta Surat */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans mb-4">
              <div>
                <p>Nomor : <span className="font-bold">{letterNumber}</span></p>
                <p>Sifat : <span className="font-bold text-red-700">Penting / Segera</span></p>
                <p>Lampiran : 1 (satu) Berkas Hasil Audit Wasrik</p>
                <p className="mt-1">
                  Perihal : <strong className="underline">SURAT TEGURAN PERTAMA (I) ATAS KETIDAKPATUHAN PEMBERI KERJA</strong>
                </p>
              </div>
              <div className="text-right">
                <p>Cikarang, {currentDate}</p>
                <p className="mt-2 text-left sm:pl-8 text-slate-800">
                  Kepada Yth.<br />
                  <strong>Pimpinan / Direktur Perusahaan</strong><br />
                  <strong>{employer.companyName}</strong><br />
                  NPWP: {employer.npwp}<br />
                  {employer.address}
                </p>
              </div>
            </div>

            {/* Isi Surat */}
            <p className="mb-2">Dengan hormat,</p>
            <p className="text-justify indent-8 mb-3">
              Berdasarkan ketentuan <strong>Undang-Undang Nomor 24 Tahun 2011</strong> tentang Badan Penyelenggara Jaminan Sosial, dan <strong>Peraturan Pemerintah Nomor 86 Tahun 2013</strong> tentang Tata Cara Pengenaan Sanksi Administratif Kepada Pemberi Kerja Selain Penyelenggara Negara, dengan ini kami sampaikan bahwa Unit Kerja Pengawasan dan Pemeriksaan (Wasrik) BPJS Kesehatan telah melaksanakan pemeriksaan kepatuhan terhadap Badan Usaha yang Saudara pimpin.
            </p>

            <p className="text-justify indent-8 mb-3">
              Dari hasil pemeriksaan silang dokumen penggajian dan master data kepesertaan SIPP, ditemukan indikasi ketidakpatuhan sebagai berikut:
            </p>

            {/* Tabel Temuan Formal */}
            <table className="w-full border-collapse border border-black text-xs my-3">
              <thead>
                <tr className="bg-slate-100 text-black font-bold font-sans">
                  <th className="border border-black p-2 text-center w-10">No</th>
                  <th className="border border-black p-2 text-left">Uraian Temuan Pemeriksaan</th>
                  <th className="border border-black p-2 text-center w-28">Jumlah Tenaga Kerja</th>
                  <th className="border border-black p-2 text-right w-44">Potensi Kerugian Iuran (Rp)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2 text-center">1</td>
                  <td className="border border-black p-2">
                    <strong>Pelaporan Upah Lebih Rendah (Under-Reporting Wage):</strong>
                    <div className="text-[11px] text-slate-700 mt-0.5">
                      Selisih pelaporan gaji pokok &amp; tunjangan tetap pada slip gaji riil vs basis pelaporan SIPP BPJS Kesehatan.
                    </div>
                  </td>
                  <td className="border border-black p-2 text-center font-mono font-bold">
                    {finding.affectedEmployeeCount} orang
                  </td>
                  <td className="border border-black p-2 text-right font-mono font-bold text-red-700">
                    Rp {finding.estimatedLossAmount.toLocaleString('id-ID')}
                  </td>
                </tr>
                {pdukCount > 0 && (
                  <tr>
                    <td className="border border-black p-2 text-center">2</td>
                    <td className="border border-black p-2">
                      <strong>Pendaftaran Pekerja Sebagian (PDUK):</strong>
                      <div className="text-[11px] text-slate-700 mt-0.5">
                        Pekerja aktif terdaftar absensi namun belum didaftarkan ke program JKN.
                      </div>
                    </td>
                    <td className="border border-black p-2 text-center font-mono font-bold">
                      {pdukCount} orang
                    </td>
                    <td className="border border-black p-2 text-right font-mono font-bold text-amber-800">
                      Sesuai Perhitungan Susulan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <p className="text-justify indent-8 mb-3">
              Sehubungan dengan hal tersebut di atas, kami meminta Saudara untuk segera melakukan penyesuaian pelaporan upah riil dan menyelesaikan tunggakan selisih iuran dalam jangka waktu paling lambat <strong>10 (sepuluh) hari kerja</strong> sejak diterimanya Surat Teguran ini.
            </p>

            <p className="text-justify indent-8 mb-3">
              Apabila sampai dengan batas waktu yang ditentukan Saudara tidak memenuhi kewajiban tersebut, maka akan diterbitkan <strong>Surat Teguran Kedua</strong> dan/atau pengenaan sanksi administratif <strong>Tidak Mendapat Pelayanan Publik Tertentu (TMP2T)</strong> sesuai Pasal 9 PP No. 86 Tahun 2013 berupa penghentian izin usaha operasional pada sistem OSS BKPM.
            </p>

            <p className="mb-4">Demikian kami sampaikan, atas perhatian dan kerja samanya kami ucapkan terima kasih.</p>

            {/* Tanda Tangan & Tembusan */}
            <div className="pt-4 grid grid-cols-2 gap-4 font-sans text-xs">
              <div>
                <p className="font-bold">Tembusan Yth:</p>
                <ol className="list-decimal pl-4 text-[11px] text-slate-700 space-y-0.5 mt-1">
                  <li>Kepala Dinas Tenaga Kerja Kab. Bekasi</li>
                  <li>Kepala Kantor Wilayah BPJS Kesehatan Jawa Barat</li>
                  <li>Inspektorat Wasrik Kantor Pusat BPJS Kesehatan</li>
                  <li>Arsip Unit Wasrik KC Cikarang</li>
                </ol>
              </div>
              <div className="text-center flex flex-col items-center">
                <p className="font-bold text-slate-900">Kepala Kantor Cabang Cikarang,</p>
                
                {/* BSrE Badge Simulation */}
                <div className="my-2 border border-slate-400 bg-slate-50 p-2 rounded flex items-center gap-2 max-w-[240px] text-left">
                  <div className="w-10 h-10 bg-white border border-slate-300 p-0.5 shrink-0 flex items-center justify-center">
                    <div className="w-full h-full bg-slate-900 grid grid-cols-3 gap-0.5 p-0.5">
                      <span className="bg-white"></span>
                      <span className="bg-white"></span>
                      <span className="bg-white"></span>
                      <span className="bg-white"></span>
                      <span className="bg-slate-900"></span>
                      <span className="bg-white"></span>
                      <span className="bg-white"></span>
                      <span className="bg-white"></span>
                      <span className="bg-white"></span>
                    </div>
                  </div>
                  <div className="text-[8px] leading-tight text-slate-600">
                    <strong className="text-slate-900 block">DITANDATANGANI SECARA ELEKTRONIK</strong>
                    Sertifikasi Resmi BSrE BSSN<br />
                    <span className="text-emerald-700 font-mono font-semibold">ID: BSRE-BPJS-2026-98124A</span>
                  </div>
                </div>

                <p className="font-bold text-slate-900 underline">Siti Rahmawati, S.E., M.M.</p>
                <p className="text-[11px] text-slate-600">NIP. 19830514 200701 2 001</p>
              </div>
            </div>

            {/* Footer Nota Keabsahan */}
            <div className="mt-8 pt-2 border-t border-slate-300 text-[9px] font-sans text-slate-500 flex justify-between">
              <span>WasrikAgent AI 2.0 • Sesuai PP No. 86 Tahun 2013 • Terenkripsi Salted SHA-256</span>
              <span>Dokumen Resmi Kedinasan BPJS Kesehatan</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
export default SanctionLetterModal;
