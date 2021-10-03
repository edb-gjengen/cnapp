import React from 'react';
import { useNavigation } from '@react-navigation/native';

import EventListContainer from '../modules/events/EventListContainer';

const EventListScreen = () => {
  const { navigate } = useNavigation();
  return (
    <EventListContainer
      showEvent={(item) => {
        navigate('EventDetail', { item });
      }}
    />
  );
};

export default EventListScreen;
