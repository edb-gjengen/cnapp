import { ApiError } from '@/errors';
import type { EventType, MembershipTypeOption, UserType } from '@/types/data';
import type { UserRegisterFormValues } from '@/types/forms';
import { fetchWithTimeout } from '@/utils';

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

const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

// Throws ApiError with the DRF body on non-ok responses; network/timeout
// failures reject with the raw Error
async function requestJson(url: string, options: RequestInit, fallback: string) {
  const response = await fetchWithTimeout(url, options);
  const json = await response.json();
  if (!response.ok) {
    throw new ApiError(json ?? { non_field_errors: [fallback] }, response.status);
  }
  return json;
}

export async function login(username: string, password: string): Promise<{ token: string }> {
  if (__DEV__ && username in DEV_FAKE_USERS) {
    return { token: DEV_FAKE_TOKEN_PREFIX + username };
  }
  return requestJson(
    `${process.env.EXPO_PUBLIC_DUSKEN_API_URL}/auth/obtain-token/`,
    { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ username, password }) },
    'Kunne ikke logge inn, prøv igjen',
  );
}

export async function fetchUserData(authToken: string): Promise<UserType> {
  if (__DEV__ && authToken.startsWith(DEV_FAKE_TOKEN_PREFIX)) {
    const fakeUser = DEV_FAKE_USERS[authToken.slice(DEV_FAKE_TOKEN_PREFIX.length)];
    if (fakeUser) {
      return fakeUser;
    }
  }
  return requestJson(
    `${process.env.EXPO_PUBLIC_DUSKEN_API_URL}/api/me/`,
    { method: 'GET', headers: { ...JSON_HEADERS, Authorization: `Token ${authToken}` } },
    'Kunne ikke hente brukerdata',
  );
}

// snake_case so field errors from the API map straight onto form fields
export async function registerUser({
  first_name,
  last_name,
  email,
  phone_number,
  password,
}: UserRegisterFormValues): Promise<{ user: UserType; token: string }> {
  const json = await requestJson(
    `${process.env.EXPO_PUBLIC_DUSKEN_API_URL}/api/user/register/`,
    {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ first_name, last_name, email, phone_number, password }),
    },
    'Kunne ikke registrere bruker, prøv igjen',
  );
  // The response is the user with its auth_token riding along; keep them apart
  const { auth_token: token, ...user } = json;
  return { user, token };
}

export async function deleteUser(authToken: string): Promise<void> {
  const response = await fetchWithTimeout(`${process.env.EXPO_PUBLIC_DUSKEN_API_URL}/api/me/delete/`, {
    method: 'DELETE',
    headers: { ...JSON_HEADERS, Authorization: `Token ${authToken}` },
  });
  if (!response.ok) {
    const json = await response.json();
    throw new ApiError(json ?? { non_field_errors: ['Kunne ikke slette bruker, prøv igjen'] }, response.status);
  }
}

export async function fetchEvents(): Promise<EventType[]> {
  const response = await fetchWithTimeout(`${process.env.EXPO_PUBLIC_EVENT_API_URL}?view=compact-app`);
  const { events, error } = await response.json();
  if (error || !events) {
    throw new Error('Kunne ikke hente programmet');
  }
  return events;
}

export async function fetchMembershipTypes(): Promise<MembershipTypeOption[]> {
  const response = await fetchWithTimeout(`${process.env.EXPO_PUBLIC_DUSKEN_API_URL}/api/graphql/`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ query: '{ membershipTypes { slug price } }' }),
  });
  const json = await response.json();
  const membershipTypes = response.ok ? json?.data?.membershipTypes : null;
  if (!membershipTypes) {
    throw new Error('Kunne ikke hente priser');
  }
  return membershipTypes;
}

/** Create a stripe payment sheet; rejects with a message for the failure toast. */
export async function requestStripePaymentSheet(authToken: string, membershipType: string) {
  const response = await fetchWithTimeout(`${process.env.EXPO_PUBLIC_DUSKEN_API_URL}/api/stripe/payment-sheet/`, {
    method: 'POST',
    headers: { ...JSON_HEADERS, Authorization: `Token ${authToken}` },
    body: JSON.stringify({ membership_type: membershipType }),
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.detail || 'Kunne ikke belaste bankkortet, prøv igjen');
  }
  return json;
}
