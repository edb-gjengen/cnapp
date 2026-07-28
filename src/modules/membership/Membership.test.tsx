import { gql } from '@apollo/client';
import { fireEvent } from '@testing-library/react-native';
import React from 'react';

import Membership from '@/modules/membership/Membership';
import { renderWithProviders, testUser } from '@/testUtils';
import type { UserType } from '@/types/data';

// Must match PROOF_QUERY in useProof.tsx
const PROOF_QUERY = gql`
  {
    membershipTypes {
      slug
      price
    }
  }
`;

const apolloMocks = [
  {
    request: { query: PROOF_QUERY },
    result: {
      data: { membershipTypes: [{ __typename: 'MembershipType', slug: 'standard', price: 25000 }] },
    },
  },
];

it('shows the membership pitch when logged out', async () => {
  const { findByText } = renderWithProviders(<Membership />);

  expect(await findByText('Bli medlem')).toBeTruthy();
  expect(await findByText('Logg inn')).toBeTruthy();
});

it('lets a logged in non-member pick a membership type and shows its price', async () => {
  const nonMember: UserType = { ...testUser, is_member: false, last_membership: null };

  // Serve the non-member from the fake API so the refetch on mount does not
  // clobber the preloaded state.
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => nonMember,
  });

  const { findByText, getByText } = renderWithProviders(<Membership />, {
    preloadedState: {
      isAuthenticated: true,
      userToken: 'test-token',
      user: nonMember,
    },
    apolloMocks: [
      {
        request: { query: PROOF_QUERY },
        result: {
          data: {
            membershipTypes: [
              { __typename: 'MembershipType', slug: 'student', price: 15000 },
              { __typename: 'MembershipType', slug: 'regular', price: 30000 },
              { __typename: 'MembershipType', slug: 'support', price: 50000 },
            ],
          },
        },
      },
    ],
  });

  // All three membership types are offered
  expect(await findByText('Velg medlemskapstype')).toBeTruthy();
  expect(getByText('Student')).toBeTruthy();
  expect(getByText('Ordinær')).toBeTruthy();
  expect(getByText('Støtte')).toBeTruthy();

  // 'Ordinær' (slug: regular) is preselected, so the purchase button shows its price
  expect(await findByText('Kjøp medlemskap (300 NOK)')).toBeTruthy();

  // Selecting another type updates the price
  fireEvent.press(getByText('Student'));
  expect(await findByText('Kjøp medlemskap (150 NOK)')).toBeTruthy();

  fireEvent.press(getByText('Støtte'));
  expect(await findByText('Kjøp medlemskap (500 NOK)')).toBeTruthy();
});

it('shows the membership proof when logged in', async () => {
  // Mounting Membership with a token triggers requestUserData; serve the
  // logged in user from the fake API so the refetch does not clobber state.
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => testUser,
  });

  const { findByText } = renderWithProviders(<Membership />, {
    preloadedState: {
      isAuthenticated: true,
      userToken: 'test-token',
      user: testUser,
    },
    apolloMocks,
  });

  expect(await findByText('MEDLEM')).toBeTruthy();
  expect(await findByText('Test Testesen')).toBeTruthy();
});
