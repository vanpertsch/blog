const express = require('express');
const { findById } = require('./../models/article');
const Article = require('./../models/article')
const router = express.Router();

router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article()});
});
router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render("articles/edit", { article: article});
});

router.get("/:slug", async (req,res) => {
  const article = await Article.findOne({slug : req.params.slug})
  if (article == null) res.redirect('')
  res.render('articles/show', { article:article})

})
router.get("/themen/:keyWordSlug", async (req,res) => {
  const articles = await Article.find({
    keyWordSlug: req.params.keyWordSlug,
  }).sort({
    createdAt:'desc'
  })
  res.render("articles/keyword", {
    articles: articles,
    keyWord: req.params.keyWordSlug,
  });
})

router.post("/", async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'));

router.put('/:id', async (req,res, next)=> {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

function saveArticleAndRedirect(path){
  return async (req,res) => {
      let article = req.article
      article.title = req.body.title
      article.keyWord = req.body.keyWord
      article.description = req.body.description
      article.markdown = req.body.markdown

      try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }

  }

}

router.delete('/:id', async (req,res) =>{
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

module.exports = router
