const findOrCreateUser = require("./services/oAuth").findOrCreateUser;
const getUserFromOAuthMethod = require("./services/oAuth")
  .getUserFromOAuthMethod;
const { generateJWT } = require("../lib/utils");
const checkUser = require("../lib/utils").checkUser;


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
      authenticate: async (parent, { oAuthCode, oAuthMethod }, ctx) => {
        const oAuthUser = await getUserFromOAuthMethod(oAuthMethod, oAuthCode, ctx);
        const { id, name, email } = await findOrCreateUser(oAuthUser, ctx);

        return {
          token: generateJWT({
            useruuid: id,
            name,
            email
          })
        };
      }
    }
  }
};
