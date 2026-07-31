import { useMutation } from '@tanstack/react-query';

import { deleteUser } from '@/api';
import { useAuth } from '@/auth/AuthContext';

export function useDeleteUserMutation() {
  const { token, signOut } = useAuth();

  return useMutation({
    mutationFn: () => deleteUser(token ?? ''),
    onSuccess: () => signOut(),
  });
}
