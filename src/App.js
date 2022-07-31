import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Config from 'react-native-config';
import {ApolloClient, HttpLink, InMemoryCache, ApolloProvider} from '@apollo/client';
// import { StripeProvider } from '@stripe/stripe-react-native';

import Dusken from './Dusken';
import {store, persistor} from './reduxStore';

const apolloClient = new ApolloClient({
  link: new HttpLink({uri: `${Config.DUSKEN_API_URL}/api/graphql/`}),
  cache: new InMemoryCache(),
});

// <StripeProvider publishableKey={Config.STRIPE_PUBLISHABLE_KEY || ''}>
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
// </StripeProvider>
