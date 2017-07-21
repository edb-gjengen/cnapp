import React from 'react';
import {connect} from "react-redux";
import {TabNavigator, StackNavigator} from "react-navigation";

import EventsScreen from "./screens/EventScreen";
import AboutScreen from "./screens/AboutScreen";
import MembershipScreen from "./screens/MembershipScreen";


const routeConfig = {
    Events: { screen: EventsScreen },
    Membership: { screen: MembershipScreen },
    About: { screen: AboutScreen },
};

const tabConfig = {
    tabBarPosition: 'bottom'
};

/* Navigation */
const tabNav = TabNavigator(routeConfig, tabConfig);

const DuskenContainer = StackNavigator({
    Root: { screen: tabNav},
});

export default connect()(DuskenContainer);