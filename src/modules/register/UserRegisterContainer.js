import React, {Component} from 'react';
import {connect} from "react-redux";
import UserRegister from "./UserRegister";
import {requestRegisterUser} from "../../actions";

class UserRegisterContainer extends Component {

    constructor(state) {
        super(state);
        this.state = {
            isAuthenticated: false,
            isRegisteringUser: false,
            registerError: null
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.isAuthenticated !== nextProps.isAuthenticated) {
            if (nextProps.isAuthenticated) {
                this.props.onRegister();
            }
        }
        if (this.state.isRegisteringUser !== nextProps.isRegisteringUser) {
            this.setState({isRegisteringUser: nextProps.isRegisteringUser});
        }
        if (this.state.registerError !== nextProps.registerError) {
            this.setState({registerError: nextProps.registerError});
        }
    }

    onRegisterPress = (firstName, lastName, email, phoneNumber, password) => {
        this.props.requestRegisterUser(firstName, lastName, email, phoneNumber, password);
    };

    render() {
        return <UserRegister {...this.state} onRegisterPress={this.onRegisterPress} />;
    }
}

function stateToProps(state) {
    return {
        isAuthenticated: state.isAuthenticated,
        isRegisteringUser: state.isRegisteringUser,
        registerError: state.registerError
    };
}
export default connect(
    stateToProps,
    {requestRegisterUser}
)(UserRegisterContainer);