import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types/wasrik';
import { useTheme } from '../context/ThemeContext';
import { IconSun, IconMoon, IconDocument, IconChevronDown, IconCheckCircle, IconUser, IconShieldCheck } from './Icons';

interface TopHeaderProps {
  currentUser: UserProfile;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenDatasheet: () => void;
  onSwitchRole: (role: UserProfile['role']) => void;
  onToggleMobileMenu?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenDatasheet,
  onSwitchRole,
  onToggleMobileMenu,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const viewTitles: Record<string, string> = {
    landing: 'Portal Eksekutif Healthkathon',
    queue: 'Antrean Prioritas Badan Usaha',
    workbench: 'Dual-Pane HITL Workbench',
    dashboard: 'Peta Sebaran Risiko Nasional',
    agents: 'Simulator Multi-Agent AI',
    hermes: 'Hermes Agent Console (:8787)',
    uploader: 'Pemeriksaan Mandiri Payroll',
    synthetic: 'Generator Data Sintetis (UU PDP)',
    docs: 'Dokumentasi Arsitektur & SRS',
  };

  const roleOptions: { value: UserProfile['role']; label: string; desc: string; badge: string }[] = [
    {
      value: 'auditor',
      label: 'Auditor Wasrik Madya',
      desc: 'Level 1: Verifikasi OCR & Keputusan HITL',
      badge: 'RBAC L1',
    },
    {
      value: 'supervisor',
      label: 'Kepala Kantor Cabang',
      desc: 'Level 2: Otorisasi Sanksi TMP2T PP 86/2013',
      badge: 'RBAC L2',
    },
    {
      value: 'auditee',
      label: 'Perwakilan BU (Auditee)',
      desc: 'Sanggahan Payroll & Status Kepatuhan',
      badge: 'Auditee',
    },
    {
      value: 'admin',
      label: 'System Administrator',
      desc: 'Manajemen Sistem & Rule Engine',
      badge: 'Admin',
    },
  ];

  // Outside click listener for user profile menu
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <header className="h-14 bg-gradient-to-r from-[#004D23] via-[#005728] to-[#00441F] dark:from-[#032414] dark:via-[#021B0F] dark:to-[#01140B] border-b border-[#006930]/80 dark:border-emerald-950/80 px-3 sm:px-5 flex items-center justify-between sticky top-0 z-30 transition-all duration-300 shadow-md">
      
      {/* Left: Mobile Hamburger & Interactive Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 -ml-1 rounded-xl text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all cursor-pointer shrink-0"
            title="Buka Menu Navigasi"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium min-w-0">
          {/* Shortcut Button 1: Portal Wasrik -> Landing Page */}
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            title="Shortcut: Kembali ke Halaman Utama (Pitch)"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 transition-all duration-200 cursor-pointer shadow-2xs shrink-0"
          >
            <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-semibold">Portal Wasrik</span>
          </button>

          <span className="hidden sm:inline text-emerald-300/60 font-light select-none">/</span>

          {/* Shortcut Button 2: Branch Office -> Priority Queue */}
          <button
            type="button"
            onClick={() => onNavigate('queue')}
            title="Shortcut: Lihat Antrean Prioritas Kantor Cabang"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 transition-all duration-200 cursor-pointer shadow-2xs shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{currentUser?.branch || 'KC Cikarang'}</span>
          </button>

          <span className="hidden md:inline text-emerald-300/60 font-light select-none">/</span>

          {/* Shortcut Pill 3: Current View Active Capsule */}
          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-white/20 text-white font-bold text-xs border border-white/30 shadow-xs backdrop-blur-xs truncate transition-all duration-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0" />
            <span className="truncate max-w-[130px] sm:max-w-none">{viewTitles[currentView] || 'Sistem Pengawasan'}</span>
          </div>
        </nav>
      </div>

      {/* Right: Calm, Harmonious Controls matching Wasrik Green Theme */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        
        {/* System Health Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-black/25 dark:bg-black/40 border border-white/15 rounded-full text-[11px] font-mono text-emerald-200 shadow-2xs backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-medium">wasrik_db</span>
          <span className="text-emerald-400/50">•</span>
          <span className="text-emerald-300 font-bold">:8787 ON</span>
        </div>

        {/* Data Sample Modal Trigger Button */}
        <button
          onClick={onOpenDatasheet}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-500/25 hover:bg-emerald-500/40 border border-emerald-400/40 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer shadow-xs backdrop-blur-xs"
        >
          <IconDocument className="w-3.5 h-3.5 text-emerald-200" />
          <span className="hidden sm:inline">Data Sampel 2026</span>
          <span className="sm:hidden">Data</span>
        </button>

        {/* Dark / Light Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
          className="w-8 h-8 rounded-xl bg-black/25 dark:bg-black/40 hover:bg-black/40 dark:hover:bg-black/60 text-emerald-100 hover:text-white border border-white/15 flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-2xs backdrop-blur-xs"
        >
          {theme === 'dark' ? (
            <IconSun className="w-4 h-4 text-amber-300" />
          ) : (
            <IconMoon className="w-4 h-4 text-emerald-200" />
          )}
        </button>

        {/* Combined User Profile Dropdown Button */}
        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-black/25 dark:bg-black/40 hover:bg-black/40 dark:hover:bg-black/60 border border-white/15 transition-all duration-200 active:scale-98 cursor-pointer shadow-2xs backdrop-blur-xs"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
              {(currentUser?.name || 'W').charAt(0)}
            </div>
            <div className="text-left hidden sm:block leading-tight">
              <p className="text-xs font-bold text-white truncate max-w-[130px]">
                {(currentUser?.name || 'Wasrik').split(' ')[0]}
              </p>
              <p className="text-[10px] text-emerald-200 truncate max-w-[130px]">
                {(currentUser?.roleTitle || currentUser?.role_title || currentUser?.role || 'Auditor').split(' ')[0]} ({currentUser?.role || 'auditor'})
              </p>
            </div>
            <IconChevronDown
              className={`w-3.5 h-3.5 text-emerald-200 transition-transform duration-200 shrink-0 ${
                isProfileMenuOpen ? 'rotate-180 text-white' : ''
              }`}
            />
          </button>

          {/* Floating Role Switcher Menu Popover */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl p-2 z-50 animate-fade-in space-y-1">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser?.name || 'Darmawan Lahru Riatma'}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {currentUser?.email || `${(currentUser?.name || 'wasrik').toLowerCase().replace(/[^a-z]/g, '')}@bpjs-kesehatan.go.id`}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  NIP: {currentUser?.nip || '19940822 201802 1 002'} • {currentUser?.branch || 'KC Cikarang'}
                </p>
              </div>

              <p className="px-3 pt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Ganti Peran Demonstrasi (RBAC):
              </p>

              {roleOptions.map((opt) => {
                const isSelected = currentUser.role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSwitchRole(opt.value);
                      setIsProfileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <p className="font-semibold leading-tight">{opt.label}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold shrink-0 ml-2">
                        Aktif
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default TopHeader;