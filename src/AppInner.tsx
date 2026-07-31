import React from 'react';

import Navigation from './Navigation';
import { useAppStateFocusManager } from './hooks';

const AppInner = () => {
  useAppStateFocusManager();

  return <Navigation />;
};

export default AppInner;
