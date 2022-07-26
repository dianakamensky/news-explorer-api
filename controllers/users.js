const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { NotFoundError, UnauthorizedError } = require("../utils/errors");
const createToken = require("../utils/jwt");
const notFound = new NotFoundError("User not found");

function getMe(id, res, next) {
  User.findById(id)
    .orFail(notFound)
    .then((data) => res.send({ data }))
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError());
      }
      if (bcrypt.compare(password, user.password)) {
        const token = createToken(user._id);
        res.send({ token });
      } else return Promise.reject(new UnauthorizedError());
    })
    .catch(next);
}

function createUser(req, res, next) {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((data) => res.send({ data }))
    .catch(next);
}

module.exports = {
  getMe,
  login,
  createUser,
};
