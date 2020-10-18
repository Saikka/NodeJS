const House = require('../models/house');

exports.getHousesNames = (req, res, next) => {
  House.find({}, { _id: 1, name: 1 })
    .then((houses) => {
      res.status(200).json({
        message: 'success',
        houses: houses
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
