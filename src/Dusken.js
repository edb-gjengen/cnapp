import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Root } from 'native-base';

import DuskenNavigation from './navigation';
import { userDataSuccess } from './actions';
import { migrateReduxPersistFourToFive } from './utils';

const DuskenContainer = ({ setUserData }) => {
  useEffect(() => {
    migrateReduxPersistFourToFive(setUserData);
  });

  return (
    <Root>
      <DuskenNavigation />
    </Root>
  );
};

const mapDispatchToProps = {
  setUserData: userDataSuccess,
};

export default connect(
  null,
  mapDispatchToProps
)(DuskenContainer);
