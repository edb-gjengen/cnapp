import React from 'react';

import Navigation from './Navigation';
import { useLogoutUsersWithNoToken } from './hooks';

const AppInner = () => {
  useLogoutUsersWithNoToken();

  return <Navigation />;
};

export default AppInner;
