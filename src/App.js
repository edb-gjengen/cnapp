import Dusken from "./Dusken";
import React, {Component} from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import duskenApp from "./reducers";

let store = createStore(duskenApp);


export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Dusken />
            </Provider>
        )
    }
}
