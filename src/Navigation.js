import React from 'react';
// import { Platform, StyleSheet } from 'react-native';
// import { createBottomTabNavigator, getActiveChildNavigationOptions } from 'react-navigation';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import EventListScreen from './screens/EventListScreen';
// import AboutScreen from './screens/AboutScreen';
// import EventDetailScreen from './screens/EventDetailScreen';
import LoginScreen from './screens/LoginScreen';
// import MembershipScreen from './screens/MembershipScreen';
// import UserRegisterScreen from './screens/UserRegisterScreen';

// const tabBarRoutes = {
//   EventList: EventListScreen,
//   Membership: MembershipScreen,
//   About: AboutScreen,
// };

// const tabBarOptions = {
//   tabBarPosition: 'bottom',
//   tabBarOptions: {
//     style: {
//       ...Platform.select({
//         android: {
//           backgroundColor: '#fff',
//           borderTopWidth: StyleSheet.hairlineWidth,
//           borderTopColor: 'rgba(0, 0, 0, 0.2)',
//         },
//       }),
//     },
//     indicatorStyle: {
//       backgroundColor: '#f58220',
//     },
//     activeTintColor: '#f58220',
//     inactiveTintColor: '#333333',
//     labelStyle: {
//       fontSize: 12,
//       ...Platform.select({
//         android: {
//           marginBottom: 4,
//         },
//         ios: {
//           marginBottom: 0,
//         },
//       }),
//     },
//   },
//   navigationOptions: ({ navigation, screenProps }) => ({
//     // get header title from active child screen
//     ...getActiveChildNavigationOptions(navigation, screenProps),
//     headerStyle: {
//       backgroundColor: '#f58220',
//     },
//     headerTitleStyle: {
//       color: 'white',
//     },
//     headerTintColor: 'white',
//   }),
// };

// const tabNav = createBottomTabNavigator(tabBarRoutes, tabBarOptions);
// const DuskenNavigation = createStackNavigator(
//   {
//     Root: tabNav,
//     Login: LoginScreen,
//     UserRegister: UserRegisterScreen,
//     EventDetail: EventDetailScreen,
//   },
//   {
//     defaultNavigationOptions: {
//       headerStyle: {
//         backgroundColor: '#f58220',
//       },
//       headerTitleStyle: {
//         color: 'white',
//       },
//       headerTintColor: 'white',
//     },
//   }
// );
const Stack = createNativeStackNavigator();

const DuskenNavigation = () => (
  <NavigationContainer>
    <Stack.Navigator>
      {/* <Stack.Screen name="About" component={AboutScreen} /> */}
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="EventList" component={EventListScreen} /> */}
    </Stack.Navigator>
  </NavigationContainer>
);
export default DuskenNavigation;
