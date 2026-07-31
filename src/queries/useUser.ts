import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { fetchUserData } from '@/api';
import { useAuth } from '@/auth/AuthContext';
import { ApiError } from '@/errors';
import { queryKeys } from '@/queries/queryKeys';

/** The logged in user. */
export function useUser() {
  const { token, signOut } = useAuth();

  const query = useQuery({
    queryKey: queryKeys.user,
    queryFn: () => fetchUserData(token as string),
    enabled: !!token,
    // staleTime 0: the cached user renders immediately while a refetch runs
    // in the background on mount
    staleTime: 0,
  });

  // Revoked token (401) → sign out; network errors never do
  const { error } = query;
  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      signOut();
    }
  }, [error, signOut]);

  return { ...query, user: query.data ?? null };
}
