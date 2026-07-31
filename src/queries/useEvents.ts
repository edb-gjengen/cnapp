import { useQuery } from '@tanstack/react-query';

import { fetchEvents } from '@/api';
import { queryKeys } from '@/queries/queryKeys';

export function useEvents() {
  return useQuery({
    queryKey: queryKeys.events,
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000,
  });
}
