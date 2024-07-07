import { NativeBaseProvider } from 'native-base';
import React, { useEffect } from 'react';

import Navigation from './Navigation';
import { logout } from './actions';
import { useAppDispatch, useAppSelector } from './hooks';

const Dusken = () => {
  const user = useAppSelector((store) => store.user);
  const userToken = useAppSelector((store) => store.userToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // logout authenticated users without token
    if (user && !userToken) {
      dispatch(logout());
    }
  });

  return (
    <NativeBaseProvider>
      <Navigation />
    </NativeBaseProvider>
  );
};

export default Dusken;
