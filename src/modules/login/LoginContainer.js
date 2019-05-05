import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from './Login';
import { requestLogin } from '../../api';

class LoginContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      if (nextProps.isAuthenticated) {
        this.props.onLogin();
      }
    }
  }

  render() {
    return <Login {...this.props} />;
  }
}

export default connect(
  (store) => ({
    isAuthenticated: store.isAuthenticated,
    isLoggingIn: store.isLoggingIn,
    loginError: store.loginError,
  }),
  { requestLogin }
)(LoginContainer);
