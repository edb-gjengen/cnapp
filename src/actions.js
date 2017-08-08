import Config from 'react-native-config';

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

function loginFailure(loginError) {
    return {
        type: LOGIN_FAILURE,
        loginError
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

function userDataFailure(userError) {
    return {
        type: USER_DATA_FAILURE,
        userError
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
        dispatch(loginRequest());
        const apiURL = Config.DUSKEN_API_URL;
        return fetch(`${apiURL}/auth/obtain-token/`, {
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
                    console.log(data);
                    dispatch(loginFailure(data || {'non_field_errors': ['Kunne ikke logge inn, prøv igjen']}))
                }
            )
    }
}

export function requestUserData(token) {
    return (dispatch) => {
        // We are now fetching user data
        dispatch(userDataRequest());

        const apiURL = Config.DUSKEN_API_URL;
        return fetch(`${apiURL}/api/me/`, {
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
