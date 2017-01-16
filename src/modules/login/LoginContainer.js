import {connect} from "react-redux";
import Login from "./Login";

export default connect(
  state => ({
    loggedIn: state.loggedIn
  })
)(Login);