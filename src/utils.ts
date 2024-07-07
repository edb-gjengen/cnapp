export function snakeToCamelCase(val: string): string {
  return val.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export function fetchWithTimeout(url: string, options?: RequestInit, timeout = 10000) {
  /** Wraps fetch to allow it to time out */
  // FIXME: show timeout message in UI
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Fetch request timed out'));
      }, timeout);
    }),
  ]);
}
