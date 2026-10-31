import React, { useState, useEffect } from 'react';
import { WasrikLogo } from './WasrikLogo';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useTheme } from '../context/ThemeContext';
import { IconWarning, IconShieldCheck, IconBrain, IconScale, IconCpu, IconSun, IconMoon } from './Icons';

interface LandingPageViewProps {
  onGoToLogin: () => void;
  onGoToWorkbench: () => void;
  onGoToQueue: () => void;
  onGoToUploader: () => void;
  onOpenDatasheet: () => void;
  onStartTour?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onGoToLogin,
  onGoToWorkbench,
  onGoToQueue,
  onGoToUploader,
  onOpenDatasheet,
  onStartTour,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [islandExpanded, setIslandExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useScrollReveal();

  const navItems = [
    { id: 'masalah', label: 'Tantangan' },
    { id: 'arsitektur', label: '4 Agen AI' },
    { id: 'hitl', label: 'HITL Gate' },
    { id: 'pdp', label: 'UU PDP' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -85;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sectionIds = ['masalah', 'arsitektur', 'hitl', 'pdp'];
      const scrollPos = window.scrollY + 200;
      let current = '';
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          current = sectionIds[i];
          break;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 font-sans selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden transition-colors duration-200">
      
      {/* =========================================================================
          DYNAMIC ISLAND FLOATING HEADER (APPLE STYLE LIQUID GLASS CAPSULE)
         ========================================================================= */}
      <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 flex justify-center px-2 sm:px-4 pointer-events-none">
        <div
          onMouseEnter={() => setIslandExpanded(true)}
          onMouseLeave={() => setIslandExpanded(false)}
          className={`pointer-events-auto liquid-island rounded-full transition-all duration-300 flex items-center justify-between gap-1.5 sm:gap-5 px-2.5 py-1.5 sm:px-5 sm:py-2.5 w-full max-w-[96vw] sm:max-w-max ${
            isScrolled || islandExpanded
              ? 'scale-100 shadow-liquid-hover'
              : 'scale-[0.98]'
          }`}
        >
          {/* Brand Logo inside Dynamic Island */}
          <div className="flex items-center gap-2 sm:gap-2.5 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img
              src="/assets/wasrik_ai_icon.jpg"
              alt="Wasrik AI"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shadow-xs border border-white/80 dark:border-slate-700 shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
                WASRIK<span className="text-[#009640]">AI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className="text-[8.5px] font-semibold text-slate-400 dark:text-slate-400 tracking-wider uppercase hidden sm:block">
                Healthkathon 2026
              </span>
            </div>
          </div>

          {/* Quick Navigation Links with Smooth Sliding Active Indicator */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-200/50 dark:bg-slate-900/60 rounded-full border border-slate-300/40 dark:border-slate-800/80 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`relative px-3.5 py-1 rounded-full text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-emerald-950 dark:text-emerald-200 bg-white dark:bg-emerald-950/80 font-bold shadow-xs border border-emerald-500/30 dark:border-emerald-400/40 scale-105'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium hover:bg-white/40 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  )}
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action Capsule Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 shrink-0"
            >
              {theme === 'dark' ? (
                <IconSun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <IconMoon className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>

            {onStartTour && (
              <button
                type="button"
                onClick={onStartTour}
                className="hidden sm:inline-flex px-3 py-1.5 text-[11px] font-bold text-emerald-950 dark:text-emerald-100 bg-emerald-300 dark:bg-emerald-900/80 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full transition-all cursor-pointer shadow-xs whitespace-nowrap items-center gap-1.5 border border-emerald-400 group"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-800 dark:bg-emerald-400 text-white dark:text-slate-950 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-2 h-2 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span>Tur Interaktif</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenDatasheet}
              className="hidden sm:inline-flex px-3 py-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800/80 rounded-full transition-all cursor-pointer shadow-xs whitespace-nowrap"
            >
              Data Sampel 2026
            </button>
            <button
              type="button"
              onClick={onGoToLogin}
              className="px-3 sm:px-4 py-1.5 text-[11px] font-bold text-white bg-[#009640] hover:bg-[#00883E] rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap active:scale-95"
            >
              <span>Portal SSO</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          HERO SECTION WITH GENERATED LIQUID GLASS AMBIENT BACKDROP
         ========================================================================= */}
      <section className="relative pt-24 pb-16 sm:pt-36 sm:pb-24 md:pt-40 md:pb-28 overflow-hidden">
        {/* Ambient Liquid Glass Wallpaper Layer with Nano Banana Generated Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-all duration-700"
          style={{ backgroundImage: `url('/assets/wasrik_hero_dark_bg.jpg')` }}
        />
        {/* Soft Radial Gradient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-200/40 dark:from-emerald-900/20 via-teal-100/30 dark:via-teal-900/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 animate-reveal-1">
          {/* Category Badge Capsule */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full liquid-glass-emerald text-emerald-900 dark:text-emerald-200 text-[10.5px] sm:text-xs font-bold mb-5 sm:mb-6 shadow-xs max-w-[95vw]">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping shrink-0" />
            <span className="truncate">BPJS Kesehatan Healthkathon 2026 • Kategori 3: Efisiensi Risiko Pemberi Kerja</span>
          </div>

          {/* Hero Main Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.2] mb-4 sm:mb-6 px-1">
            Autonomous Multi-Agent AI untuk Kepatuhan Iuran Pemberi Kerja JKN
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 font-normal px-2">
            Mengubah audit manual reaktif menjadi pengawasan otonom proaktif. Mendeteksi manipulasi upah (<strong className="text-slate-900 dark:text-white font-bold">Under-Reporting Wage</strong>) dan <strong className="text-slate-900 dark:text-white font-bold">PDUK</strong> dengan 4 Agen AI terspesialisasi serta gerbang kepatuhan <strong className="text-emerald-700 dark:text-emerald-400 font-bold">Human-in-the-Loop (PP No. 86/2013)</strong>.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 mb-8 sm:mb-10 max-w-sm sm:max-w-none mx-auto w-full px-2">
            <button
              type="button"
              onClick={onGoToWorkbench}
              className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#009640] hover:bg-[#00883E] rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Buka Dual-Pane HITL Workbench</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onGoToUploader}
              className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 liquid-glass hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer shadow-xs active:scale-95 text-center"
            >
              Upload &amp; Audit Berkas Sendiri
            </button>
            <button
              type="button"
              onClick={onGoToQueue}
              className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 liquid-glass hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer shadow-xs active:scale-95 text-center"
            >
              Antrean 523k Badan Usaha
            </button>
            {onStartTour && (
              <button
                type="button"
                onClick={onStartTour}
                className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 rounded-full transition-all cursor-pointer shadow-lg hover:shadow-emerald-900/40 active:scale-95 text-center flex items-center justify-center gap-2.5 border border-emerald-400/50 group"
              >
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-2.5 h-2.5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span>Mulai Tur Interaktif (Demo)</span>
              </button>
            )}
          </div>

          {/* Legal Compliance Indicator Badges */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 text-[10.5px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium px-2">
            <span className="flex items-center gap-1.5 liquid-glass px-3 py-1 rounded-full w-full sm:w-auto justify-center">
              <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Sesuai PP No. 86/2013 (Sanksi TMP2T)</span>
            </span>
            <span className="flex items-center gap-1.5 liquid-glass px-3 py-1 rounded-full w-full sm:w-auto justify-center">
              <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Salted SHA-256 (UU PDP No. 27/2022)</span>
            </span>
            <span className="flex items-center gap-1.5 liquid-glass px-3 py-1 rounded-full w-full sm:w-auto justify-center">
              <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>FastAPI + MySQL Database</span>
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 1: THE GRAND PROBLEM METRICS (LIQUID GLASS CAPSULES)
         ========================================================================= */}
      <section id="masalah" className="py-16 md:py-24 relative reveal-on-scroll">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14 animate-reveal-2">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/80">
              Urgensi &amp; Skala Masalah Nasional
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
              Ketidakpatuhan 523.000 Pemberi Kerja di Indonesia
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
              Laporan resmi Dewan Pengawas BPJS Kesehatan &amp; Kemnaker RI per akhir 2025:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat Card 1 */}
            <div className="liquid-glass rounded-2xl p-6 relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-liquid-hover">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 mb-4 shadow-xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Badan Usaha Aktif</span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">878.000</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Perusahaan terdaftar di sektor formal PPU</p>
            </div>

            {/* Stat Card 2 */}
            <div className="liquid-glass rounded-2xl p-6 relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-liquid-hover border-red-200/80 dark:border-red-900/60">
              <div className="w-10 h-10 rounded-xl bg-red-100/80 dark:bg-red-950/60 flex items-center justify-center text-red-700 dark:text-red-400 mb-4 shadow-xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Badan Usaha Belum Patuh</span>
              <p className="text-3xl font-black text-red-600 dark:text-red-400 mt-1">523.000</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">59,5% melanggar aturan jaminan sosial</p>
            </div>

            {/* Stat Card 3 */}
            <div className="liquid-glass rounded-2xl p-6 relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-liquid-hover border-amber-200/80 dark:border-amber-900/60">
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-4 shadow-xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Modus PDUK &amp; Manipulasi</span>
              <p className="text-3xl font-black text-amber-700 dark:text-amber-400 mt-1">490.000</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Pekerja disembunyikan &amp; gaji under-reported</p>
            </div>

            {/* Stat Card 4 */}
            <div className="liquid-glass-emerald rounded-2xl p-6 relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-liquid-hover">
              <div className="w-10 h-10 rounded-xl bg-emerald-200/70 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-800 dark:text-emerald-300 mb-4 shadow-xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Kebocoran Iuran Nasional</span>
              <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">Rp 4,25 T</p>
              <p className="text-[11px] text-emerald-900 dark:text-emerald-200 mt-1">Estimasi kebocoran iuran 4% per tahun</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 3: 4 AUTONOMOUS AI AGENTS (LIQUID GLASS TILES)
         ========================================================================= */}
      <section id="arsitektur" className="py-20 relative bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800 reveal-on-scroll overflow-hidden">
        {/* Ambient Enterprise Grid Overlay Generated by Nano Banana */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen pointer-events-none"
          style={{ backgroundImage: `url('/assets/wasrik_enterprise_bg.jpg')` }}
        />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-reveal-3">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/80">
              Orkestrasi Multi-Agent AI
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
              Sinergi 4 Agen AI Otonom &amp; Rule Engine Wasrik
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
              Setiap agen AI memiliki spesialisasi peran terisolasi (Agent Capability Contract) yang dieksekusi secara sekuensial melalui LangGraph:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Agent 1 */}
            <div className="liquid-glass rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-liquid-hover flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-black text-sm flex items-center justify-center mb-4">
                  A1
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Payroll &amp; Document Intel</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Vision-OCR 300 DPI membaca berkas PDF slip gaji, mengekstrak komponen Gaji Pokok &amp; Tunjangan, lalu mencocokkannya ke database SIPP BPJS.
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 self-start">
                Fokus: Under-Reporting Wage
              </span>
            </div>

            {/* Agent 2 */}
            <div className="liquid-glass rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-liquid-hover flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-black text-sm flex items-center justify-center mb-4">
                  A2
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Workforce Classification</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Merekonsiliasi presensi HRIS &amp; Wajib Lapor Ketenagakerjaan (WLKP Kemnaker) dengan data aktif peserta JKN terdaftar.
                </p>
              </div>
              <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800 self-start">
                Fokus: PDUK (Pekerja Sebagian)
              </span>
            </div>

            {/* Agent 3 */}
            <div className="liquid-glass rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-liquid-hover flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-black text-sm flex items-center justify-center mb-4">
                  A3
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Collusion &amp; MCU Graph</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Memetakan grafik rujukan fasilitas kesehatan primer klinik rekanan untuk mendeteksi deviasi anomali surat sakit atau klaim fiktif.
                </p>
              </div>
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800 self-start">
                Fokus: Faskes Collusion
              </span>
            </div>

            {/* Agent 4 */}
            <div className="liquid-glass rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-liquid-hover flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-black text-sm flex items-center justify-center mb-4">
                  A4
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Supervisor Orchestrator</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Mengagregasikan anomali ke Deterministic Rule Engine untuk menghitung Corporate Risk Score (0-100) dan potensi kerugian iuran (Rp).
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 self-start">
                Fokus: Skor Risiko &amp; Kerugian
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 4: HUMAN-IN-THE-LOOP (PP NO. 86/2013)
         ========================================================================= */}
      <section id="hitl" className="py-20 md:py-28 relative reveal-on-scroll">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/80">
                Prinsip Good Governance
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 mb-4">
                AI Sebagai Co-Pilot: Keputusan Hukum Mutlak di Tangan Auditor Wasrik
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Untuk mematuhi Asas-Asas Umum Pemerintahan yang Baik (AUPB), agen AI dilarang secara sepihak menerbitkan sanksi administratif. Setiap temuan disajikan dalam antarmuka Dual-Pane HITL Workbench:
              </p>

              <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-3 liquid-glass p-3.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 shadow-xs">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-bold">Side-by-Side OCR Evidence:</strong>
                    Kotak sorotan merah (bounding box) pada slip gaji fisik langsung disandingkan dengan penalaran AI (Chain-of-Thought).
                  </div>
                </div>

                <div className="flex items-start gap-3 liquid-glass p-3.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 shadow-xs">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-bold">3 Gerbang Keputusan Auditor:</strong>
                    Pilihan tindakan: [APPROVE TEMUAN] untuk menerbitkan Surat Teguran, [ADJUST VALUE] koreksi bukti fisik, atau [REJECT].
                  </div>
                </div>

                <div className="flex items-start gap-3 liquid-glass p-3.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 shadow-xs">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-bold">Otomatisasi Sanksi TMP2T (PP 86/2013):</strong>
                    Penerbitan otomatis draf Surat Teguran I, II, dan rekomendasi pencabutan izin berusaha pada sistem OSS BKPM.
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={onGoToWorkbench}
                  className="px-6 py-3 text-xs font-bold text-white bg-[#009640] hover:bg-[#00883E] rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Uji Coba Dual-Pane HITL Workbench
                </button>
              </div>
            </div>

            {/* Visual Simulation of HITL Workbench */}
            <div className="liquid-glass rounded-3xl p-5 shadow-liquid-hover border border-white dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3 mb-3 text-xs">
                <span className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Dual-Pane HITL Workbench Live Preview
                </span>
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  Status: PENDING_HITL_REVIEW
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white/80 dark:bg-slate-900/80">
                  <p className="font-bold text-slate-700 dark:text-slate-300 mb-2">Bukti Fisik OCR (Hal 12/150):</p>
                  <div className="border-2 border-dashed border-red-500 bg-red-50/70 dark:bg-red-950/50 p-2.5 rounded-lg text-[10px] text-red-900 dark:text-red-300 font-mono">
                    <IconWarning className="w-3.5 h-3.5 text-red-600 inline mr-1 -mt-0.5" /> Gap Terdeteksi:
                    <br />Gaji Riil: Rp 8.500.000
                    <br />SIPP BPJS: Rp 5.300.000
                  </div>
                </div>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white/80 dark:bg-slate-900/80 flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Explainable AI (XAI):</p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Gap Under-Reporting: <strong className="text-red-600 dark:text-red-400 font-bold">37.6%</strong>
                      <br />Potensi Kerugian: <strong className="text-amber-700 dark:text-amber-400 font-bold">Rp 275.000.000</strong>
                    </p>
                  </div>
                  <div className="flex gap-1.5 mt-3">
                    <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-md text-[10px] font-bold">Approve</span>
                    <span className="px-2.5 py-1 bg-amber-600 text-white rounded-md text-[10px] font-bold">Override</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-[10px] text-slate-400 dark:text-slate-500 text-right">
                Target: PT Sumber Maju Sentosa • Skor Risiko: 84.50 (CRITICAL)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 8: DATA PRIVACY & UU PDP NO. 27/2022
         ========================================================================= */}
      <section id="pdp" className="py-20 relative bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800 reveal-on-scroll">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/80">
            Kepatuhan Hukum Privasi Data
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 mb-4">
            Sesuai Mandat UU No. 27 Tahun 2022 (Perlindungan Data Pribadi)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Seluruh NIK karyawan diproses menggunakan <strong className="text-slate-900 dark:text-white font-bold">Salted SHA-256 Pseudonymization</strong>, nama pekerja disamarkan otomatis (<span className="font-mono font-bold text-slate-800 dark:text-slate-200">B*** S******</span>), dan transmisi data dilindungi TLS 1.3. Tersedia modul generator data sintetis untuk pengujian aman 100% tanpa risiko kebocoran data riil.
          </p>

          <div className="inline-flex gap-3">
            <button
              onClick={onOpenDatasheet}
              className="px-6 py-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 liquid-glass-emerald hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-full transition-all cursor-pointer shadow-xs"
            >
              Buka Form Permohonan Data Sampel 2026
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER INSTITUSIONAL
         ========================================================================= */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 bg-white dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400 text-center transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <WasrikLogo size="sm" showSubtitle={false} />
          <p>© 2026 Wasrik AI • BPJS Kesehatan Healthkathon 2026 (Kategori 3: Efisiensi Risiko pada Pemberi Kerja)</p>
          <div className="flex gap-4 text-[11px] text-slate-400 dark:text-slate-500">
            <span>UU No. 24/2011</span>
            <span>PP No. 86/2013</span>
            <span>UU No. 27/2022</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPageView;