require("dotenv").config();
const { Prisma } = require("prisma-binding");
const { ApolloServer } = require("apollo-server-express");
const { importSchema } = require("graphql-import");
const resolvers = require("./resolvers.js").default;
const express = require("express");
const next = require("next");
const jwtCheck = require("../lib/utils").jwtCheck;

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const gqlPath = "/graphql";

const apolloServer = new ApolloServer({
  typeDefs: importSchema("schema.graphql"),
  resolvers,
  context: request => ({
    ...request,
    db: new Prisma({
      typeDefs: "generated/prisma.graphql",
      endpoint: "http://localhost:4466"
    })
  })
});

async function serverStart() {
  try {
    await app.prepare();
    const server = express();

    server.post(gqlPath, jwtCheck);
    apolloServer.applyMiddleware({ app: server, path: gqlPath });
    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(4000, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:4000");
    });
  } catch (ex) {
    console.error(ex.stack);
    process.exit(1);
  }
}

serverStart();
