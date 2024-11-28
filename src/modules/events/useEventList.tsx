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
  const [error, setError] = useState<Error | unknown | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const fetchEvents = async () => {
    const url = `${process.env.EXPO_PUBLIC_EVENT_API_URL}?view=compact-app`;
    setLoading(true);

    let response;
    let events;
    try {
      const res = await fetchWithTimeout(url);
      response = await res.json();
      events = response.events;
    } catch (err) {
      setError(err);
      setLoading(false);
      return;
    }
    setEvents(events);
    setError(response.error || null);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    handleRefresh,
    error,
    events,
    refreshing,
    loading,
  };
};

export default useEventList;
