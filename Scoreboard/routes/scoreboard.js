const express = require('express');
const { body } = require('express-validator/check');

const scoreboard = require('../controllers/scoreboard');

const router = express.Router();

router.get('/', scoreboard.getIndex);

router.post(
    '/add-score',
    [
        body('name').isString().isLength({min: 1}).trim(),
        body('score').isFloat()
    ],
    scoreboard.postAddProduct);

router.post('/sort-scores', scoreboard.postSort);

module.exports = router;