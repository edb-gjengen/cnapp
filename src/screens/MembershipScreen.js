import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Membership from '../modules/membership/Membership';

export default class MembershipScreen extends Component {
  static navigationOptions = {
    title: 'Medlemskap',
    tabBarIcon: ({ tintColor }) => <Icon name="user" size={16} color={tintColor} style={{ marginTop: 5 }} />,
  };

  render() {
    return <Membership />;
  }
}
