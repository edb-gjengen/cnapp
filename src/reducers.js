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
  MEMBERSHIP_CHARGE_REQUEST,
  MEMBERSHIP_CHARGE_FAILURE,
  MEMBERSHIP_CHARGE_SUCCESS,
} from './actions';

import { snakeToCamelCase } from './utils';

const initialState = {
  isAuthenticated: false,
  isLoggingIn: false,
  isFetchingUserData: false,
  isRegisteringUser: false,
  isChargingMembership: false,
  userToken: null,
  user: null,
  loginError: null,
  userError: null,
  registerError: null,
  chargeError: null,
  lastOrder: null,
};

function formatErrors(errs) {
  const _errs = {};
  Object.entries(errs).forEach(([key, value]) => {
    _errs[snakeToCamelCase(key)] = Array.isArray(value) ? value.join('\n') : value;
  });
  return _errs;
}

export default function duskenApp(state = initialState, action) {
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

    /* User data */
    case MEMBERSHIP_CHARGE_REQUEST:
      return { ...state, isChargingMembership: true, chargeError: null };

    case MEMBERSHIP_CHARGE_FAILURE:
      return { ...state, isChargingMembership: false, chargeError: action.chargeError };

    case MEMBERSHIP_CHARGE_SUCCESS:
      return { ...state, isChargingMembership: false, lastOrder: action.data };

    default:
      return state;
  }
}
