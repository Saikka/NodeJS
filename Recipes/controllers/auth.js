const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    if (req.body.pwd !== req.body.pwd_confirm) {
        const error = new Error('Passwords don\'t match!');
        error.statusCode = 401;
        throw error;
    }
    User.findOne({login: req.body.login}).then(user => {
        if (user) {
            const error = new Error('User with such login already exists!');
            error.statusCode = 401;
            throw error;
        }
        return bcrypt.hash(req.body.pwd, 12);
    }).then(hashed => {
        const user = User({
            login: req.body.login,
            password: hashed,
            categories: [],
            recipes: []
        });
        return user.save();
    }).then(result => {
        res.status(201).json({message: 'User created', id: result._id })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    User.findOne({login: req.body.login}).then(user => {
        if (!user) {
            const error = new Error('No user with such login found!');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(req.body.pwd, loadedUser.password);
    }).then(isEqual => {
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
                login: loadedUser.login, 
                userId: loadedUser._id.toString()
            }, 
            'secret_under_the_surface', 
            { expiresIn: '1h' }
        );
        res.status(200).json({token: token, id: loadedUser._id.toString()});
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};