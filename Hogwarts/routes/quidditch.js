const express = require('express');

const quidditchController = require('../controllers/quidditch');

const router = express.Router();

router.get('/', quidditchController.getMatches);

router.post('/add', quidditchController.addMatch);

router.put('/edit/:id', quidditchController.updateMatch);

router.delete('/delete/:id', quidditchController.deleteMatch);

module.exports = router;
