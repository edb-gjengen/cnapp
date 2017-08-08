import Dusken from "./Dusken";
import React, {Component} from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist'
import {AsyncStorage} from 'react-native'
import duskenApp from "./reducers";

let store = createStore(
    duskenApp,
    applyMiddleware(...[logger, thunk]),
    autoRehydrate()
);

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Dusken />
            </Provider>
        )
    }
}

// begin periodically persisting the store
persistStore(store, {storage: AsyncStorage});
