import React from 'react';
import { connect } from 'react-redux';
import { Root } from 'native-base';
import DuskenNavigation from './navigation';

const DuskenContainer = () => (
  <Root>
    <DuskenNavigation />
  </Root>
);

export default connect()(DuskenContainer);
