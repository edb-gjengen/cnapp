import React, {Component} from 'react';
import {connect} from "react-redux";

import Membership from "./Membership";
import Proof from "./Proof";
import { requestUserData, logout } from "../../actions";

class MembershipContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: props.isAuthenticated,
            userToken: props.userToken,
            isFetchingUserData: props.isFetchingUserData,
            user: props.user,
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.isAuthenticated !== nextProps.isAuthenticated) {
            this.setState({isAuthenticated: nextProps.isAuthenticated})
        }
        if(this.state.userToken !== nextProps.userToken) {
            this.setState({userToken: nextProps.userToken}, () => {
                if(nextProps.userToken) {
                    this.fetchUser();
                }
            });

        }
        if(this.state.user !== nextProps.user) {
            this.setState({user: nextProps.user})
        }
    }

    fetchUser = () => {
        this.props.requestUserData(this.state.userToken)
    };

    onLoginPress = () => {
        this.props.onLoginPress();
    };

    onRegisterPress = () => {
        this.props.onRegisterPress();
    };

    onChargePress = () => {
        this.props.onChargePress();
    };

    onLogoutPress = () => {
        this.props.logout();
        this.props.onLogoutPress();
    };

    render() {
        if (this.state.user) {
            return <Proof
                user={this.state.user}
                fetchUser={this.fetchUser}
                onLogoutPress={this.onLogoutPress}
                onChargePress={this.onChargePress}
            />;
        }
        return <Membership onLoginPress={this.onLoginPress} onRegisterPress={this.onRegisterPress} />;
    }
}

function stateToProps(state) {
    return {
        isAuthenticated: state.isAuthenticated,
        isFetchingUserData: state.isFetchingUserData,
        userToken: state.userToken,
        user: state.user,
    };
}

export default connect(
    stateToProps,
    { requestUserData, logout }
)(MembershipContainer);
