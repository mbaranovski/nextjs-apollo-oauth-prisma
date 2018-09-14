require("dotenv").config();

const https = require("https");
const { Prisma } = require("prisma-binding");
const { ApolloServer } = require("apollo-server-express");
const { importSchema } = require("graphql-import");
const resolvers = require("./resolvers.js").default;
const express = require("express");
const next = require("next");
const jwtCheck = require("../lib/utils").jwtCheck;
const generateCertificate = require("../generateCertificate");

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
    const expressServer = express();

    expressServer.post(gqlPath, jwtCheck);
    apolloServer.applyMiddleware({ app: expressServer, path: gqlPath });
    expressServer.get("*", (req, res) => {
      return handle(req, res);
    });

    const credentials = generateCertificate();
    const server = https.createServer(credentials, expressServer);

    server.listen(4000, err => {
      if (err) throw err;
      console.log("> Ready on https://localhost:4000");
    });
  } catch (ex) {
    console.error(ex.stack);
    process.exit(1);
  }
}

serverStart();
