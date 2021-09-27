import React, { Component } from 'react';
import { connect } from 'react-redux';

import Membership from './Membership';
import Proof from './Proof';
import { logout } from '../../actions';
import { requestUserData } from '../../api';

class MembershipContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetchingUserData: props.isFetchingUserData,
      userToken: props.userToken,
      lastOrder: props.lastOrder,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.userToken !== nextProps.userToken) {
      this.setState({ userToken: nextProps.userToken }, () => {
        if (nextProps.userToken) {
          this.fetchUser();
        }
      });
    }
    if (this.state.lastOrder !== nextProps.lastOrder) {
      this.setState({ lastOrder: nextProps.lastOrder }, () => {
        if (nextProps.userToken) {
          this.fetchUser();
        }
      });
    }
  }

  fetchUser = () => {
    this.props.requestUserData(this.state.userToken);
  };

  onLoginPress = () => {
    this.props.onLoginPress();
  };

  onRegisterPress = () => {
    this.props.onRegisterPress();
  };

  onLogoutPress = () => {
    this.props.logout();
    this.props.onLogoutPress();
  };

  render() {
    if (this.props.user) {
      return (
        <Proof
          user={this.props.user}
          isFetchingUserData={this.props.isFetchingUserData}
          isAuthenticated={this.props.isAuthenticated}
          userToken={this.state.userToken}
          fetchUser={this.fetchUser}
          onLogoutPress={this.onLogoutPress}
        />
      );
    }
    return (
      <Membership
        isFetchingUserData={this.props.isFetchingUserData}
        onLoginPress={this.onLoginPress}
        onRegisterPress={this.onRegisterPress}
      />
    );
  }
}

function storeToProps(store) {
  return {
    isAuthenticated: store.isAuthenticated,
    isFetchingUserData: store.isFetchingUserData,
    userToken: store.userToken,
    user: store.user,
    lastOrder: store.lastOrder,
  };
}

export default connect(storeToProps, { requestUserData, logout })(MembershipContainer);
