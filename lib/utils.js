const cookie = require("cookie");
const jwt = require("jsonwebtoken");

function parseCookies(req, options = {}) {
  return cookie.parse(
    req ? req.headers.cookie || "" : document.cookie,
    options
  );
}

const generateJWT = user =>
  jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "30min" });
const getUserFromCookie = req => ({ user } = parseCookies(req)) =>
  jwt.decode(`${user}.`);

const setCookies = (token, res) => {
  const [header, payload, signature] = token.split(".");
  res.setHeader("Set-Cookie", [
    `user=${header}.${payload}; Max-Age=1800`,
    `session=${signature}; HttpOnly`
  ]);
};

const jwtCheck = (req, res, next) => {
  const { user, session } = parseCookies(req);
  jwt.verify(
    [user, session].join("."),
    process.env.JWT_SECRET,
    (err, decoded) => {
      req.user = (decoded && decoded.user) || null;
      if (req.user)
        // Prolonging JWT life
        setCookies(generateJWT(req.user), res);
      next();
    }
  );
};

const checkUser = ({ req }) => {
  if (!req.user) throw Error("Missing access token!");
};

module.exports = {
  getUserFromCookie,
  generateJWT,
  parseCookies,
  jwtCheck,
  setCookies,
  checkUser
};
