import React from 'react';
import {connect} from "react-redux";
import {Platform, StyleSheet} from 'react-native';
import {TabNavigator, StackNavigator} from "react-navigation";

import AboutScreen from "./screens/AboutScreen";
import EventDetailScreen from "./screens/EventDetailScreen";
import EventListScreen from "./screens/EventListScreen";
import LoginScreen from "./screens/LoginScreen";
import MembershipScreen from "./screens/MembershipScreen";
import UserRegisterScreen from "./screens/UserRegisterScreen";


/* Navigation */
const tabBarRoutes = {
    Membership: { screen: MembershipScreen },
    EventList: { screen: EventListScreen },
    About: { screen: AboutScreen },
};

const tabBarOptions = {
    tabBarPosition: 'bottom',
    tabBarOptions: {
        style: {
            ...Platform.select({
                android: {
                    backgroundColor: "#fff",
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: 'rgba(0, 0, 0, 0.1)'
                }
            })
        },
        indicatorStyle: {
            backgroundColor: "#f58220"
        },
        activeTintColor: '#f58220',
        inactiveTintColor: '#333333',
        showIcon: true,
        labelStyle: {
            fontSize: 10,
            marginBottom: 0,
            ...Platform.select({
               android: {
                   fontWeight: 'bold',
               }
            }),
        },
    }
};

const tabNav = TabNavigator(tabBarRoutes, tabBarOptions);

const DuskenContainer = StackNavigator({
    Root: { screen: tabNav },
    Login: { screen: LoginScreen },
    UserRegister: { screen: UserRegisterScreen },
    EventDetail: { screen: EventDetailScreen },
});

export default connect()(DuskenContainer);