import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { importSchema } from 'graphql-import'
import {errorLink} from '../lib/errorLink';

const typeDefs = importSchema('schema.graphql');
const mocks = {
  Query: () => ({

  }),

  Mutation: () => ({

  })
}

const schema = makeExecutableSchema({ typeDefs });
addMockFunctionsToSchema({ mocks, schema });

const cache = new InMemoryCache();
const client = new ApolloClient({
  link: ApolloLink.from([
    errorLink.concat(new SchemaLink({ schema })),
  ]),
  cache,
});

export default client;