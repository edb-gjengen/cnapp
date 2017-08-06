import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  USER_DATA_REQUEST,
  USER_DATA_SUCCESS,
  USER_DATA_FAILURE,
} from './actions';

const initialState = {
  isAuthenticated: false,
  isLoggingIn: false,
  isFetchingUserData: false,
  userToken: null,
  user: null,
};

export default function duskenApp(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isLoggingIn: true
      });

    case LOGIN_FAILURE:
      return Object.assign({}, state, {
      	isLoggingIn: false,
      	errorMessage: action.errorMessage
      });

    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
      	isLoggingIn: false,
        isAuthenticated: true,
        userToken: action.token
      });

    case LOGOUT:
      return initialState

    case USER_DATA_REQUEST:
      return Object.assign({}, state, {
        isFetchingUserData: true
      });

    case USER_DATA_FAILURE:
      return Object.assign({}, state, {
      	isFetchingUserData: false,
      	errorMessage: action.errorMessage
      });

    case USER_DATA_SUCCESS:
      return Object.assign({}, state, {
      	isFetchingUserData: false,
        user: action.data
      });

    default:
      return state
  }
}
