import React from "react";
import withAuthentication from "../lib/withAuthentication";
import { MainLayout } from "../layouts/MainLayout";

class Index extends React.Component {
  render() {
    return (
          <MainLayout user={this.props.user} >
            <div>Index!</div>
          </MainLayout>
    );
  }
}

export default withAuthentication(Index);
