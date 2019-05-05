import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { StyleProvider } from 'native-base';
import EventListContainer from '../modules/events/EventListContainer';
import getTheme from '../../native-base-theme/components';

export default class EventsScreen extends Component {
  static navigationOptions = {
    title: 'Program',
    tabBarIcon: ({ tintColor }) => <Icon name="event" size={16} color={tintColor} style={{ marginTop: 5 }} />,
  };

  showEvent = (item) => {
    const { navigate } = this.props.navigation;
    navigate('EventDetail', { item });
  };

  render() {
    return (
      <StyleProvider style={getTheme()}>
        <EventListContainer showEvent={this.showEvent} />
      </StyleProvider>
    );
  }
}
