import type { Query } from '@tanstack/react-query';

import { ApiError } from '@/errors';
import { appQueryClient, persistOptions } from '@/queries/queryClient';

const queryDefaults = appQueryClient.getDefaultOptions().queries!;

describe('retry', () => {
  const retry = queryDefaults.retry as (failureCount: number, error: Error) => boolean;

  it('retries a failed request once', () => {
    expect(retry(0, new Error('network down'))).toBe(true);
    expect(retry(1, new Error('network down'))).toBe(false);
  });

  it('never retries a 401, whose token is dead', () => {
    expect(retry(0, new ApiError({ detail: 'Ugyldig token.' }, 401))).toBe(false);
  });

  it('retries other API errors', () => {
    expect(retry(0, new ApiError({ detail: 'Serverfeil' }, 500))).toBe(true);
  });

  it('does not retry mutations', () => {
    expect(appQueryClient.getDefaultOptions().mutations?.retry).toBe(0);
  });
});

describe('persistOptions', () => {
  it('only dehydrates successful queries', () => {
    const shouldDehydrateQuery = persistOptions.dehydrateOptions!.shouldDehydrateQuery!;

    expect(shouldDehydrateQuery({ state: { status: 'success' } } as unknown as Query)).toBe(true);
    expect(shouldDehydrateQuery({ state: { status: 'error' } } as unknown as Query)).toBe(false);
    expect(shouldDehydrateQuery({ state: { status: 'pending' } } as unknown as Query)).toBe(false);
  });

  it('keeps the persisted cache for 90 days of offline proof, within gcTime', () => {
    expect(persistOptions.maxAge).toBe(90 * 24 * 60 * 60 * 1000);
    // must stay ≥ maxAge; finite values this large overflow setTimeout and GC immediately
    expect(queryDefaults.gcTime).toBe(Infinity);
  });
});
