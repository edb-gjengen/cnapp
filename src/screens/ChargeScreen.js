import React, { Component } from 'react';
import Charge from "../modules/membership/Charge";
import {StyleProvider} from "native-base";
import getTheme from '../../native-base-theme/components';

export default class ChargeScreen extends Component {
    static navigationOptions = {
        title: 'Kjøp medlemskap',
        headerStyle: {
            backgroundColor: '#f58220',
        },
        headerTitleStyle: {
            color: 'white',
        },
        headerTintColor: 'white',
    };

    onCharged = () => {
        // This works since ChargeScreen is allways navigated to from MembershipScreen
        this.props.navigation.goBack();
    };

    render() {
        return (
            <StyleProvider style={getTheme()}>
                <Charge onCharged={this.onCharged} />
            </StyleProvider>
        )
    }
}