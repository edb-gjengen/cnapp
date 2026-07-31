import { useEvents } from '@/queries/useEvents';

const useEventList = () => {
  const { data, error, isPending, isRefetching, refetch } = useEvents();

  return {
    handleRefresh: () => {
      refetch();
    },
    error,
    events: data ?? [],
    refreshing: isRefetching,
    loading: isPending,
  };
};

export default useEventList;
