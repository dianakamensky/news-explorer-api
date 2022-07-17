const { login, createUser } = require("./controllers/users");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const auth = require("./middleware/auth");
const cors = require("cors");
const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
const { requestLogger, errorLogger } = require("./middleware/logger");
const { handleError, NotFoundError, HttpError } = require("./utils/errors");
const { Joi, celebrate, errors } = require("celebrate");

app.use(requestLogger);

app.use(cors());
app.options("*", cors());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new HttpError("Server will crash now");
  }, 0);
});

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser
);

app.use(auth);

app.use("/articles", require("./routes/articles"));
app.use("/users", require("./routes/users"));

app.use(errors());

app.get("*", (req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use((err, req, res, next) => handleError(err, res));

app.use(errorLogger);

app.listen(PORT, () => {});
