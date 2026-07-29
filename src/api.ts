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
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserRequest,
} from './actions';
import type { UserRegisterFormValues } from './modules/register/useUserRegister';
import { AppDispatch } from './reduxStore';
import type { UserType } from './types/data';
import { fetchWithTimeout } from './utils';

// Dev builds only (stripped from release builds via __DEV__): log in with one of
// these usernames and any password to get a fake user, for previewing membership
// screens without a real account in each state.
const DEV_FAKE_TOKEN_PREFIX = 'dev-fake-token:';
const DEV_FAKE_USERS: Record<string, UserType> = {
  nonmember: {
    username: 'nonmember',
    email: 'nonmember@example.test',
    first_name: 'Ikke',
    last_name: 'Medlem',
    is_member: false,
    is_volunteer: false,
    last_membership: null,
  },
  member: {
    username: 'member',
    email: 'member@example.test',
    first_name: 'Gyldig',
    last_name: 'Medlem',
    is_member: true,
    is_volunteer: false,
    last_membership: {
      membership_type: 'standard',
      // Far future, so useProof's expired-membership check doesn't refetch in a loop
      end_date: '2099-08-01',
    },
  },
};

export function requestLogin(username: string, password: string) {
  return (dispatch: AppDispatch) => {
    if (__DEV__ && username in DEV_FAKE_USERS) {
      dispatch(loginSuccess(username, DEV_FAKE_TOKEN_PREFIX + username));
      return Promise.resolve();
    }

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
    if (__DEV__ && authToken.startsWith(DEV_FAKE_TOKEN_PREFIX)) {
      const fakeUser = DEV_FAKE_USERS[authToken.slice(DEV_FAKE_TOKEN_PREFIX.length)];
      if (fakeUser) {
        dispatch(userDataSuccess(fakeUser));
        return Promise.resolve();
      }
    }

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
        first_name,
        last_name,
        email,
        phone_number,
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

export function requestDeleteUser(authToken: string) {
  return (dispatch: AppDispatch) => {
    dispatch(deleteUserRequest());

    return fetchWithTimeout(`${process.env.EXPO_PUBLIC_DUSKEN_API_URL}/api/me/delete/`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${authToken}`,
      },
    }).then((response) => {
      if (!response.ok) {
        return response.json().then((json) => {
          dispatch(deleteUserFailure(json || { non_field_errors: ['Kunne ikke slette bruker, prøv igjen'] }));
        });
      }
      dispatch(deleteUserSuccess());
      return {};
    });
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
        throw new Error(data?.detail || 'Kunne ikke belaste bankkortet, prøv igjen');
      },
    );
}
