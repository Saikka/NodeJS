const express = require('express');

const newsController = require('../controllers/news');

const router = express.Router();

router.get('/', newsController.getNews);

router.post('/add-news', newsController.addNews);

module.exports = router;
