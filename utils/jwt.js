const jwt = require("jsonwebtoken");
const { NODE_ENV, JWT_SECRET } = process.env;

function verifyToken(token) {
  return jwt.verify(
    token,
    NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
  );
}

function createToken(id) {
  return jwt.sign(
    { _id: id },
    NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
    {
      expiresIn: "7d",
    }
  );
}

module.exports = {
  verifyToken,
  createToken,
};
