import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import Login from "./Login";
import { requestLogin } from "../../actions";

export default connect(
	(state) => ({
		isAuthenticated: state.isAuthenticated,
		isLoggingIn: state.isLoggingIn,
		errorMessage: state.errorMessage,
	}),
 	{ requestLogin }
)(Login);
