const Article = require("../models/article");

function deleteArticle(req, res, next) {
  Article.findById(req.params.id)
    .orFail(notFound)
    .then((article) => {
      if (article.owner._id.toString() === req.user._id.toString()) {
        Article.deleteOne({ _id: article._id }).then((data) =>
          res.send({ data })
        );
      } else {
        throw new ForbiddenError("");
      }
    })
    .catch(next);
}

function createArticle(req, res, next) {
  const { keyword, title, text, date, source, link, image } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((data) => res.send({ data }))
    .catch(next);
}

function getArticles(req, res, next) {
  Article.find({})
    .then((data) => res.send({ data }))
    .catch(next);
}

module.exports = {
  deleteArticle,
  createArticle,
  getArticles,
};
