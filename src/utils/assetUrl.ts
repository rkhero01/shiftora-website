/**
 * Resolves static asset paths relative to the application's base URL (e.g. /shiftora-website/ for GitHub Pages)
 */
export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:')
  ) {
    return path;
  }

  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  if (cleanBase !== '/' && path.startsWith(cleanBase)) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
};
