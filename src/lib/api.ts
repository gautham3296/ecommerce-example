/**
 * Utility helper to determine the active API Base URL.
 * Supports:
 * 1. Build-time configuration via Netlify environment variables (VITE_API_BASE_URL).
 * 2. Runtime custom overrides (e.g. from Admin dynamic settings) saved to localStorage.
 * 3. Default relative paths (e.g. /api/*) for standard proxy-redirect workflows.
 */
export function getApiUrl(path: string): string {
  // 1. Get custom override from local storage or Vite environment
  const customBase = localStorage.getItem('custom_api_base_url') || (import.meta as any).env?.VITE_API_BASE_URL || '';
  
  if (customBase) {
    const base = customBase.endsWith('/') ? customBase.slice(0, -1) : customBase;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }

  // 2. Default relative fallback (routes through Netlify dynamic proxies)
  return path;
}
