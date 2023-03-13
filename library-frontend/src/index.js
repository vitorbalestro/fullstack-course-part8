import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { ApolloClient, ApolloLink, ApolloProvider, 
  InMemoryCache, concat, HttpLink, split } from '@apollo/client'
  
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${localStorage.getItem('logged-user-token')}` || null,
    }
  }));

  return forward(operation);
})

const wsLink = new GraphQLWsLink(
  createClient({ url: 'ws://localhost:4000' })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  concat(authMiddleware, httpLink)
)

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
  });

ReactDOM.createRoot(document.getElementById('root')).render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>)