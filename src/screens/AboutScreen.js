import React from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { StyleProvider } from 'native-base';

import AboutContainer from '../modules/about/AboutContainer';
import getTheme from '../../native-base-theme/components';

const AboutScreen = () => (
  <StyleProvider style={getTheme()}>
    <AboutContainer />
  </StyleProvider>
);

const TabBarIcon = ({ tintColor }) => <Icon name="info" size={16} color={tintColor} style={{ marginTop: 5 }} />;

AboutScreen.navigationOptions = {
  title: 'Om oss',
  tabBarIcon: TabBarIcon,
};

export default AboutScreen;
