const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.login = (req, res, next) => {
  User.findOne({ login: req.body.login })
    .then((user) => {
      if (!user) {
        const error = new Error('No user with such login found!');
        error.statusCode = 401;
        throw error;
      }
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      return User.findOne({ login: req.body.login })
        .populate('teacher')
        .populate('student')
        .select('-login -password');
    })
    .then((user) => {
      const token = jwt.sign(
        {
          login: user.login,
          userId: user._id.toString()
        },
        'secret_under_the_surface',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        token: token,
        user: user,
        expiresIn: 3600
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
