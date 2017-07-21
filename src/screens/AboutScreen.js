import React, { Component } from 'react';
import AboutContainer from "../modules/about/AboutContainer";
import Icon from 'react-native-vector-icons/SimpleLineIcons';

export default class AboutScreen extends Component {
    static navigationOptions = {
        title: 'Om oss',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="info" size={18} color={tintColor} style={{marginTop: 5}} />
        ),
    };

    render() {
        return (<AboutContainer/>);
    }
}