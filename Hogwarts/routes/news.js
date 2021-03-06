const express = require('express');

const { body } = require('express-validator/check');

const newsController = require('../controllers/news');

const router = express.Router();

router.get('/', newsController.getNews);

router.post(
  '/add',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 15 }),
    body('author').trim().isLength({ min: 3 })
  ],
  newsController.addNews
);

router.put(
  '/edit/:id',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 15 }),
    body('author').trim().isLength({ min: 3 })
  ],
  newsController.updateNews
);

router.delete('/delete/:id', newsController.deleteNews);

module.exports = router;
