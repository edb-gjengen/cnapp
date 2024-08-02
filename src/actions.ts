import { UserType } from './types/data';

const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';
const USER_DATA_REQUEST = 'USER_DATA_REQUEST';
const USER_DATA_SUCCESS = 'USER_DATA_SUCCESS';
const USER_DATA_FAILURE = 'USER_DATA_FAILURE';
const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';
const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';
const DELETE_USER_REQUEST = 'DELETE_USER_REQUEST';
const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';

function loginRequest() {
  return {
    type: LOGIN_REQUEST,
  };
}

function loginSuccess(username: string, token: string) {
  return {
    type: LOGIN_SUCCESS,
    username,
    token,
  };
}

function loginFailure(loginError: string) {
  return {
    type: LOGIN_FAILURE,
    loginError,
  };
}

function logout() {
  return {
    type: LOGOUT,
  };
}

function userDataRequest() {
  return {
    type: USER_DATA_REQUEST,
  };
}

function userDataSuccess(data: UserType) {
  return {
    type: USER_DATA_SUCCESS,
    data,
  };
}

function userDataFailure(userError: string) {
  return {
    type: USER_DATA_FAILURE,
    userError,
  };
}

function registerUserRequest() {
  return {
    type: REGISTER_USER_REQUEST,
  };
}

function registerUserSuccess(data: UserType) {
  return {
    type: REGISTER_USER_SUCCESS,
    data,
  };
}

function registerUserFailure(registerError: Record<string, string>) {
  return {
    type: REGISTER_USER_FAILURE,
    registerError,
  };
}

function deleteUserRequest() {
  return {
    type: DELETE_USER_REQUEST,
  };
}

function deleteUserSuccess() {
  return {
    type: DELETE_USER_SUCCESS,
  };
}

function deleteUserFailure(deleteUserError: Record<string, string>) {
  return {
    type: DELETE_USER_FAILURE,
    deleteUserError,
  };
}

export {
  /* Login */
  LOGIN_REQUEST,
  loginRequest,
  LOGIN_SUCCESS,
  loginSuccess,
  LOGIN_FAILURE,
  loginFailure,
  /* Logout */
  LOGOUT,
  logout,
  /* User data */
  USER_DATA_REQUEST,
  userDataRequest,
  USER_DATA_SUCCESS,
  userDataSuccess,
  USER_DATA_FAILURE,
  userDataFailure,
  /* Register */
  REGISTER_USER_REQUEST,
  registerUserRequest,
  REGISTER_USER_SUCCESS,
  registerUserSuccess,
  REGISTER_USER_FAILURE,
  registerUserFailure,
  /* Delete */
  DELETE_USER_REQUEST,
  deleteUserRequest,
  DELETE_USER_SUCCESS,
  deleteUserSuccess,
  DELETE_USER_FAILURE,
  deleteUserFailure,
};
