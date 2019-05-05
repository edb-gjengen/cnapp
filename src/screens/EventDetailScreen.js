import React from 'react';
import { StyleProvider } from 'native-base';
import { useNavigationParam } from 'react-navigation-hooks/src/Hooks';

import EventDetail from '../modules/events/EventDetail';
import getTheme from '../../native-base-theme/components';

const EventDetailScreen = () => {
  const item = useNavigationParam('item');

  return (
    <StyleProvider style={getTheme()}>
      <EventDetail item={item} />
    </StyleProvider>
  );
};
EventDetailScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params.item.title.decoded,
});

export default EventDetailScreen;
