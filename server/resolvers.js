const { generateJWT } = require("../lib/utils");

const { AuthenticationError } = require("apollo-server-express");
const checkUser = require("../lib/utils").checkUser;
const getGithubUser = require("./github").getGithubUser;
const getGithubToken = require("./github").getGithubToken;

module.exports = {
  default: {
    Query: {
      me: (_, args, ctx, info) => {
        checkUser(ctx);

        return {
          name: "Michal"
        };
      }
    },
    Mutation: {
      authenticate: async (parent, { oAuthCode, oAuthMethod }, ctx, info) => {
        let oAuthUser, useruuid;
        if (oAuthMethod === "Github") {
          const token = await getGithubToken(oAuthCode);
          oAuthUser = await getGithubUser(token);

          const user = await ctx.db.query.user(
            {
              where: {
                oAuthID: oAuthUser.id
              }
            },
            `{id}`
          );
          console.log("MICHAL user: ", user);
          if (user) useruuid = user.id;
        }

        if (oAuthUser && !useruuid) {
          console.log("Creating new user...");
          const { id } = await ctx.db.mutation.createUser(
            {
              data: {
                oAuth: oAuthMethod,
                oAuthID: oAuthUser.id,
                role: "Client",
                name: oAuthUser.name,
                email: oAuthUser.email
              }
            },
            info
          );

          useruuid = id;
        }

        return {
          token: generateJWT({
            useruuid,
            name: oAuthUser.name,
            email: oAuthUser.email
          })
        };
      }
    }
  }
};
