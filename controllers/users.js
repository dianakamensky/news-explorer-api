const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} = require("../utils/errors");
const { createToken } = require("../utils/jwt");

function getMe(req, res, next) {
  User.findById(req.user._id)
    .orFail(new NotFoundError("User not found"))
    .then((data) => res.send({ email: data.email, name: data.name }))
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
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (result) {
            const token = createToken(user._id);
            res.send({ token });
          } else return Promise.reject(new UnauthorizedError());
        })
        .catch(next);
    })
    .catch(next);
}

function createUser(req, res, next) {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((data) => res.send({ email: data.email, name: data.name }))
    .catch((err) => {
      if (err.name === "MongoServerError" && err.code === 11000) {
        next(new ConflictError("Email already in use"));
      } else next(err);
    });
}

module.exports = {
  getMe,
  login,
  createUser,
};
