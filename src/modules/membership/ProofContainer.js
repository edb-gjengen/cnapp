import React, {Component} from 'react';
import {connect} from "react-redux";

import Proof from "./Proof";

class ProofContainer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <Proof />
    }
}

export default connect()(ProofContainer);
