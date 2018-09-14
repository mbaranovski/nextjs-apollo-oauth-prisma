import React from "react";

import SignInBox from "../components/SignInBox/SignInBox";

export default class Signin extends React.Component {
  render() {
    return (
      <React.Fragment>
        <SignInBox type={"github"} />
      </React.Fragment>
    );
  }
}
