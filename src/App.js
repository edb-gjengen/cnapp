import Dusken from "./Dusken";
import React, {Component} from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import duskenApp from "./reducers";

let store = createStore(duskenApp, applyMiddleware(thunk));

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Dusken />
            </Provider>
        )
    }
}
