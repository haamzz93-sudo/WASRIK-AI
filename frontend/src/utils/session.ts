/**
 * session.ts - Enterprise Session, Inactivity Timeout & Cookie Persistence
 * WasrikAgent AI 2.0 • BPJS Kesehatan Healthkathon 2026
 * Sesuai Standar Keamanan BPJS SSO & UU PDP No. 27/2022
 */

// Sesi otomatis kedaluwarsa jika tidak ada aktivitas selama 30 menit (1.800.000 ms)
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};

/**
 * Mencatat waktu aktivitas terakhir pengguna (mouse move, click, keypress, scroll)
 */
export const recordActivity = () => {
  try {
    const now = Date.now().toString();
    localStorage.setItem('wasrik_last_activity', now);
    setCookie('wasrik_last_activity', now, 1);
  } catch (e) {
    // ignore in restricted iframe/private mode
  }
};

/**
 * Mendapatkan timestamp aktivitas terakhir
 */
export const getLastActivity = (): number | null => {
  try {
    const val = localStorage.getItem('wasrik_last_activity') || getCookie('wasrik_last_activity');
    if (val) {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return null;
};

/**
 * Memeriksa apakah sesi telah kedaluwarsa karena tidak aktif > 30 menit
 */
export const isSessionExpired = (): boolean => {
  try {
    const last = getLastActivity();
    if (!last) return false;
    const elapsed = Date.now() - last;
    if (elapsed > SESSION_TIMEOUT_MS) {
      clearSession();
      return true;
    }
  } catch (e) {
    console.warn('Failed to verify session timeout:', e);
  }
  return false;
};

/**
 * Menghitung sisa waktu sesi aktif dalam detik (0 s/d 1800 detik)
 */
export const getRemainingSessionSeconds = (): number => {
  const last = getLastActivity();
  if (!last) return Math.floor(SESSION_TIMEOUT_MS / 1000);
  const elapsed = Date.now() - last;
  const remaining = Math.max(0, SESSION_TIMEOUT_MS - elapsed);
  return Math.floor(remaining / 1000);
};

export const saveSession = (user: any, token: string, view = 'workbench') => {
  try {
    const userStr = JSON.stringify(user);
    localStorage.setItem('wasrik_token', token);
    localStorage.setItem('wasrik_user', userStr);
    localStorage.setItem('wasrik_active_view', view);
    sessionStorage.setItem('wasrik_session_active', '1');

    setCookie('wasrik_token', token, 7);
    setCookie('wasrik_user', userStr, 7);
    setCookie('wasrik_active_view', view, 7);
    setCookie('wasrik_session_active', '1', 7);

    recordActivity();
  } catch (e) {
    console.error('Failed to save session:', e);
  }
};

export const getSavedSession = () => {
  try {
    // Verifikasi batas waktu ketidakaktifan 30 menit terlebih dahulu
    if (isSessionExpired()) {
      return {
        token: null,
        user: null,
        view: null,
        isAuthenticated: false,
        isTimedOut: true,
      };
    }

    const token = localStorage.getItem('wasrik_token') || getCookie('wasrik_token');
    const userStr = localStorage.getItem('wasrik_user') || getCookie('wasrik_user');
    const view = localStorage.getItem('wasrik_active_view') || getCookie('wasrik_active_view');

    if (token && userStr) {
      const user = JSON.parse(userStr);
      // Perbarui stempel waktu aktivitas
      recordActivity();
      return {
        token,
        user,
        view: view || 'workbench',
        isAuthenticated: true,
        isTimedOut: false,
      };
    }
  } catch (e) {
    console.warn('Failed to parse saved session:', e);
  }
  return {
    token: null,
    user: null,
    view: null,
    isAuthenticated: false,
    isTimedOut: false,
  };
};

export const updateActiveView = (view: string) => {
  try {
    localStorage.setItem('wasrik_active_view', view);
    setCookie('wasrik_active_view', view, 7);
    recordActivity();
  } catch (e) {
    console.error('Failed to update active view:', e);
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem('wasrik_token');
    localStorage.removeItem('wasrik_user');
    localStorage.removeItem('wasrik_active_view');
    localStorage.removeItem('wasrik_last_activity');
    sessionStorage.removeItem('wasrik_session_active');

    deleteCookie('wasrik_token');
    deleteCookie('wasrik_user');
    deleteCookie('wasrik_active_view');
    deleteCookie('wasrik_session_active');
    deleteCookie('wasrik_last_activity');
  } catch (e) {
    console.error('Failed to clear session:', e);
  }
};
