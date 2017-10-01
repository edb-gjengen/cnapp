import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    USER_DATA_REQUEST,
    USER_DATA_SUCCESS,
    USER_DATA_FAILURE,
    REGISTER_USER_REQUEST,
    REGISTER_USER_FAILURE,
    REGISTER_USER_SUCCESS,
} from './actions';

const initialState = {
    isAuthenticated: false,
    isLoggingIn: false,
    isFetchingUserData: false,
    isRegisteringUser: false,
    userToken: null,
    user: null,
    loginError: null,
    userError: null,
    registerError: null,
};

export default function duskenApp(state = initialState, action) {
    switch (action.type) {
        /* Login */
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

        /* User data */
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

        /* Register user */
        case REGISTER_USER_REQUEST:
            return Object.assign({}, state, {
                isRegisteringUser: true
            });

        case REGISTER_USER_FAILURE:
            return Object.assign({}, state, {
                isRegisteringUser: false,
                registerError: action.registerError
            });

        case REGISTER_USER_SUCCESS:
            return Object.assign({}, state, {
                isRegisteringUser: false,
                user: action.data
            });

        default:
            return state
    }
}
