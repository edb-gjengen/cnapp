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
} from './actions';
import type { UserRegisterFormValues } from './modules/register/useUserRegister';
import { AppDispatch } from './reduxStore';
import { fetchWithTimeout } from './utils';

export function requestLogin(username: string, password: string) {
  return (dispatch: AppDispatch) => {
    // We are now logging in
    dispatch(loginRequest());

    return fetchWithTimeout(`${process.env.EXPO_PUBLIC_DUSKEN_API_URL}/auth/obtain-token/`, {
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
        },
      );
  };
}

export function requestUserData(authToken: string) {
  return (dispatch: AppDispatch) => {
    // We are now fetching user data
    dispatch(userDataRequest());

    return fetchWithTimeout(`${process.env.EXPO_PUBLIC_DUSKEN_API_URL}/api/me/`, {
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
        },
      );
  };
}

// We use snake_case in order to fetch and display field errors from the API without any additional formatting
export function requestRegisterUser({ first_name, last_name, email, phone_number, password }: UserRegisterFormValues) {
  return (dispatch: AppDispatch) => {
    dispatch(registerUserRequest());

    return fetchWithTimeout(`${process.env.EXPO_PUBLIC_DUSKEN_API_URL}/api/user/register/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        email,
        phone_number: phone_number,
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
        },
      );
  };
}

/** Create a stripe payment sheet. Note that this is not using redux */
export async function requestStripePaymentSheet(authToken: string, membershipType: string) {
  const body = JSON.stringify({
    membership_type: membershipType,
  });
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Token ${authToken}`,
  };
  return fetchWithTimeout(`${process.env.EXPO_PUBLIC_DUSKEN_API_URL}/api/stripe/payment-sheet/`, {
    method: 'POST',
    headers,
    body,
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
        return data;
      },
      (data) => {
        return data.detail || 'Kunne ikke belaste bankkortet, prøv igjen';
      },
    );
}
