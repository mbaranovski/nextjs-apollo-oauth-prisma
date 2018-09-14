const verifyFacebookPermissions = require("./facebook").verifyFacebookPermissions;
const verifyAccessToken = require("./facebook").verifyAccessToken;
const getFacebookToken = require("./facebook").getFacebookToken;
const { getGithubUser } = require("./github");
const { getGithubToken } = require("./github");

const getUserFromOAuthMethod = async (oAuthMethod, oAuthCode, ctx) => {
  let oAuthUser = null;
  if (oAuthMethod === "Github") {
    const token = await getGithubToken(oAuthCode);
    oAuthUser = await getGithubUser(token);
  }

  if (oAuthMethod === "Facebook") {
    const token = await getFacebookToken(oAuthCode, oAuthMethod);
    const {data: {user_id}} = await verifyAccessToken(token);
    const permissions = await verifyFacebookPermissions(user_id, token, ctx);

    console.log("MICHAL:permissions ", permissions);
  }
  if (!oAuthUser) throw Error("Error occured during oAuth");
  return oAuthUser;
};

const findOrCreateUser = async (oAuthUser, ctx) => {
  const userFields = `{id name email}`;
  const user = await ctx.db.query.user(
    {
      where: {
        oAuthID: oAuthUser.id
      }
    },
    userFields
  );

  if (user) return { id: user.id, name: user.name, email: user.email };

  const { id, name, email } = await ctx.db.mutation.createUser(
    {
      data: {
        oAuthID: oAuthUser.id,
        role: "Customer",
        name: oAuthUser.name,
        email: oAuthUser.email
      }
    },
    userFields
  );

  return { id, name, email };
};

module.exports = {
  getUserFromOAuthMethod,
  findOrCreateUser
};
