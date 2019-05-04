import React, {Component} from 'react';
import {connect} from "react-redux";

import UserRegister from "./UserRegister";
import {requestRegisterUser} from "../../api";

class UserRegisterContainer extends Component {

    constructor(state) {
        super(state);
        this.state = {
            isAuthenticated: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.isAuthenticated !== nextProps.isAuthenticated) {
            if (nextProps.isAuthenticated) {
                this.props.onRegister();
            }
        }
    }

    onRegisterPress = (firstName, lastName, email, phoneNumber, password) => {
        this.props.requestRegisterUser(firstName, lastName, email, phoneNumber, password);
    };

    render() {
        return <UserRegister
            {...this.state}
            onRegisterPress={this.onRegisterPress}
            registerError={this.props.registerError}
            isRegisteringUser={this.props.isRegisteringUser}
        />;
    }
}

function storeToProps(store) {
    const errors = store.registerError === null ? {} : store.registerError;
    return {
        isAuthenticated: store.isAuthenticated,
        isRegisteringUser: store.isRegisteringUser,
        registerError: errors
    };
}
export default connect(
    storeToProps,
    {requestRegisterUser}
)(UserRegisterContainer);
