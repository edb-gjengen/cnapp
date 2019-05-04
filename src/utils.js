export function snakeToCamelCase(val) {
    return val.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

export function fetchWithTimeout(url, options, timeout=10000) {
    /** Wraps fetch to allow it to time out */
    // FIXME: show timeout message in UI
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Fetch request timed out')), timeout)
        )
    ]);
}
