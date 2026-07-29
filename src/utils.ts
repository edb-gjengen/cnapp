// Sites tracked by our Umami instance. Subdomains (galtinn.neuf.no, www.*) match too.
const APP_SOURCE_DOMAINS = ['neuf.no', 'studentersamfundet.no'];

export function withAppSource(url: string): string {
  /** Tags links to our own sites with UTM params, since app links carry no referrer */
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  const isOwnSite = APP_SOURCE_DOMAINS.some(
    (domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`),
  );
  if (!isOwnSite) {
    return url;
  }
  parsed.searchParams.set('utm_source', 'neuf-app');
  parsed.searchParams.set('utm_medium', 'app');
  return parsed.toString();
}

export function snakeToCamelCase(val: string): string {
  return val.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export function fetchWithTimeout(url: string, options?: RequestInit, timeout = 10000) {
  /** Wraps fetch to allow it to time out */
  // FIXME: show timeout message in UI
  return new Promise<Response>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Fetch request timed out'));
    }, timeout);

    fetch(url, options).then(
      (response) => {
        clearTimeout(timer);
        resolve(response);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}
