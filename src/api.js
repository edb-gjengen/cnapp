import Config from 'react-native-config';

import {
  loginFailure,
  loginRequest,
  loginSuccess,
  registerUserFailure,
  registerUserRequest,
  registerUserSuccess,
  userDataFailure,
  userDataRequest,
  userDataSuccess,
  membershipChargeFailure,
  membershipChargeRequest,
  membershipChargeSuccess,
} from './actions';
import { fetchWithTimeout } from './utils';

export function requestLogin(username, password) {
  return (dispatch) => {
    // We are now logging in
    dispatch(loginRequest());

    return fetchWithTimeout(`${Config.DUSKEN_API_URL}/auth/obtain-token/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => response.json().then((json) => ({ json, response })))
      .then(({ json, response }) => {
        if (response.ok === false) {
          return Promise.reject(json);
        }
        return json;
      })
      .then(
        (data) => {
          dispatch(loginSuccess(username, data.token));
        },
        (data) => {
          console.log(data);
          dispatch(loginFailure(data || { non_field_errors: ['Kunne ikke logge inn, prøv igjen'] }));
        }
      );
  };
}

export function requestUserData(authToken) {
  return (dispatch) => {
    // We are now fetching user data
    dispatch(userDataRequest());

    return fetchWithTimeout(`${Config.DUSKEN_API_URL}/api/me/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${authToken}`,
      },
    })
      .then((response) => response.json().then((json) => ({ json, response })))
      .then(({ json, response }) => {
        if (response.ok === false) {
          return Promise.reject(json);
        }
        return json;
      })
      .then(
        (data) => {
          dispatch(userDataSuccess(data));
        },
        (data) => {
          dispatch(userDataFailure(data || { non_field_errors: ['Kunne ikke hente brukerdata'] }));
        }
      );
  };
}

export function requestRegisterUser({ firstName, lastName, email, phoneNumber, password }) {
  return (dispatch) => {
    dispatch(registerUserRequest());

    return fetchWithTimeout(`${Config.DUSKEN_API_URL}/api/user/register/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        password,
      }),
    })
      .then((response) => response.json().then((json) => ({ json, response })))
      .then(({ json, response }) => {
        if (response.ok === false) {
          return Promise.reject(json);
        }
        return json;
      })
      .then(
        (data) => {
          dispatch(registerUserSuccess(data));
        },
        (data) => {
          dispatch(registerUserFailure(data || { non_field_errors: ['Kunne ikke registrere bruker, prøv igjen'] }));
        }
      );
  };
}

export function requestMembershipCharge(authToken, stripeToken, membershipType) {
  return (dispatch) => {
    dispatch(membershipChargeRequest());

    return fetchWithTimeout(`${Config.DUSKEN_API_URL}/api/membership/charge/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${authToken}`,
      },
      body: JSON.stringify({
        stripe_token: stripeToken,
        membership_type: membershipType,
        payment_method: 'app',
      }),
    })
      .then((response) => response.json().then((json) => ({ json, response })))
      .then(({ json, response }) => {
        if (response.ok === false) {
          return Promise.reject(json);
        }
        return json;
      })
      .then(
        (data) => {
          dispatch(membershipChargeSuccess(data));
        },
        (data) => {
          dispatch(membershipChargeFailure(data.detail || 'Kunne ikke belaste bankkortet, prøv igjen'));
        }
      );
  };
}
