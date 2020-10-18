const { validationResult } = require('express-validator/check');

const Score = require('../models/score');

exports.getIndex = (req, res, next) => {
    Score.find()
        .then(scores => {
            res.render('scoreboard', {
                pageTitle: 'Scoreboard',
                scores: scores,
                sort: 'desc',
                score: {
                    name: '',
                    score: ''
                },
                errorMessage: null
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postAddProduct = (req, res, next) => {
    const name = req.body.name;
    const scre = req.body.score;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return Score.find()
        .then(scores => {
            return res.render('scoreboard', {
                pageTitle: 'Scoreboard',
                scores: scores,
                sort: 'desc',
                score: {
                    name: name,
                    score: scre
                },
                errorMessage: errors.array()[0].msg
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    };
    const score = new Score({
        name: req.body.name, 
        score: req.body.score});
    score.save()
    .then(() => {
      res.redirect('/');
    }).catch(
      err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postSort = (req, res, next) => {
    Score.find()
        .then(scores => {
            let sort = 'asc';
            let newScores;
            if (req.body.sort === 'desc') {
                newScores = scores.sort((a, b) => (a.score > b.score) ? 1 : -1);
            } else {
                newScores = scores.sort((a, b) => (a.score <= b.score) ? 1 : -1);
                sort = 'desc';
            }
            res.render('scoreboard', {
                pageTitle: 'Scoreboard',
                scores: newScores,
                sort: sort,
                score: {
                    name: '',
                    score: ''
                },
                errorMessage: null
            });
        })
        .catch(
            err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
          });
}