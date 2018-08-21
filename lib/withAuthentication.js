import React from 'react';
import redirect from './redirect';
import {getUserFromCookie} from './utils';

export default Page => {
    return class withAuthentication extends React.Component {
        static async getInitialProps(context) {
            try {
                const {user} = getUserFromCookie(context.req)();
                return {user}
            } catch (e) {
                redirect(context, '/signin')
            }
        }

        render() {
            return <Page {...this.props} />
        }

    }
}