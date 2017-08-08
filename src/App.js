import Dusken from "./Dusken";
import React, {Component} from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import duskenApp from "./reducers";

let store = createStore(duskenApp, applyMiddleware(...[logger, thunk]));

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Dusken />
            </Provider>
        )
    }
}
