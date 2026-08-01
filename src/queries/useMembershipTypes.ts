import { useQuery } from '@tanstack/react-query';

import { fetchMembershipTypes } from '@/api';
import { queryKeys } from '@/queries/queryKeys';

/** The purchasable membership types with prices. */
export function useMembershipTypes() {
  return useQuery({
    queryKey: queryKeys.membershipTypes,
    queryFn: fetchMembershipTypes,
    staleTime: 5 * 60 * 1000,
  });
}
