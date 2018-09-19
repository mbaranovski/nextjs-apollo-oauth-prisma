import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import client from './apolloMockedClient';

const WithApolloProvider = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

WithApolloProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.node]).isRequired,
};

export default WithApolloProvider;