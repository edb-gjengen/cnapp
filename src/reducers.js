import {LOGIN_START} from './actions';

const initialState = {
  loggedIn: false,
};

export default function duskenApp(state = initialState, action) {
  switch (action.type) {
    case LOGIN_START:
      return Object.assign({}, state, {
        loggedIn: true  // INSTANT LOGIN!
      });
    default:
      return state
  }
}