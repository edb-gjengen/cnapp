import { useMutation } from '@tanstack/react-query';

import { login } from '@/api';
import { useAuth } from '@/auth/AuthContext';

interface LoginVariables {
  username: string;
  password: string;
}

export function useLoginMutation() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: ({ username, password }: LoginVariables) => login(username, password),
    onSuccess: ({ token }) => signIn(token),
  });
}
