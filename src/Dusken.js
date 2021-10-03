import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NativeBaseProvider } from 'native-base';

import Navigation from './Navigation';
import { logout as logoutAction, registerUserSuccess as registerUserSuccessAction } from './actions';
import { migrateReduxPersistFourToFive } from './utils';

const DuskenContainer = ({ registerUserSuccess, userToken, user, logout }) => {
  useEffect(() => {
    async function inner() {
      await migrateReduxPersistFourToFive(registerUserSuccess);

      // logout authenticated users without token
      if (user && !userToken) {
        logout();
      }
    }
    inner();
  });

  return (
    <NativeBaseProvider>
      <Navigation />
    </NativeBaseProvider>
  );
};

const mapStateToProps = (state) => ({
  userToken: state.userToken,
  user: state.user,
});
const mapDispatchToProps = {
  registerUserSuccess: registerUserSuccessAction,
  logout: logoutAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(DuskenContainer);
