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
const MEMBERSHIP_CHARGE_REQUEST = 'MEMBERSHIP_CHARGE_REQUEST';
const MEMBERSHIP_CHARGE_SUCCESS = 'MEMBERSHIP_CHARGE_SUCCESS';
const MEMBERSHIP_CHARGE_FAILURE = 'MEMBERSHIP_CHARGE_FAILURE';

function loginRequest() {
  return {
    type: LOGIN_REQUEST,
  };
}

function loginSuccess(username, token) {
  return {
    type: LOGIN_SUCCESS,
    username,
    token,
  };
}

function loginFailure(loginError) {
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

function userDataSuccess(data) {
  return {
    type: USER_DATA_SUCCESS,
    data,
  };
}

function userDataFailure(userError) {
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

function registerUserSuccess(data) {
  return {
    type: REGISTER_USER_SUCCESS,
    data,
  };
}

function registerUserFailure(registerError) {
  return {
    type: REGISTER_USER_FAILURE,
    registerError,
  };
}
function membershipChargeRequest() {
  return {
    type: MEMBERSHIP_CHARGE_REQUEST,
  };
}

function membershipChargeSuccess(data) {
  return {
    type: MEMBERSHIP_CHARGE_SUCCESS,
    data,
  };
}

function membershipChargeFailure(chargeError) {
  return {
    type: MEMBERSHIP_CHARGE_FAILURE,
    chargeError,
  };
}

export {
  LOGIN_REQUEST,
  loginRequest,
  LOGIN_SUCCESS,
  loginSuccess,
  LOGIN_FAILURE,
  loginFailure,
  LOGOUT,
  logout,
  USER_DATA_REQUEST,
  userDataRequest,
  USER_DATA_SUCCESS,
  userDataSuccess,
  USER_DATA_FAILURE,
  userDataFailure,
  REGISTER_USER_REQUEST,
  registerUserRequest,
  REGISTER_USER_SUCCESS,
  registerUserSuccess,
  REGISTER_USER_FAILURE,
  registerUserFailure,
  MEMBERSHIP_CHARGE_REQUEST,
  membershipChargeRequest,
  MEMBERSHIP_CHARGE_SUCCESS,
  membershipChargeSuccess,
  MEMBERSHIP_CHARGE_FAILURE,
  membershipChargeFailure,
};
