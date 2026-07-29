import { fetchWithTimeout, snakeToCamelCase, withAppSource } from '@/utils';

describe('withAppSource', () => {
  it('tags links to our own sites with UTM params', () => {
    expect(withAppSource('https://neuf.no/arrangement/123/')).toBe(
      'https://neuf.no/arrangement/123/?utm_source=neuf-app&utm_medium=app',
    );
    expect(withAppSource('https://www.studentersamfundet.no/')).toBe(
      'https://www.studentersamfundet.no/?utm_source=neuf-app&utm_medium=app',
    );
  });

  it('tags subdomains of our own sites', () => {
    expect(withAppSource('https://galtinn.neuf.no/nb/personvern/')).toBe(
      'https://galtinn.neuf.no/nb/personvern/?utm_source=neuf-app&utm_medium=app',
    );
  });

  it('preserves existing query params and fragments', () => {
    expect(withAppSource('https://neuf.no/sok?q=konsert')).toBe(
      'https://neuf.no/sok?q=konsert&utm_source=neuf-app&utm_medium=app',
    );
    expect(withAppSource('https://neuf.no/praktisk#apningstider')).toBe(
      'https://neuf.no/praktisk?utm_source=neuf-app&utm_medium=app#apningstider',
    );
  });

  it('leaves other sites untouched', () => {
    expect(withAppSource('https://www.facebook.com/studentersamfundet/')).toBe(
      'https://www.facebook.com/studentersamfundet/',
    );
    // Suffix match must not catch lookalike domains
    expect(withAppSource('https://evilneuf.no/')).toBe('https://evilneuf.no/');
  });

  it('leaves non-web URLs and invalid URLs untouched', () => {
    expect(withAppSource('tel:+4794430002')).toBe('tel:+4794430002');
    expect(withAppSource('mailto:ledelsen@studentersamfundet.no')).toBe('mailto:ledelsen@studentersamfundet.no');
    expect(withAppSource('fb://page/?id=23664032291')).toBe('fb://page/?id=23664032291');
    expect(withAppSource('')).toBe('');
  });
});

describe('snakeToCamelCase', () => {
  it('converts snake_case to camelCase', () => {
    expect(snakeToCamelCase('date_time_start')).toBe('dateTimeStart');
    expect(snakeToCamelCase('is_member')).toBe('isMember');
  });

  it('leaves strings without underscores untouched', () => {
    expect(snakeToCamelCase('events')).toBe('events');
    expect(snakeToCamelCase('dateTimeStart')).toBe('dateTimeStart');
  });
});

describe('fetchWithTimeout', () => {
  const realFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it('forwards the url and options and attaches an abort signal', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await fetchWithTimeout('https://galtinn.neuf.no/api/me/', { method: 'POST' });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://galtinn.neuf.no/api/me/',
      expect.objectContaining({ method: 'POST', signal: expect.any(AbortSignal) }),
    );
  });

  it('rejects with a TimeoutError that aborts the request when the timeout elapses', async () => {
    globalThis.fetch = ((_url: string, options?: RequestInit) =>
      new Promise((_resolve, reject) => {
        options?.signal?.addEventListener('abort', () => reject(options.signal?.reason));
      })) as unknown as typeof fetch;

    await expect(fetchWithTimeout('https://galtinn.neuf.no/api/me/', undefined, 10)).rejects.toMatchObject({
      name: 'TimeoutError',
    });
  });
});
