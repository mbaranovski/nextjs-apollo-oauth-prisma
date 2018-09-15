const fetch = require("isomorphic-unfetch");
const { ApolloError } = require("apollo-server");

const fb = async (endpoint, token = null) =>
  await (await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  })).json();

async function getFacebookToken(code, oAuthMethod) {
  const endpoint = `https://graph.facebook.com/v3.1/oauth/access_token?client_id=${
    process.env.FACEBOOK_APP_ID
  }&redirect_uri=${process.env.AUTH_CALLBACK_URL}${oAuthMethod}&client_secret=${
    process.env.FACEBOOK_APP_SECRET
  }&code=${code}`;

  const {access_token} = await fb(endpoint);
  return access_token;
}

async function verifyAccessToken(token) {
  const endpoint = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${
    process.env.FACEBOOK_APP_ID
  }|${process.env.FACEBOOK_APP_SECRET}`;

  return fb(endpoint, token);
}

async function checkFacebookPermissions(userId, token) {
  const endpoint = `https://graph.facebook.com/${userId}/permissions`;
  const { data, error } = await fb(endpoint, token);

  const declined = data
    .filter(item => item.status === "declined")
    .map(item => item.permission);

  if (declined.length) {
    console.log("MICHAL: declined:", declined);

    throw new ApolloError(
      "Insufficient Facebook App permissions",
      "INSUFFICIENT_FACEBOOK_PERMISSIONS",
      {
        rerequest: `https://www.facebook.com/v3.1/dialog/oauth?client_id=${
          process.env.FACEBOOK_APP_ID
        }&redirect_uri=${
          process.env.AUTH_CALLBACK_URL
        }Facebook&auth_type=rerequest&scope=${declined.join(",")}`
      }
    );
  }

  return data;
}

async function getFacebookUser(token) {
  const endpoint = `https://graph.facebook.com/me?fields=id,name,email`;
  return fb(endpoint, token);
}

module.exports = {
  getFacebookToken,
  verifyAccessToken,
  checkFacebookPermissions,
  getFacebookUser
};
