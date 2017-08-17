import React from 'react';
import {connect} from "react-redux";
import {Platform} from 'react-native';
import {TabNavigator, StackNavigator} from "react-navigation";

import AboutScreen from "./screens/AboutScreen";
import EventDetailsScreen from "./screens/EventDetailsScreen";
import EventListScreen from "./screens/EventListScreen";
import LoginScreen from "./screens/LoginScreen";
import MembershipScreen from "./screens/MembershipScreen";


/* Navigation */
const tabBarRoutes = {
    EventList: { screen: EventListScreen },
    Membership: { screen: MembershipScreen },
    About: { screen: AboutScreen },
};

const tabBarOptions = {
    tabBarPosition: 'bottom',
    tabBarOptions: {
        style: {
            backgroundColor: "#fff"
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
    EventDetails: { screen: EventDetailsScreen },
});

export default connect()(DuskenContainer);