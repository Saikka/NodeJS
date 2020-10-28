const { validationResult } = require('express-validator/check');

const News = require('../models/news');

exports.getNews = (req, res, next) => {
  News.find()
    .then((news) => {
      res.status(200).json({
        message: 'success',
        news: news
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addNews = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    throw error;
  }
  const news = new News({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: req.body.date
  });
  news
    .save()
    .then(() => {
      res.status(201).json({
        message: 'success',
        news: news
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateNews = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    throw error;
  }
  const id = req.params.id;
  News.findById(id)
    .then((news) => {
      if (!news) {
        const error = new Error('Cound not find news!');
        error.statusCode = 404;
        throw error;
      }
      news.title = req.body.title;
      news.content = req.body.content;
      news.author = req.body.author;
      return news.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'News updated', news: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteNews = (req, res, next) => {
  const id = req.params.id;
  News.findById(id)
    .then((news) => {
      if (!news) {
        const error = new Error('Cound not find news!');
        error.statusCode = 404;
        throw error;
      }
      return News.findByIdAndRemove(id);
    })
    .then(() => {
      res.status(200).json({ message: 'News deleted', id: id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
