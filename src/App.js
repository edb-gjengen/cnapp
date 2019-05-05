import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import Config from 'react-native-config';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

import Dusken from './Dusken';
import { store, persistor } from './reduxStore';

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: `${Config.DUSKEN_API_URL}/api/graphql/` }),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={apolloClient}>
          <Dusken />
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
}
