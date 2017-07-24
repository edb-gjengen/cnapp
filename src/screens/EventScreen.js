import React, { Component } from 'react';
import EventListContainer from "../modules/events/EventListContainer";
import Icon from 'react-native-vector-icons/SimpleLineIcons';

export default class EventsScreen extends Component {
    static navigationOptions = {
        title: 'Program',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="event" size={18} color={tintColor} style={{marginTop: 5}}/>
        ),
    };

    showEvent = (item) => {
        const { navigate } = this.props.navigation;
        navigate('EventDetails', {item: item})
    };

    render() {
        return (<EventListContainer showEvent={this.showEvent} />);
    }
}