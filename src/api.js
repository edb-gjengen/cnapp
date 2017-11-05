import Config from 'react-native-config';

import {
    loginFailure, loginRequest, loginSuccess,
    registerUserFailure, registerUserRequest, registerUserSuccess,
    userDataFailure, userDataRequest, userDataSuccess,
    membershipChargeFailure, membershipChargeRequest, membershipChargeSuccess,
} from "./actions";

export function requestLogin(username, password) {
    return (dispatch) => {
        // We are now logging in
        dispatch(loginRequest());

        return fetch(`${Config.DUSKEN_API_URL}/auth/obtain-token/`, {
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

export function requestUserData(auth_token) {
    return (dispatch) => {
        // We are now fetching user data
        dispatch(userDataRequest());

        return fetch(`${Config.DUSKEN_API_URL}/api/me/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`
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

export function requestRegisterUser(firstName, lastName, email, phoneNumber, password) {
    return (dispatch) => {
        dispatch(registerUserRequest());

        return fetch(`${Config.DUSKEN_API_URL}/api/user/register/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'first_name': firstName,
                'last_name': lastName,
                'email': email,
                'phone_number': phoneNumber,
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
                    dispatch(registerUserSuccess(data))
                },
                data => {
                    dispatch(registerUserFailure(data || {'non_field_errors': ['Kunne ikke registrere bruker, prøv igjen']}))
                }
            )
    }
}

export function requestMembershipCharge(auth_token, stripe_token, membership_type) {
    return (dispatch) => {
        dispatch(membershipChargeRequest());

        return fetch(`${Config.DUSKEN_API_URL}/api/membership/charge/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`
            },
            body: JSON.stringify({
                'stripe_token': stripe_token,
                'membership_type': membership_type,
                'payment_method': 'app',
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
                    dispatch(membershipChargeSuccess(data))
                },
                data => {
                    dispatch(membershipChargeFailure(data || {'non_field_errors': ['Kunne ikke belaste kort, prøv igjen']}))
                }
            )
    }
}


