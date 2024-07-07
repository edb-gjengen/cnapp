import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  USER_DATA_REQUEST,
  USER_DATA_SUCCESS,
  USER_DATA_FAILURE,
  REGISTER_USER_REQUEST,
  REGISTER_USER_FAILURE,
  REGISTER_USER_SUCCESS,
} from './actions';
import type { UserType } from './types/data';
import { snakeToCamelCase } from './utils';

interface RootState {
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  isFetchingUserData: boolean;
  isRegisteringUser: boolean;
  userToken: string | null;
  user: UserType | null;
  loginError: Record<string, string> | null;
  userError: Record<string, string> | null;
  registerError: Record<string, string> | null;
}

const initialState: RootState = {
  isAuthenticated: false,
  isLoggingIn: false,
  isFetchingUserData: false,
  isRegisteringUser: false,
  userToken: null,
  user: null,
  loginError: null,
  userError: null,
  registerError: null,
};

function formatErrors(errs: Record<string, string | string[]>) {
  const errors: Record<string, string> = {};
  Object.entries(errs).forEach(([key, value]) => {
    errors[snakeToCamelCase(key)] = Array.isArray(value) ? value.join('\n') : value;
  });
  return errors;
}

// FIXME: refactor using redux slices
// eslint-disable-next-line @typescript-eslint/default-param-last, @typescript-eslint/no-explicit-any
export default function duskenApp(state = initialState, action: any) {
  switch (action.type) {
    /* Login */
    case LOGIN_REQUEST:
      return { ...state, isLoggingIn: true, loginError: null };

    case LOGIN_FAILURE:
      return { ...state, isLoggingIn: false, loginError: action.loginError };

    case LOGIN_SUCCESS:
      return { ...state, isLoggingIn: false, isAuthenticated: true, userToken: action.token };

    case LOGOUT:
      return initialState;

    /* User data */
    case USER_DATA_REQUEST:
      return { ...state, isFetchingUserData: true, userError: null };

    case USER_DATA_FAILURE:
      return { ...state, isFetchingUserData: false, userError: action.userError };

    case USER_DATA_SUCCESS:
      return { ...state, isFetchingUserData: false, user: action.data };

    /* Register user */
    case REGISTER_USER_REQUEST:
      return { ...state, isRegisteringUser: true, registerError: null };

    case REGISTER_USER_FAILURE:
      return { ...state, isRegisteringUser: false, registerError: formatErrors(action.registerError) };

    case REGISTER_USER_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const userData = action.data;
      // eslint-disable-next-line no-case-declarations
      const token = action.data.auth_token;
      delete userData.auth_token;

      return { ...state, isRegisteringUser: false, isAuthenticated: true, user: userData, userToken: token };

    default:
      return state;
  }
}
