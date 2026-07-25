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
