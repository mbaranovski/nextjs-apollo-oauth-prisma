import React from "react";
import cookie from "cookie";
import redirect from "../../lib/redirect";

export class NavHeader extends React.Component {
  signout = apolloClient => () => {
    document.cookie = cookie.serialize("user", "", { maxAge: -1 });
    apolloClient.cache.reset().then(() => redirect({}, "/signin"));
  };

  render() {
    const { client, user } = this.props;
    console.log("MICHAL: ", user);
    return (
      <header className={"nav-header"}>
        <nav>{user.name}, </nav>
        <nav className={"link"} onClick={this.signout(client)}>
          Sign out
        </nav>
        {/*language=CSS*/}
        <style jsx>{`
          .nav-header {
            width: 100%;
            height: 35px;
            background-color: #ececec;
            display: flex;
            align-items: center;
            flex-direction: row;
            padding: 5px;
            box-sizing: border-box;
            justify-content: flex-end;
          }

          .nav-header nav.link {
            cursor: pointer;
          }

          .nav-header nav.link:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        `}</style>
      </header>
    );
  }
}
