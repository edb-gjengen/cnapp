import { useMutation } from '@tanstack/react-query';

import { requestStripePaymentSheet } from '@/api';
import { useAuth } from '@/auth/AuthContext';

export function usePaymentSheetMutation() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (membershipTypeSlug: string) => requestStripePaymentSheet(token ?? '', membershipTypeSlug),
  });
}
