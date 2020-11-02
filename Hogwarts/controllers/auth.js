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
      loadedUser = user;
      return bcrypt.compare(req.body.password, loadedUser.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          login: loadedUser.login,
          userId: loadedUser._id.toString()
        },
        'secret_under_the_surface',
        { expiresIn: '1h' }
      );
      let personId;
      if (loadedUser.teacher) {
        personId = loadedUser.teacher;
      }
      res
        .status(200)
        .json({
          token: token,
          id: loadedUser._id.toString(),
          personId: personId
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
