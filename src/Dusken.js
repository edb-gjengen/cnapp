import React from 'react';
import {connect} from "react-redux";
import {TabNavigator, StackNavigator} from "react-navigation";

import LoginScreen from "./screens/LoginScreen";
import EventsScreen from "./screens/EventScreen";
import EventDetailsScreen from "./screens/EventDetailsScreen";
import AboutScreen from "./screens/AboutScreen";
import MembershipScreen from "./screens/MembershipScreen";
import Login from "./modules/login/Login";


const tabBarRoutes = {
    // Login: { screen: LoginScreen },
    Events: { screen: EventsScreen },
    Membership: { screen: MembershipScreen },
    About: { screen: AboutScreen },
};

const tabBarOptions = {
    tabBarPosition: 'bottom',
};

/* Navigation */
const tabNav = TabNavigator(tabBarRoutes, tabBarOptions);

const DuskenContainer = StackNavigator({
    Root: { screen: tabNav },
    Login: { screen: LoginScreen },
    EventDetails: { screen: EventDetailsScreen },
});

export default connect()(DuskenContainer);