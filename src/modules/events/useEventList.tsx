import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useEffect, useState } from 'react';

import 'moment/locale/nb';
import type { EventType } from 'src/types/data';
import { fetchWithTimeout } from 'src/utils';

moment.locale('nb');

const formatDate = (time: string) => {
  const m = moment(time);
  return moment().year() === m.year() ? m.format('dddd D. MMMM') : m.format('ll');
};
type SectionedEvents = {
  data: EventType[];
  title: string;
};
/* Ref: https://medium.com/react-native-development/how-to-use-the-flatlist-component-react-native-basics-92c482816fe6 */
const useEventList = () => {
  const { navigate } = useNavigation();

  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);
  const [eventsSectioned, setEventsSectioned] = useState<SectionedEvents[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<Error | unknown | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const toSectionFormat = (freshEvents: EventType[]) => {
    const sectioned: Record<string, EventType[]> = {};
    freshEvents.forEach((event) => {
      const title = formatDate(event.start_time);
      if (title in sectioned) {
        sectioned[title].push(event);
      } else {
        sectioned[title] = [event];
      }
    });

    return Object.entries(sectioned).map(([title, section]) => ({ data: section, title }));
  };

  const handleRefresh = () => {
    setPage(1);
    setRefreshing(true);
    setTotalPages(1);
    fetchEvents();
  };

  const handleLoadMore = () => {
    if (page >= totalPages || loading) {
      return;
    }

    setPage(page + 1);
    fetchEvents();
  };

  const fetchEvents = async () => {
    const url = `${process.env.EXPO_PUBLIC_EVENT_API_URL}?view=compact-app`;
    setLoading(true);

    let eventData;
    try {
      const res = await fetchWithTimeout(url);
      eventData = await res.json().events;
    } catch (err) {
      setError(err);
      setLoading(false);
      return;
    }
    setTotalPages(Math.floor(eventData.total / 10));
    setEvents(page === 1 ? eventData : [...events, ...eventData]);
    setEventsSectioned(page === 1 ? toSectionFormat(eventData) : toSectionFormat([...events, ...eventData]));
    setError(eventData.error || null);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    handleRefresh,
    handleLoadMore,
    error,
    events,
    eventsSectioned,
    refreshing,
    loading,
  };
};

export default useEventList;
