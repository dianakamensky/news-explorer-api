const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const auth = require("../middleware/auth");
const { Joi, celebrate } = require("celebrate");

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

router.post(
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

router.use(auth);

router.use("/articles", require("./articles"));
router.use("/users", require("./users"));

module.exports = router;
