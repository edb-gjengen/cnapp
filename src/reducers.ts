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
  DELETE_USER_REQUEST,
  DELETE_USER_FAILURE,
  DELETE_USER_SUCCESS,
} from './actions';
import type { UserType } from './types/data';

interface RootState {
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  isFetchingUserData: boolean;
  isRegisteringUser: boolean;
  isDeletingUser: boolean;
  userToken: string | null;
  user: UserType | null;
  loginError: Record<string, string> | null;
  userError: Record<string, string> | null;
  registerError: Record<string, string> | null;
  deleteUserError: Record<string, string> | null;
}

const initialState: RootState = {
  isAuthenticated: false,
  isLoggingIn: false,
  isFetchingUserData: false,
  isRegisteringUser: false,
  isDeletingUser: false,
  userToken: null,
  user: null,
  loginError: null,
  userError: null,
  registerError: null,
  deleteUserError: null,
};

// FIXME: refactor using redux slices

export default function appReducers(state = initialState, action: any) {
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
      return { ...state, isRegisteringUser: false, registerError: action.registerError };

    case REGISTER_USER_SUCCESS:
      const userData = action.data;

      const token = action.data.auth_token;
      delete userData.auth_token;

      return { ...state, isRegisteringUser: false, isAuthenticated: true, user: userData, userToken: token };

    /* Delete user */
    case DELETE_USER_REQUEST:
      return { ...state, isDeletingUser: true, deleteUserError: null };

    case DELETE_USER_FAILURE:
      return { ...state, isDeletingUser: false, deleteUserError: action.deleteUserError };

    case DELETE_USER_SUCCESS:
      return initialState;

    default:
      return state;
  }
}
