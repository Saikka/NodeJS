const express = require('express');

const quidditchController = require('../controllers/quidditch');

const router = express.Router();

router.get('/', quidditchController.getMatches);

router.post('/add-match', quidditchController.addMatch);

module.exports = router;
