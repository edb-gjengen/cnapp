import React from 'react';
import {connect} from "react-redux";

import Membership from "./Membership";
import MembershipProof from "./MembershipProof";
import { requestUserData, logout } from "../../actions";

class MembershipContainer extends React.Component {
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

    onLogoutPress = () => {
        this.props.logout();
        this.props.logoutNavigate();
    };

    render() {
        if (this.state.user) {
            return <MembershipProof
                user={this.state.user}
                fetchUser={this.fetchUser}
                onLogoutPress={this.onLogoutPress}
            />;
        }
        return <Membership onLoginPress={this.onLoginPress}/>;
    }
}

export default connect(
    (state) => ({
        isAuthenticated: state.isAuthenticated,
        isFetchingUserData: state.isFetchingUserData,
        userToken: state.userToken,
        user: state.user,
    }),
    { requestUserData, logout }
)(MembershipContainer);
