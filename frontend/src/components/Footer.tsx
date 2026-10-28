import React from 'react';

interface FooterProps {
  onOpenDatasheet?: () => void;
  onOpenDocs?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDatasheet, onOpenDocs }) => {
  return (
    <footer className="bg-gradient-to-r from-[#003B1B] via-[#004720] to-[#003517] dark:from-[#021B0F] dark:via-[#01170D] dark:to-[#011009] border-t border-[#005C2B]/80 dark:border-emerald-950/80 py-3 px-6 text-xs text-emerald-100/90 flex flex-col md:flex-row items-center justify-between gap-3 shadow-inner transition-all duration-300 shrink-0">
      <div className="flex items-center gap-2">
        <span className="font-extrabold text-white tracking-wide">WasrikAgent AI v2.0</span>
        <span className="text-emerald-400/60">•</span>
        <span className="text-emerald-200/90">BPJS Kesehatan Healthkathon 2026 (Kategori 3: Efisiensi Risiko pada Pemberi Kerja)</span>
      </div>

      <div className="flex items-center gap-3.5 text-[11px] font-medium">
        <span className="inline-flex items-center gap-1.5 text-emerald-200">
          <svg className="w-3.5 h-3.5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>UU PDP No. 27/2022 (SHA-256)</span>
        </span>
        <span className="text-emerald-500/50">|</span>
        <span className="text-emerald-200">PP No. 86/2013 (Sanksi TMP2T)</span>
        <span className="text-emerald-500/50">|</span>
        {onOpenDatasheet && (
          <button
            onClick={onOpenDatasheet}
            className="text-emerald-300 hover:text-white font-semibold underline underline-offset-2 transition-colors cursor-pointer"
          >
            Pakta Integritas (e-Meterai 10k)
          </button>
        )}
        {onOpenDocs && (
          <button
            onClick={onOpenDocs}
            className="text-emerald-300 hover:text-white font-semibold underline underline-offset-2 transition-colors cursor-pointer"
          >
            SRS &amp; DDL Schema
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;