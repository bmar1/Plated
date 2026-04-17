function normalizeApiBase(url) {
  if (url == null || String(url).trim() === '') return '';
  let base = String(url).trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(base)) base = `https://${base}`;
  return base;
}

/** Backend API base URL (no trailing slash), from `import.meta.env.VITE_API_URL`. */
export const VITE_API_URL = normalizeApiBase(import.meta.env.VITE_API_URL);
