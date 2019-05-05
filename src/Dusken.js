import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Root } from 'native-base';
import DuskenNavigation from './navigation';

class DuskenContainer extends Component {
  render() {
    return (
      <Root>
        <DuskenNavigation />
      </Root>
    );
  }
}

export default connect()(DuskenContainer);
