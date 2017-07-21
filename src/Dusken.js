import React from 'react';
import {connect} from "react-redux";
import {TabNavigator, StackNavigator} from "react-navigation";

import EventsScreen from "./screens/EventScreen";
import AboutScreen from "./screens/AboutScreen";
import MembershipScreen from "./screens/MembershipScreen";


const tabBarRoutes = {
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
    Root: { screen: tabNav},
});

export default connect()(DuskenContainer);