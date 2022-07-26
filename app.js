const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
const { requestLogger, errorLogger } = require("./middleware/logger");
const { handleError, NotFoundError, HttpError } = require("./utils/errors");
const { errors } = require("celebrate");
const routes = require("./routes");
mongoose.connect("mongodb://localhost:27017/aroundb");

app.use(requestLogger);

app.use(cors());
app.options("*", cors());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new HttpError("Server will crash now");
  }, 0);
});

app.use(errors());

app.get("*", (req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use((err, req, res, next) => handleError(err, res));

app.use(errorLogger);

app.listen(PORT, () => {});
