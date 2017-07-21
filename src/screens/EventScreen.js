import React, { Component } from 'react';
import EventListContainer from "../modules/events/EventListContainer";

export default class EventsScreen extends Component {
    static navigationOptions = {
        title: 'Program',
    };

    render() {
        return (<EventListContainer/>);
    }
}