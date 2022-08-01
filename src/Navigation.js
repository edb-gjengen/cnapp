import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import EventList from './modules/events/EventList';
import EventDetail from './modules/events/EventDetail';

import Membership from './modules/membership/Membership';
import Login from './modules/login/Login';
import About from './modules/about/About';
import UserRegister from './modules/register/UserRegister';

const EventStack = createNativeStackNavigator();
const EventStackScreen = () => (
  <EventStack.Navigator initialRouteName="EventList">
    <EventStack.Screen
      name="EventList"
      component={EventList}
      options={{
        title: 'Program',
      }}
    />
    <EventStack.Screen
      name="EventDetail"
      component={EventDetail}
      options={({ route }) => ({ title: route.params.event.title.decoded })}
    />
  </EventStack.Navigator>
);

const UserStack = createNativeStackNavigator();
const UserStackScreen = () => (
  <UserStack.Navigator initialRouteName="Membership">
    <UserStack.Screen name="Membership" component={Membership} options={{ title: 'Medlemskap' }} />
    <UserStack.Screen name="Login" component={Login} options={{ title: 'Logg inn' }} />
    <UserStack.Screen
      name="UserRegister"
      component={UserRegister}
      options={{
        title: 'Bli medlem',
      }}
    />
  </UserStack.Navigator>
);

const HomeTabs = createBottomTabNavigator();
const Navigation = () => (
  <NavigationContainer>
    <HomeTabs.Navigator initialRouteName="EventStack">
      <HomeTabs.Screen
        name="EventStack"
        component={EventStackScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Program',
          tabBarIcon: ({ color, size }) => <Icon name="event" size={size} color={color} style={{ marginTop: 5 }} />,
        }}
      />
      <HomeTabs.Screen
        name="UserStack"
        component={UserStackScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Medlemskap',
          tabBarIcon: ({ color, size }) => <Icon name="user" size={size} color={color} style={{ marginTop: 5 }} />,
        }}
      />
      <HomeTabs.Screen
        name="About"
        component={About}
        options={{
          title: 'Om oss',
          tabBarIcon: ({ color, size }) => <Icon name="info" size={size} color={color} style={{ marginTop: 5 }} />,
        }}
      />
    </HomeTabs.Navigator>
  </NavigationContainer>
);
export default Navigation;
