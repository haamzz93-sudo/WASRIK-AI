import React from 'react';
import { WasrikLogo } from './WasrikLogo';
import { UserProfile } from '../types/wasrik';
import { useTheme } from '../context/ThemeContext';
import {
  IconDocument,
  IconBrain,
  IconGraph,
  IconScale,
  IconShieldCheck,
  IconCpu,
  IconTerminal,
  IconSun,
  IconMoon,
} from './Icons';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: UserProfile;
  onOpenDatasheet: () => void;
  onOpenLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenDatasheet,
  onOpenLogout,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { theme, toggleTheme } = useTheme();

  const menuGroups = [
    {
      groupTitle: 'AUDIT & PENGAWASAN',
      items: [
        {
          id: 'queue',
          label: 'Antrean Prioritas BU',
          badge: '523k BU',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          ),
        },
        {
          id: 'workbench',
          label: 'Dual-Pane HITL Workbench',
          badge: 'Live Gate',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
        {
          id: 'dashboard',
          label: 'Peta Sebaran & Kerugian',
          badge: 'Rp 4,25T',
          icon: <IconGraph className="w-4 h-4" />,
        },
      ],
    },
    {
      groupTitle: 'AI AGENT & SIMULASI',
      items: [
        {
          id: 'hermes',
          label: 'Hermes Agent Console',
          badge: 'Port 8787',
          icon: <IconTerminal className="w-4 h-4 text-emerald-300" />,
        },
        {
          id: 'agents',
          label: 'Simulator Multi-Agent AI',
          badge: '4 Agen',
          icon: <IconCpu className="w-4 h-4" />,
        },
        {
          id: 'uploader',
          label: 'Upload Berkas Payroll',
          badge: 'Mandiri',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          ),
        },
        {
          id: 'synthetic',
          label: 'Data Sintetis (UU PDP)',
          badge: 'SHA-256',
          icon: <IconShieldCheck className="w-4 h-4" />,
        },
      ],
    },
    {
      groupTitle: 'STANDAR & REGULASI',
      items: [
        {
          id: 'docs',
          label: 'Dokumentasi SRS & Arsitektur',
          badge: 'v2.0 Final',
          icon: <IconDocument className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-fade-in"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 h-screen min-h-screen bg-gradient-to-b from-[#004D23] via-[#003E1C] to-[#002D14] dark:from-[#032414] dark:via-[#021B0F] dark:to-[#01140B] text-white border-r border-[#006930]/80 dark:border-emerald-950/80 flex flex-col justify-between transition-all duration-300 shrink-0 shadow-2xl md:shadow-lg ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-72'}`}
      >
      {/* Top Header & Brand */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        {!isCollapsed ? (
          <button
            onClick={() => onNavigate('landing')}
            className="text-left focus:outline-hidden hover:opacity-90 transition-opacity cursor-pointer"
          >
            <WasrikLogo variant="white" size="sm" showSubtitle={false} />
          </button>
        ) : (
          <div className="mx-auto cursor-pointer" onClick={() => onNavigate('landing')}>
            <WasrikLogo variant="emblem" size="sm" />
          </div>
        )}

        <div className="flex items-center gap-1">
          {/* Mobile Close Drawer Button */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-emerald-200/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Tutup Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Desktop Collapse Button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:inline-flex p-1.5 rounded-lg text-emerald-200/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isCollapsed ? 'Perluas Menu' : 'Ciutkan Menu'}
          >
            <svg
              className={`w-4 h-4 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Navigation Items (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-3.5 space-y-4">
        {/* Landing Page Home Link */}
        <div>
          <button
            onClick={() => onNavigate('landing')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-98 cursor-pointer ${
              currentView === 'landing'
                ? 'bg-white/20 text-white shadow-xs border border-white/30 backdrop-blur-md'
                : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <svg className="w-4 h-4 shrink-0 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {!isCollapsed && <span>Halaman Utama (Pitch)</span>}
          </button>
        </div>

        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold tracking-wider text-emerald-200/70 uppercase">
                {group.groupTitle}
              </p>
            )}

            {group.items.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={item.label}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 active:scale-98 cursor-pointer ${
                    isActive
                      ? 'bg-white/20 text-white font-bold border border-white/30 shadow-md backdrop-blur-md'
                      : 'text-emerald-100/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={isActive ? 'text-white' : 'text-emerald-300/80'}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="truncate whitespace-nowrap">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-mono shrink-0 ml-2 border transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white border-white/30'
                        : 'bg-emerald-900/60 text-emerald-200 border-emerald-700/50'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Footer Info & Logout */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {/* Quick Datasheet trigger */}
        <button
          onClick={onOpenDatasheet}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/30 rounded-xl transition-all duration-200 active:scale-98 cursor-pointer shadow-2xs backdrop-blur-xs"
        >
          <IconDocument className="w-3.5 h-3.5 text-emerald-200" />
          {!isCollapsed && <span>Data Sampel &amp; Form 2026</span>}
        </button>

        {/* User Profile Mini Card & Logout */}
        {isCollapsed ? (
          <button
            onClick={onOpenLogout}
            title={`Keluar: ${currentUser?.name || 'Wasrik User'}`}
            className="w-full h-10 rounded-xl bg-black/25 hover:bg-rose-500/30 border border-white/10 hover:border-rose-400/40 flex items-center justify-center text-white font-black text-xs transition-all duration-200 active:scale-95 cursor-pointer group"
          >
            <span className="group-hover:hidden">{(currentUser?.name || 'W').charAt(0)}</span>
            <svg className="w-4 h-4 text-rose-200 hidden group-hover:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        ) : (
          <div className="flex items-center justify-between p-2 rounded-xl bg-black/25 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                {(currentUser?.name || 'W').charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-[11px] font-bold text-white truncate">{currentUser?.name || 'Wasrik User'}</p>
                <p className="text-[9.5px] text-emerald-200 truncate">{currentUser?.roleTitle || currentUser?.role_title || currentUser?.role || 'Auditor Wasrik'}</p>
              </div>
            </div>

            <button
              onClick={onOpenLogout}
              title="Keluar / Ganti Akun"
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-white/15 transition-colors cursor-pointer shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>
    </>
  );
};

export default Sidebar;