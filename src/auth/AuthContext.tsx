import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { migrateReduxPersistAuth } from '@/auth/migrateFromReduxPersist';
import { getStoredToken, setStoredToken } from '@/auth/tokenStorage';
import { queryKeys } from '@/queries/queryKeys';

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  /** Test-only: start with this token and skip the storage bootstrap. */
  initialToken?: string | null;
}

/**
 * Owns the auth token. Renders nothing until the stored session is known.
 * Must sit under the query provider.
 */
export function AuthProvider({ children, initialToken }: AuthProviderProps) {
  const skipBootstrap = initialToken !== undefined;
  const [token, setToken] = useState<string | null>(initialToken ?? null);
  const [ready, setReady] = useState(skipBootstrap);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (skipBootstrap) {
      return;
    }
    let cancelled = false;
    (async () => {
      const migrated = await migrateReduxPersistAuth();
      if (migrated.user) {
        queryClient.setQueryData(queryKeys.user, migrated.user);
      }
      let storedToken: string | null = null;
      try {
        storedToken = await getStoredToken();
      } catch {
        // Unreadable storage means logged out for this launch
      }
      if (!cancelled) {
        setToken(storedToken);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [skipBootstrap, queryClient]);

  const signIn = useCallback((newToken: string) => {
    setToken(newToken);
    setStoredToken(newToken).catch(() => {});
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setStoredToken(null).catch(() => {});
    // So an in-flight /api/me/ can't resurrect the user after logout
    queryClient.cancelQueries({ queryKey: queryKeys.user }).catch(() => {});
    queryClient.removeQueries({ queryKey: queryKeys.user });
  }, [queryClient]);

  const value = useMemo(() => ({ token, isAuthenticated: token !== null, signIn, signOut }), [token, signIn, signOut]);

  if (!ready) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return value;
}
