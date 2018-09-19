import React from "react";
import gql from "graphql-tag";
import redirect from "../lib/redirect";
import { setCookies } from "../lib/utils";
import Link from "next/link";
import { handleGraphQLErrors } from "../lib/errorLink";

const AUTHENTICATE = gql`
  mutation Authenticate($oAuthCode: String!, $oAuthMethod: oAuthMethod!) {
    authenticate(oAuthCode: $oAuthCode, oAuthMethod: $oAuthMethod) {
      token
    }
  }
`;

class CallbackAuth extends React.Component {
  static async getInitialProps({ req, res, apolloClient }) {
    const { code, method } = req.query;
    if (!process.browser && code) {
      try {
        const { data } = await apolloClient.mutate({
          mutation: AUTHENTICATE,
          variables: { oAuthCode: code, oAuthMethod: method }
        });

        if (data && data.authenticate) {
          setCookies(data.authenticate.token, res);
          redirect({ res }, "/");
        }
      } catch (e) {
        handleGraphQLErrors(e.graphQLErrors, res);
        return { error: true };
      }
    }

    return {};
  }

  render() {
    const { error } = this.props;
    return (
      <React.Fragment>
        {!error ? (
          <div>Login in progress...</div>
        ) : (
          <div>
            Something went wrong,{" "}
            <Link href={"/"}>
              <a>try again</a>
            </Link>
            .
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default CallbackAuth;
