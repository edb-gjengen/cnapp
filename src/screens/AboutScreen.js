import React from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import AboutContainer from '../modules/about/AboutContainer';

const AboutScreen = () => <AboutContainer />;

const TabBarIcon = ({ tintColor }) => <Icon name="info" size={16} color={tintColor} style={{ marginTop: 5 }} />;

AboutScreen.navigationOptions = {
  title: 'Om oss',
  tabBarIcon: TabBarIcon,
};

export default AboutScreen;
