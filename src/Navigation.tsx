import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import About from '@/modules/about/About';
import EventList from '@/modules/events/EventList';
import Login from '@/modules/login/Login';
import Membership from '@/modules/membership/Membership';
import UserDelete from '@/modules/membership/UserDelete';
import UserRegister from '@/modules/register/UserRegister';
import theme from '@/theme';
import type { EventStackParamList, HomeTabParamList, UserStackParamList } from '@/types/navigation';
import IconEvent from '@assets/icons/event.svg';
import IconInfo from '@assets/icons/information-circle.svg';
import IconPerson from '@assets/icons/person.svg';

// This looks ugly, even though it's a recommended style from the branding profile.
// TODO: Change this
// also TODO: make sure battery indicator etc. is visible
const defaultNavigationStyle = {
  headerTintColor: theme.colors.neufWhite,
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: theme.colors.neufBlue,
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
const EventIcon: TabBarIconType = ({ color, size }) => <IconEvent width={size} height={size} fill={color} />;
const UserIcon: TabBarIconType = ({ color, size }) => <IconPerson width={size + 8} height={size + 8} fill={color} />;
const AboutIcon: TabBarIconType = ({ color, size }) => <IconInfo width={size} height={size} fill={color} />;
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
