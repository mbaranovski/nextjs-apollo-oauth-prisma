import React from "react";
import { ApolloConsumer } from "react-apollo";
import withAuthentication from "../lib/withAuthentication";
import { MainLayout } from "../layouts/MainLayout";

class Index extends React.Component {
  render() {
    return (
      <ApolloConsumer>
        {client => (
          <MainLayout client={client} {...this.props}>
            <div>Index!</div>
          </MainLayout>
        )}
      </ApolloConsumer>
    );
  }
}

export default withAuthentication(Index);
