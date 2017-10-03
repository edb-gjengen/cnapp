import React, {Component} from 'react';
import {connect} from "react-redux";

import Membership from "./Membership";
import { logout } from "../../actions";
import {requestUserData} from "../../api";
import ProofContainer from "./ProofContainer";

class MembershipContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: props.isAuthenticated,
            isFetchingUserData: props.isFetchingUserData,
            userToken: props.userToken,
            lastOrder: props.lastOrder,
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
        if(this.state.lastOrder !== nextProps.lastOrder) {
            this.setState({lastOrder: nextProps.lastOrder}, () => {
                if(nextProps.userToken) {
                    this.fetchUser();
                }
            });
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

    onLogoutPress = () => {
        this.props.logout();
        this.props.onLogoutPress();
    };

    render() {
        if (this.props.user) {
            return <ProofContainer
                user={this.props.user}
                userToken={this.state.userToken}
                fetchUser={this.fetchUser}
                onLogoutPress={this.onLogoutPress}
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
        lastOrder: state.lastOrder
    };
}

export default connect(
    stateToProps,
    { requestUserData, logout }
)(MembershipContainer);
