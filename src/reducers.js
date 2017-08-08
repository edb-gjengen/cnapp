import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    USER_DATA_REQUEST,
    USER_DATA_SUCCESS,
    USER_DATA_FAILURE,
} from './actions';

const initialState = {
    isAuthenticated: false,
    isLoggingIn: false,
    isFetchingUserData: false,
    userToken: null,
    user: null,
    loginError: null,
    userError: null,
};

export default function duskenApp(state = initialState, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return Object.assign({}, state, {
                isLoggingIn: true,
                loginError: null,
            });

        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                isLoggingIn: false,
                loginError: action.loginError
            });

        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isLoggingIn: false,
                isAuthenticated: true,
                userToken: action.token
            });

        case LOGOUT:
            return initialState;

        case USER_DATA_REQUEST:
            return Object.assign({}, state, {
                isFetchingUserData: true
            });

        case USER_DATA_FAILURE:
            return Object.assign({}, state, {
                isFetchingUserData: false,
                userError: action.userError
            });

        case USER_DATA_SUCCESS:
            return Object.assign({}, state, {
                isFetchingUserData: false,
                user: action.data
            });

        default:
            return state
    }
}
