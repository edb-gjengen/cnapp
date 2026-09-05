import { Linking } from 'react-native';

import type { UserType } from '@/types/data';

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

export function openPrivacyPolicy() {
  /** Opens the Dusken privacy policy in the browser */
  return Linking.openURL(withAppSource(process.env.EXPO_PUBLIC_DUSKEN_PRIVACY_POLICY_URL || ''));
}

export function displayName(user: UserType): string {
  /** Full name, or the email for accounts without one */
  const name = `${user.first_name} ${user.last_name}`.trim();
  return name || user.email;
}

export function snakeToCamelCase(val: string): string {
  return val.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export function fetchWithTimeout(url: string, options?: RequestInit, timeout = 10000) {
  /** Fetch that rejects with a TimeoutError and aborts the request after `timeout` ms */
  // FIXME: show timeout message in UI
  return fetch(url, { ...options, signal: AbortSignal.timeout(timeout) });
}
