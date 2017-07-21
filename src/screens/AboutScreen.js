import React, { Component } from 'react';
import AboutContainer from "../modules/about/AboutContainer";

export default class AboutScreen extends Component {
    static navigationOptions = {
        title: 'Om oss',
    };

    render() {
        return (<AboutContainer/>);
    }
}