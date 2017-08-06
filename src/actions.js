const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';
const USER_DATA_REQUEST = 'USER_DATA_REQUEST';
const USER_DATA_SUCCESS = 'USER_DATA_SUCCESS';
const USER_DATA_FAILURE = 'USER_DATA_FAILURE';

function loginRequest() {
  return {
    type: LOGIN_REQUEST
  }
}

function loginSuccess(username, token) {
  return {
    type: LOGIN_SUCCESS,
    username,
    token
  }
}

function loginFailure(errorMessage) {
  return {
    type: LOGIN_FAILURE,
    errorMessage
  }
}

function logout() {
  return {
    type: LOGOUT
  }
}

function userDataRequest() {
  return {
    type: USER_DATA_REQUEST
  }
}

function userDataSuccess(data) {
  return {
    type: USER_DATA_SUCCESS,
    data
  }
}

function userDataFailure(errorMessage) {
  return {
    type: USER_DATA_FAILURE,
    errorMessage
  }
}

export {
  LOGIN_REQUEST, loginRequest,
  LOGIN_SUCCESS, loginSuccess,
  LOGIN_FAILURE, loginFailure,
  LOGOUT, logout,
  USER_DATA_REQUEST, userDataRequest,
  USER_DATA_SUCCESS, userDataSuccess,
  USER_DATA_FAILURE, userDataFailure,
};

export function requestLogin(username, password) {
  return (dispatch) => {
    // We are now logging in
    dispatch(loginRequest())

    return fetch('http://10.0.0.10:3000/auth/obtain-token/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      	'username': username,
      	'password': password
      })
    })
    .then(response => response.json().then(json => ({ json, response })))
    .then(({json, response}) => {
      if (response.ok === false) {
        return Promise.reject(json)
      }
      return json
    })
    .then(
      data => {
        dispatch(loginSuccess(username, data.token))
      },
      data => {
      	dispatch(loginFailure(data.error || 'Log in failed'))
      }
    )
  }
}

export function requestUserData(token) {
  return (dispatch) => {
    // We are now fetching user data
    dispatch(userDataRequest())

    return fetch('http://10.0.0.10:3000/api/me/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      }
    })
    .then(response => response.json().then(json => ({ json, response })))
    .then(({json, response}) => {
      if (response.ok === false) {
        return Promise.reject(json)
      }
      return json
    })
    .then(
      data => {
        dispatch(userDataSuccess(data))
      },
      data => {
      	dispatch(userDataFailure('Det funka ikke :-('))
      }
    )
  }
}
