import { SimpleLineIcons as Icon } from '@expo/vector-icons';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import About from 'src/modules/about/About';
import EventDetail from 'src/modules/events/EventDetail';
import EventList from 'src/modules/events/EventList';
import Login from 'src/modules/login/Login';
import Membership from 'src/modules/membership/Membership';
import UserDelete from 'src/modules/membership/UserDelete';
import UserRegister from 'src/modules/register/UserRegister';
import theme from 'src/theme';
import type { EventStackParamList, HomeTabParamList, UserStackParamList } from 'src/types/navigation';

// This looks ugly, even though it's a recommended style from the branding profile.
// TODO: Change this
// also TODO: make sure battery indicator etc. is visible
const defaultNavigationStyle = {
  headerTintColor: theme.colors.neufWhite,
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: theme.colors.neufOrange,
  },
} as const;

const EventStack = createNativeStackNavigator<EventStackParamList>();
const EventStackScreen = () => (
  <EventStack.Navigator initialRouteName="EventList" screenOptions={{ ...defaultNavigationStyle }}>
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
      options={({ route }) => ({
        // TODO: make this not suck
        title:
          route.params.event.title.decoded.length < 40
            ? route.params.event.title.decoded
            : route.params.event.title.decoded.substring(0, 30) + '...',
      })}
    />
  </EventStack.Navigator>
);

const UserStack = createNativeStackNavigator<UserStackParamList>();
const UserStackScreen = () => (
  <UserStack.Navigator initialRouteName="Membership" screenOptions={{ ...defaultNavigationStyle }}>
    <UserStack.Screen name="Membership" component={Membership} options={{ title: 'Medlemskap' }} />
    <UserStack.Screen name="Login" component={Login} options={{ title: 'Logg inn' }} />
    <UserStack.Screen
      name="UserRegister"
      component={UserRegister}
      options={{
        title: 'Bli medlem',
      }}
    />
    <UserStack.Screen
      name="UserDelete"
      component={UserDelete}
      options={{
        title: 'Slett bruker',
      }}
    />
  </UserStack.Navigator>
);

type TabBarIconType = BottomTabNavigationOptions['tabBarIcon'];

const HomeTabs = createBottomTabNavigator<HomeTabParamList>();
const EventIcon: TabBarIconType = ({ color, size }) => (
  <Icon name="event" size={size} color={color} style={{ marginTop: 5 }} />
);
const UserIcon: TabBarIconType = ({ color, size }) => (
  <Icon name="user" size={size} color={color} style={{ marginTop: 5 }} />
);
const AboutIcon: TabBarIconType = ({ color, size }) => (
  <Icon name="info" size={size} color={color} style={{ marginTop: 5 }} />
);
const Navigation = () => (
  <NavigationContainer>
    <HomeTabs.Navigator initialRouteName="EventStack">
      <HomeTabs.Screen
        name="EventStack"
        component={EventStackScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Program',
          tabBarIcon: EventIcon,
        }}
      />
      <HomeTabs.Screen
        name="UserStack"
        component={UserStackScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Medlemskap',
          tabBarIcon: UserIcon,
        }}
      />
      <HomeTabs.Screen
        name="About"
        component={About}
        options={{
          title: 'Om oss',
          tabBarLabel: 'Om oss',
          tabBarIcon: AboutIcon,
          ...defaultNavigationStyle,
        }}
      />
    </HomeTabs.Navigator>
  </NavigationContainer>
);
export default Navigation;
