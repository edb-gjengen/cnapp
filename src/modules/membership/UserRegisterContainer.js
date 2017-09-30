import React, {Component} from 'react';
import {connect} from "react-redux";
import UserRegister from "./UserRegister";

class UserRegisterContainer extends Component {
    render() {
        return <UserRegister/>;
    }
}

export default connect()(UserRegisterContainer);