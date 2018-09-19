/* eslint-env jest */

import React from 'react';
import NavHeader from "../NavHeader";
import { render, cleanup } from "react-testing-library";
import WithApolloProvider from "../../../.testUtils/withApolloProvider";

beforeEach(() => cleanup);

test("renders NavHeader with user name and Sign Out button", () => {

  const user = { name: 'Michal' };
  const {getByText} = render(<WithApolloProvider><NavHeader user={user} /></WithApolloProvider>);

  getByText(/Michal/);
  getByText('Sign out');

});