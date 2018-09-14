const fetch = require("isomorphic-unfetch");
const { ApolloError } = require("apollo-server");
async function getFacebookToken(code, oAuthMethod) {
  const endpoint = `https://graph.facebook.com/v3.1/oauth/access_token?client_id=${
    process.env.FACEBOOK_APP_ID
  }&redirect_uri=${process.env.AUTH_CALLBACK_URL}${oAuthMethod}&client_secret=${
    process.env.FACEBOOK_APP_SECRET
  }&code=${code}`;
  const data = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  }).then(response => response.json());

  if (data.error) {
    throw new Error(JSON.stringify(data.error));
  }

  return data.access_token;
}

async function verifyAccessToken(token) {
  const endpoint = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${
    process.env.FACEBOOK_APP_ID
  }|${process.env.FACEBOOK_APP_SECRET}`;
  const data = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  }).then(response => response.json());

  if (data.error) {
    throw new Error(JSON.stringify(data.error));
  }

  return data;
}

async function verifyFacebookPermissions(userId, token, ctx) {
  const endpoint = `https://graph.facebook.com/${userId}/permissions`;
  const { data } = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  }).then(response => response.json());

  const declined = data
    .filter(item => item.status === "declined")
    .map(item => item.permission);

  if (declined.length) {
    console.log("MICHAL: declined:", declined);
    throw new ApolloError("Insufficient Facebook App permissions", "INSUFFICIENT_FACEBOOK_PERMISSIONS", {
      rerequest: `https://www.facebook.com/v3.1/dialog/oauth?client_id=${
        process.env.FACEBOOK_APP_ID
      }&redirect_uri=${
        process.env.AUTH_CALLBACK_URL
      }Facebook&auth_type=rerequest&scope=${declined.join(",")}`
    });
  }

  if (data.error) {
    throw new Error(JSON.stringify(data.error));
  }

  return data;
}

module.exports = {
  getFacebookToken,
  verifyAccessToken,
  verifyFacebookPermissions
};
