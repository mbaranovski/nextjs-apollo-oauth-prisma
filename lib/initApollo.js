import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from "apollo-link-http";
import { errorLink } from "./errorLink";
import fetch from "isomorphic-unfetch";

let apolloClient = null;

if (!process.browser) {
  global.fetch = fetch;
}

const uri = () => process.env.GRAPHQL_HOST || "";

function create(initialState) {
  const httpLink = createHttpLink({
    uri: `${uri()}/graphql`,
    credentials: "same-origin"
  });

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    link: ApolloLink.from([
      errorLink,
      httpLink,
    ]),
    cache: new InMemoryCache().restore(initialState || {})
  });
}

export default function initApollo(initialState) {
  if (!process.browser) {
    return create(initialState);
  }

  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
