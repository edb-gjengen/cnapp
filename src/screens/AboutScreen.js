import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {StyleProvider} from "native-base";

import AboutContainer from "../modules/about/AboutContainer";
import getTheme from '../../native-base-theme/components';

export default class AboutScreen extends Component {
    static navigationOptions = {
        title: 'Om oss',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="info" size={16} color={tintColor} style={{marginTop: 5}} />
        ),
    };

    render() {
        return (
            <StyleProvider style={getTheme()}>
                <AboutContainer />
            </StyleProvider>);
    }
}
