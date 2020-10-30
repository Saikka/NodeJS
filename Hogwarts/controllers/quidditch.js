const Match = require('../models/match');

exports.getMatches = (req, res, next) => {
  Match.find()
    .populate('team1.house', ['name', 'image'])
    .populate('team2.house', ['name', 'image'])
    .then((matches) => {
      res.status(200).json({
        message: 'success',
        matches: matches
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addMatch = (req, res, next) => {
  const match = new Match({
    team1: req.body.team1,
    team2: req.body.team2,
    date: req.body.date
  });
  match
    .save()
    .then(() => {
      res.status(201).json({
        message: 'success',
        match: match
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateMatch = (req, res, next) => {
  const id = req.params.id;
  Match.findById(id)
    .then((match) => {
      if (!match) {
        const error = new Error('Cound not find match!');
        error.statusCode = 404;
        throw error;
      }
      match.team1 = req.body.team1;
      match.team2 = req.body.team2;
      match.date = req.body.date;
      return match.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Match updated', match: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteMatch = (req, res, next) => {
  const id = req.params.id;
  Match.findById(id)
    .then((match) => {
      if (!match) {
        const error = new Error('Cound not find match!');
        error.statusCode = 404;
        throw error;
      }
      return Match.findByIdAndRemove(id);
    })
    .then(() => {
      res.status(200).json({ message: 'Match deleted', id: id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
