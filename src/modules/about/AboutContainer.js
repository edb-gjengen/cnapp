import { connect } from 'react-redux';
import React, { Component } from 'react';

import About from './About';

class AboutContainer extends Component {
  render() {
    return <About {...this.state} />;
  }
}

export default connect()(AboutContainer);
