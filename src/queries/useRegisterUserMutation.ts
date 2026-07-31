import { useMutation, useQueryClient } from '@tanstack/react-query';

import { registerUser } from '@/api';
import { useAuth } from '@/auth/AuthContext';
import { queryKeys } from '@/queries/queryKeys';
import type { UserRegisterFormValues } from '@/types/forms';

export function useRegisterUserMutation() {
  const { signIn } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: UserRegisterFormValues) => registerUser(values),
    onSuccess: ({ user, token }) => {
      // Seed the user before signIn flips isAuthenticated: no spinner flash
      queryClient.setQueryData(queryKeys.user, user);
      signIn(token);
    },
  });
}
