import React from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { StyleProvider } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import EventListContainer from '../modules/events/EventListContainer';
// FIXME: theme
// https://docs.nativebase.io/setup-provider#add-custom-theme-optional
// import getTheme from '../../native-base-theme/components';

const EventsScreen = () => {
  const { navigate } = useNavigation();
  return (
    <StyleProvider>
      <EventListContainer
        showEvent={(item) => {
          navigate('EventDetail', { item });
        }}
      />
    </StyleProvider>
  );
};

const tabBarIcon = ({ tintColor }) => <Icon name="event" size={16} color={tintColor} style={{ marginTop: 5 }} />;

EventsScreen.navigationOptions = {
  title: 'Program',
  tabBarIcon,
};
export default EventsScreen;
