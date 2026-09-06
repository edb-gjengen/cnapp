import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/AuthContext';
import TabButton from '@/components/TabButton';
import TabIcon, { PILL_SIZE } from '@/components/TabIcon';
import About from '@/modules/about/About';
import EventList from '@/modules/events/EventList';
import Login from '@/modules/login/Login';
import Membership from '@/modules/membership/Membership';
import UserDelete from '@/modules/membership/UserDelete';
import UserRegister from '@/modules/register/UserRegister';
import Settings from '@/modules/settings/Settings';
import SettingsHeaderButton from '@/modules/settings/SettingsHeaderButton';
import theme from '@/theme';
import type { EventStackParamList, HomeTabParamList, UserStackParamList } from '@/types/navigation';
import IconCalendar from '@assets/icons/calendar.svg';
import IconIdCard from '@assets/icons/id-card.svg';
import IconInfo from '@assets/icons/info.svg';

const defaultNavigationStyle = {
  headerTintColor: theme.colors.white,
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: theme.colors.chateauBlue,
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

// Scene background for screens that don't paint their own
const navigationTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: theme.background.backgroundColor },
};

type HeaderRightType = NativeStackNavigationOptions['headerRight'];
const SettingsHeaderRight: HeaderRightType = ({ tintColor }) => <SettingsHeaderButton tintColor={tintColor} />;

const UserStack = createNativeStackNavigator<UserStackParamList>();
const UserStackScreen = () => {
  const { isAuthenticated } = useAuth();

  return (
    <UserStack.Navigator initialRouteName="Membership" screenOptions={{ ...defaultNavigationStyle }}>
      <UserStack.Screen
        name="Membership"
        component={Membership}
        // Settings only make sense with an account to manage
        options={{ title: 'Medlemskap', headerRight: isAuthenticated ? SettingsHeaderRight : undefined }}
      />
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
      <UserStack.Screen name="UserSettings" component={Settings} options={{ title: 'Innstillinger' }} />
    </UserStack.Navigator>
  );
};

type TabBarIconType = BottomTabNavigationOptions['tabBarIcon'];

const HomeTabs = createBottomTabNavigator<HomeTabParamList>();
const EventIcon: TabBarIconType = (props) => <TabIcon icon={IconCalendar} {...props} />;
const UserIcon: TabBarIconType = (props) => <TabIcon icon={IconIdCard} {...props} />;
const AboutIcon: TabBarIconType = (props) => <TabIcon icon={IconInfo} {...props} />;

const tabBarOptions: BottomTabNavigationOptions = {
  tabBarActiveTintColor: theme.tabBar.activeTint,
  tabBarInactiveTintColor: theme.tabBar.inactiveTint,
  tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
  tabBarIconStyle: PILL_SIZE,
  tabBarButton: TabButton,
};

const Navigation = () => {
  const insets = useSafeAreaInsets();
  // Setting a height replaces the navigator's own inset handling, so the inset is added back here
  const tabBarStyle = {
    height: theme.tabBar.height + insets.bottom,
    backgroundColor: theme.tabBar.background,
    borderTopWidth: 0,
    elevation: 0,
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <HomeTabs.Navigator initialRouteName="EventStack" screenOptions={{ ...tabBarOptions, tabBarStyle }}>
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
};
export default Navigation;
