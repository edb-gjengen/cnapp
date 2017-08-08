import React, {Component} from 'react';
import {connect} from "react-redux";
import Login from "./Login";
import {requestLogin} from "../../actions";

class LoginContainer extends Component {
    constructor(state) {
        super(state);
        this.state = {
            isAuthenticated: false,
            isLoggingIn: false,
            loginError: null,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.isAuthenticated !== nextProps.isAuthenticated) {
            if (nextProps.isAuthenticated) {
                this.props.onLogin();
            }
        }
        if (this.state.isLoggingIn !== nextProps.isLoggingIn) {
            this.setState({isLoggingIn: nextProps.isLoggingIn})
        }
        if (this.state.loginError !== nextProps.loginError) {
            this.setState({loginError: nextProps.loginError})
        }
    }

    render() {
        return <Login {...this.state} requestLogin={this.props.requestLogin}/>
    }
}

export default connect(
    (state) => ({
        isAuthenticated: state.isAuthenticated,
        isLoggingIn: state.isLoggingIn,
        loginError: state.loginError,
    }),
    {requestLogin}
)(LoginContainer);
