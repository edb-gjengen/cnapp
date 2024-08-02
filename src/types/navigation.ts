import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { EventType } from './data';

export type EventStackParamList = {
  EventList: undefined;
  EventDetail: { event: EventType };
};

export type EventDetailProps = NativeStackScreenProps<EventStackParamList, 'EventDetail'>;

export type UserStackParamList = {
  Membership: undefined;
  Login: undefined;
  UserRegister: undefined;
  UserDelete: undefined;
};

export type HomeTabParamList = {
  About: undefined;
  EventStack: NavigatorScreenParams<EventStackParamList>;
  UserStack: NavigatorScreenParams<UserStackParamList>;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends HomeTabParamList {}
  }
}
