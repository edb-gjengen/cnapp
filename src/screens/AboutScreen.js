import React, { Component } from 'react';
import AboutContainer from "../modules/about/AboutContainer";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import getTheme from '../../native-base-theme/components';
import {StyleProvider} from "native-base";

export default class AboutScreen extends Component {
    static navigationOptions = {
        title: 'Om oss',
        headerStyle: {
            backgroundColor: '#f58220',
        },
        tabBarIcon: ({ tintColor }) => (
            <Icon name="info" size={18} color={tintColor} style={{marginTop: 5}} />
        ),
    };

    render() {
        return (
            <StyleProvider style={getTheme()}>
                <AboutContainer/>
            </StyleProvider>);
    }
}