import React, { Component } from 'react';
import EventListContainer from "../modules/events/EventListContainer";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {StyleProvider} from "native-base";
import getTheme from '../../native-base-theme/components';

export default class EventsScreen extends Component {
    static navigationOptions = {
        title: 'Program',
        headerStyle: {
            backgroundColor: '#f58220',
        },
        headerTitleStyle: {
            color: 'white',
        },
        headerTintColor: 'white',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="event" size={16} color={tintColor} style={{marginTop: 5}}/>
        ),
    };

    showEvent = (item) => {
        const { navigate } = this.props.navigation;
        navigate('EventDetails', {item: item})
    };

    render() {
        return (
            <StyleProvider style={getTheme()}>
                <EventListContainer showEvent={this.showEvent}/>
            </StyleProvider>
        );
    }
}