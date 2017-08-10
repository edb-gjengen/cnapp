import React from 'react';
import {connect} from "react-redux";
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

const tabNav = TabNavigator(tabBarRoutes, {tabBarPosition: 'bottom'});

const DuskenContainer = StackNavigator({
    Root: { screen: tabNav },
    Login: { screen: LoginScreen },
    EventDetails: { screen: EventDetailsScreen },
});

export default connect()(DuskenContainer);