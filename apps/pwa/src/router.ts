import { useEffect, useState } from 'preact/hooks';

export interface Route { path: string; query: URLSearchParams }

export function parseHash(hash: string): Route {
  const h = hash.replace(/^#/, '') || '/';
  const [path = '/', q = ''] = h.split('?');
  return { path: path || '/', query: new URLSearchParams(q) };
}

export function navigate(path: string, opts: { replace?: boolean } = {}): void {
  const target = `#${path}`;
  if (opts.replace) {
    history.replaceState(null, '', `${location.pathname}${location.search}${target}`);
    dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    location.hash = path;
  }
}

export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const pp = pattern.split('/').filter(Boolean);
  const cp = path.split('/').filter(Boolean);
  if (pp.length !== cp.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pp.length; i++) {
    const p = pp[i], c = cp[i];
    if (p.startsWith(':')) params[p.slice(1)] = decodeURIComponent(c);
    else if (p !== c) return null;
  }
  return params;
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(location.hash));
  useEffect(() => {
    const on = () => setRoute(parseHash(location.hash));
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return route;
}
