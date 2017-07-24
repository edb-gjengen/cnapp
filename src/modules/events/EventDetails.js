import React, { Component } from 'react';
import {ScrollView, Text} from "react-native";

export default class EventDetails extends Component {

    render() {
        const item = this.props.item;
        return (<ScrollView>
            <Text>{item.link}</Text>
        </ScrollView>)
    }
}
