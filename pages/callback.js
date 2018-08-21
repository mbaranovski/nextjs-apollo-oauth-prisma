import React from 'react';
import {withApollo} from 'react-apollo'
import gql from 'graphql-tag'
import redirect from '../lib/redirect';
import {setCookies} from '../lib/utils';

const AUTHENTICATE = gql`
            mutation Authenticate($githubCode: String!) {
                authenticate(githubCode: $githubCode) {
                    user { name }
                    token
                }
            }
        `;

class CallbackAuth extends React.Component {
    static async getInitialProps({req, res, apolloClient}) {
        const {code} = req.query;

        if (!process.browser && code) {
            const {data} = await apolloClient.mutate({
                mutation: AUTHENTICATE,
                variables: {githubCode: code}
            })
            if (data && data.authenticate) {
                setCookies(data.authenticate.token, res)
                redirect({res}, '/');
            }
        } else {
            redirect({}, '/');
        }

        return {}
    }

    render() {
        return (
            <React.Fragment>
                <div>Login in progress...</div>
            </React.Fragment>
        )
    }
};

export default withApollo(CallbackAuth)