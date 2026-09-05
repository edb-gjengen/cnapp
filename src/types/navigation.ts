import { NavigatorScreenParams } from '@react-navigation/native';

import { EventType } from './data';

export type EventStackParamList = {
  EventList: undefined;
  EventDetail: { event: EventType };
};

export type UserStackParamList = {
  Membership: undefined;
  Login: undefined;
  UserRegister: undefined;
  UserDelete: undefined;
  UserSettings: undefined;
};

export type HomeTabParamList = {
  About: undefined;
  EventStack: NavigatorScreenParams<EventStackParamList>;
  UserStack: NavigatorScreenParams<UserStackParamList>;
};

declare global {
  namespace ReactNavigation {
    // https://reactnavigation.org/docs/typescript/#specifying-default-types-for-usenavigation-link-ref-etc
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends HomeTabParamList {}
  }
}
