import { useEffect, useState } from 'react';
import Config from 'react-native-config';
import moment from 'moment';
import 'moment/locale/nb';

import { useNavigation } from '@react-navigation/native';
import { fetchWithTimeout } from '../../utils';

moment.locale('nb');

const formatDate = (time) => {
  const m = moment(time);
  return moment().year() === m.year() ? m.format('dddd D. MMM') : m.format('ll');
};

/* Ref: https://medium.com/react-native-development/how-to-use-the-flatlist-component-react-native-basics-92c482816fe6 */
const useEventList = () => {
  const { navigate } = useNavigation();

  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsSectioned, setEventsSectioned] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const toSectionFormat = (freshEvents) => {
    const sectioned = {};
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
    const url = `${Config.EVENT_API_URL}/wp-json/wp/v2/events?page=${page}&future=1`;
    setLoading(true);

    let eventData;
    try {
      const res = await fetchWithTimeout(url);
      setTotalPages(parseInt(res.headers.get('x-wp-totalpages'), 10));
      eventData = await res.json();
    } catch (err) {
      setError(err);
      setLoading(false);
      return;
    }
    setEvents(page === 1 ? eventData : [...events, ...eventData]);
    setEventsSectioned(page === 1 ? toSectionFormat(eventData) : toSectionFormat([...events, ...eventData]));
    setError(eventData.error || null);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    showEvent: (event) => {
      navigate('EventDetail', { event });
    },
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
