const { Joi, celebrate } = require("celebrate");
const router = require("express").Router();

const {
  getArticles,
  deleteArticle,
  createArticle,
} = require("../controllers/articles");

router.get("/", getArticles);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.date(),
      source: Joi.string().required(),
      link: Joi.string().uri().required(),
      image: Joi.string().uri().required(),
    }),
  }),
  createArticle
);

router.delete(
  "/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().required().min(24).max(24),
    }),
  }),
  deleteArticle
);

module.exports = router;
