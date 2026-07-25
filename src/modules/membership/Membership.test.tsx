import { gql } from '@apollo/client';
import React from 'react';

import Membership from 'src/modules/membership/Membership';
import { renderWithProviders, testUser } from 'src/testUtils';

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
