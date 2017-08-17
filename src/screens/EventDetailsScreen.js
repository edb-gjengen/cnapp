import React, { Component } from 'react';
import EventDetails from "../modules/events/EventDetails";
import {StyleProvider} from "native-base";
import getTheme from '../../native-base-theme/components';

export default class EventDetailsScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.item.title.decoded,
        headerStyle: {
            backgroundColor: '#f58220',
        },
        headerTitleStyle: {
            color: 'white',
        },
        headerTintColor: 'white',
    });

    render() {
        const { params } = this.props.navigation.state;
        return (
            <StyleProvider style={getTheme()}>
                <EventDetails item={params.item}/>
            </StyleProvider>
        );
    }
}