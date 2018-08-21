import App, { Container } from 'next/app'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import withApollo from '../lib/withApollo'

class MyApp extends App {
  render () {
    const { Component, pageProps, apolloClient } = this.props
    return <Container>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
      <style global jsx>{`
         body {
           font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 14px;
         }
    `}
      </style>
    </Container>
  }
}

export default withApollo(MyApp)
