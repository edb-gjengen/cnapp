import { withAppSource } from '@/utils';

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
