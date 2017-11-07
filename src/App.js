import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import {autoRehydrate, persistStore} from 'redux-persist'
import {AsyncStorage} from 'react-native'
import Config from 'react-native-config';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider} from "react-apollo";
import 'isomorphic-fetch';

import Dusken from "./Dusken";
import duskenApp from "./reducers";


let store = createStore(
    duskenApp,
    applyMiddleware(...[logger, thunk]),
    autoRehydrate()
);

const apolloClient = new ApolloClient({
    link: new HttpLink({uri: `${Config.DUSKEN_API_URL}/api/graphql/`}),
    cache: new InMemoryCache()
});

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <ApolloProvider client={apolloClient}>
                    <Dusken />
                </ApolloProvider>
            </Provider>
        )
    }
}

// begin periodically persisting the store
persistStore(store, {storage: AsyncStorage});
