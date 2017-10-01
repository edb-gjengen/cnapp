import React, {Component} from 'react';
import {connect} from "react-redux";
import UserRegister from "./UserRegister";
import {requestRegisterUser} from "../../actions";

class UserRegisterContainer extends Component {
    onRegisterPress = (firstName, lastName, email, phoneNumber, password) => {
        this.props.requestRegisterUser(firstName, lastName, email, phoneNumber, password);
    };

    render() {
        return <UserRegister {...this.props} onRegisterPress={this.onRegisterPress} />;
    }
}

function stateToProps(state) {
    return {
        isRegisteringUser: state.isRegisteringUser,
        registerError: state.registerError
    };
}
export default connect(
    stateToProps,
    {requestRegisterUser}
)(UserRegisterContainer);