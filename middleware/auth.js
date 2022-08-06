const { UnauthorizedError } = require("../utils/errors");
const { verifyToken } = require("../utils/jwt");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization Required");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = verifyToken(token);
  } catch (err) {
    throw new UnauthorizedError("Authorization Required");
  }

  req.user = payload;

  next();
};
