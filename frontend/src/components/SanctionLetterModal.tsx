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

  const letterNumber = `ST.01.03/WASRIK-CKR/${new Date().getFullYear()}/${new Date().getMonth() + 1}-0892`;
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Action Header */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Draf Surat Teguran Resmi (PP No. 86 Tahun 2013)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak / Simpan PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors flex items-center justify-center cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Printable Official Letter Body (TIMES NEW ROMAN FONT STRICTLY FOR LEGAL LETTER) */}
        <div className="p-8 sm:p-10 overflow-y-auto font-document text-slate-900 space-y-4 text-xs leading-relaxed bg-white">
          {/* Institutional Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <WasrikLogo variant="emblem" size="lg" />
              <div>
                <h2 className="font-sans font-black text-sm uppercase tracking-wide text-slate-900">
                  BPJS KESEHATAN KANTOR CABANG CIKARANG
                </h2>
                <p className="font-sans text-[11px] font-semibold text-emerald-800">
                  UNIT KERJA PENGAWASAN DAN PEMERIKSAAN KEPATUHAN (WASRIK)
                </p>
                <p className="font-sans text-[10px] text-slate-500">
                  Kompleks Ruko Cikarang Central City Blok A No. 10-12, Cikarang Pusat, Bekasi
                </p>
              </div>
            </div>
            <div className="text-right font-sans text-[10px] text-slate-400">
              FORM: WASRIK-PP86-2013-ST1
            </div>
          </div>

          {/* Letter Meta */}
          <div className="grid grid-cols-2 gap-4 font-sans text-xs mb-4">
            <div>
              <p>Nomor : <span className="font-bold">{letterNumber}</span></p>
              <p>Sifat : <span className="font-bold text-red-700">Penting / Segera</span></p>
              <p>Lampiran : 1 (satu) Berkas Hasil Audit Wasrik</p>
              <p>Perihal : <strong>SURAT TEGURAN PERTAMA (I) ATAS KETIDAKPATUHAN PEMBERI KERJA</strong></p>
            </div>
            <div className="text-right">
              <p>Cikarang, {currentDate}</p>
              <p className="mt-2 text-slate-700">
                Kepada Yth.<br />
                <strong>Direktur / Pimpinan Perusahaan</strong><br />
                {employer.companyName}<br />
                NPWP: {employer.npwp}<br />
                {employer.address}
              </p>
            </div>
          </div>

          {/* Letter Contents */}
          <p>Dengan hormat,</p>
          <p className="text-justify indent-6">
            Berdasarkan ketentuan <strong>Undang-Undang Nomor 24 Tahun 2011</strong> tentang Badan Penyelenggara Jaminan Sosial, dan <strong>Peraturan Pemerintah Nomor 86 Tahun 2013</strong> tentang Tata Cara Pengenaan Sanksi Administratif Kepada Pemberi Kerja Selain Penyelenggara Negara, dengan ini kami sampaikan bahwa Unit Pengawasan dan Pemeriksaan (Wasrik) BPJS Kesehatan telah melakukan pemeriksaan kepatuhan terhadap Badan Usaha yang Saudara pimpin.
          </p>

          <p className="text-justify indent-6">
            Dari hasil pemeriksaan silang dokumen penggajian dan master data kepesertaan SIPP, ditemukan ketidakpatuhan sebagai berikut:
          </p>

          {/* Findings Table */}
          <table className="w-full border-collapse border border-slate-300 text-xs my-2">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold font-sans">
                <th className="border border-slate-300 p-2 text-left">Uraian Temuan Pemeriksaan</th>
                <th className="border border-slate-300 p-2 text-center">Jumlah Karyawan</th>
                <th className="border border-slate-300 p-2 text-right">Potensi Kerugian Iuran (Rp)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2">
                  <strong>Pelaporan Upah Lebih Rendah (Under-Reporting Wage):</strong>
                  <br />Selisih pelaporan gaji pokok &amp; tunjangan tetap pada slip gaji riil vs basis pelaporan SIPP BPJS Kesehatan.
                </td>
                <td className="border border-slate-300 p-2 text-center font-mono">
                  {finding.affectedEmployeeCount} orang
                </td>
                <td className="border border-slate-300 p-2 text-right font-mono font-bold text-red-700">
                  Rp {finding.estimatedLossAmount.toLocaleString('id-ID')}
                </td>
              </tr>
              {employer.totalActiveEmployees - employer.bpjsRegisteredEmployees > 0 && (
                <tr>
                  <td className="border border-slate-300 p-2">
                    <strong>Pendaftaran Pekerja Sebagian (PDUK):</strong>
                    <br />Pekerja aktif terdaftar absensi namun belum didaftarkan ke program JKN.
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-mono">
                    {employer.totalActiveEmployees - employer.bpjsRegisteredEmployees} orang
                  </td>
                  <td className="border border-slate-300 p-2 text-right font-mono font-bold text-amber-700">
                    Sesuai Perhitungan Susulan
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <p className="text-justify indent-6">
            Sehubungan dengan hal tersebut di atas, kami meminta Saudara untuk segera melakukan penyesuaian pelaporan upah riil dan menyelesaikan tunggakan selisih iuran dalam jangka waktu paling lambat <strong>10 (sepuluh) hari kerja</strong> sejak diterimanya Surat Teguran ini.
          </p>

          <p className="text-justify indent-6">
            Apabila sampai dengan batas waktu yang ditentukan Saudara tidak memenuhi kewajiban tersebut, maka akan diterbitkan <strong>Surat Teguran Kedua</strong> dan/atau pengenaan sanksi administratif <strong>Tidak Mendapat Pelayanan Publik Tertentu (TMP2T)</strong> sesuai Pasal 9 PP No. 86 Tahun 2013 berupa penghentian izin usaha operasional pada sistem OSS BKPM.
          </p>

          <p>Demikian kami sampaikan, atas perhatian dan kerja samanya kami ucapkan terima kasih.</p>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 font-sans text-xs">
            <div>
              <p>Tembusan Yth:</p>
              <ol className="list-decimal pl-4 text-[11px] text-slate-600">
                <li>Kepala Dinas Tenaga Kerja Kab. Bekasi</li>
                <li>Kepala Kantor Wilayah BPJS Kesehatan Jawa Barat</li>
                <li>Arsip Unit Wasrik KC Cikarang</li>
              </ol>
            </div>
            <div className="text-center">
              <p className="font-bold">Kepala Kantor Cabang Cikarang,</p>
              <div className="h-16 flex items-center justify-center text-slate-300 italic text-[11px]">
                [Tanda Tangan Elektronik &amp; Segel Resmi BPJS]
              </div>
              <p className="font-bold text-slate-900 underline">Siti Rahmawati, S.E., M.M.</p>
              <p className="text-[11px] text-slate-500">NIP. 19830514 200701 2 001</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SanctionLetterModal;
