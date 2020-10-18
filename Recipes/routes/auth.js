const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', 
    [
        body('login').trim().isLength({min: 3}),
        body('pwd').trim().isLength({min: 3}),
        body('pwd_confirm').trim().isLength({min: 3})
    ],
    authController.signup);

router.post('/login',
    [
        body('login').trim().isLength({min: 3}),
        body('pwd').trim().isLength({min: 3}),
    ],
    authController.login);

module.exports = router;