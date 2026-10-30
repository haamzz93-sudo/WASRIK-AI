/**
 * session.ts - Enterprise Session & Cookie Persistence for WasrikAgent AI
 * Complies with UU PDP No. 27/2022 & BPJS SSO Session Governance
 */

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
  } catch (e) {
    console.error('Failed to save session:', e);
  }
};

export const getSavedSession = () => {
  try {
    const token = localStorage.getItem('wasrik_token') || getCookie('wasrik_token');
    const userStr = localStorage.getItem('wasrik_user') || getCookie('wasrik_user');
    const view = localStorage.getItem('wasrik_active_view') || getCookie('wasrik_active_view');
    const sessionActive = sessionStorage.getItem('wasrik_session_active') || getCookie('wasrik_session_active');

    if (token && userStr) {
      const user = JSON.parse(userStr);
      return {
        token,
        user,
        view: view || 'workbench',
        isAuthenticated: true,
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
  };
};

export const updateActiveView = (view: string) => {
  try {
    localStorage.setItem('wasrik_active_view', view);
    setCookie('wasrik_active_view', view, 7);
  } catch (e) {
    console.error('Failed to update active view:', e);
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem('wasrik_token');
    localStorage.removeItem('wasrik_user');
    localStorage.removeItem('wasrik_active_view');
    sessionStorage.removeItem('wasrik_session_active');

    deleteCookie('wasrik_token');
    deleteCookie('wasrik_user');
    deleteCookie('wasrik_active_view');
    deleteCookie('wasrik_session_active');
  } catch (e) {
    console.error('Failed to clear session:', e);
  }
};
