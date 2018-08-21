import React from 'react'
import cookie from 'cookie'
import {ApolloConsumer} from 'react-apollo'

import redirect from '../lib/redirect'
import withAuthentication from '../lib/withAuthentication';

class Index extends React.Component {
    signout = apolloClient => () => {
        document.cookie = cookie.serialize('user', '', {maxAge: -1})

        // Force a reload of all the current queries now that the user is
        // logged in, so we don't accidentally leave any state around.
        apolloClient.cache.reset().then(() => {
            // Redirect to a more useful page when signed out
            redirect({}, '/signin')
        })
    }

    render() {
        return (
            <ApolloConsumer>
                {client => (
                    <div>
                        Hello <br/>
                        <button onClick={this.signout(client)}>Sign out</button>
                    </div>
                )}
            </ApolloConsumer>
        )
    }
};

export default withAuthentication(Index)