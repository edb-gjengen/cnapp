import React, { Component } from 'react';
import EventDetails from "../modules/events/EventDetails";

export default class EventDetailsScreen extends Component {
    static navigationOptions = {
        title: 'Detaljer',
    };

    render() {
        const { params } = this.props.navigation.state;
        return (<EventDetails item={params.item}/>);
    }
}