const { validationResult } = require('express-validator/check');

const Category = require('../models/category');
const User = require('../models/user');
const Recipe = require('../models/recipe');
const recipe = require('../models/recipe');

exports.getCategories = (req, res, next) => {
    Category.find({creator: '5efdbbf774fc192c3402fc1e'}).then(categories => {
        res.status(200).json({
            message: 'success',
            categories: categories
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getAuthCategories = (req, res, next) => {
    let result;
    if (req.params.userId.toString() === '5efdbbf774fc192c3402fc1e') {
        result = Category.find();
    } else {
        result = Category.find({ $or: [{creator: req.params.userId}, {creator: '5efdbbf774fc192c3402fc1e'}]})
    }
    result.then(categories => {
        const newCategories = categories.map(cat => {
                return {...cat._doc, edit: cat.creator.toString() !== '5efdbbf774fc192c3402fc1e' ? true : false};
        })
        res.status(200).json({
            message: 'success',
            categories: newCategories
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.createCategory = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }
    const category = new Category({
        name: req.body.name,
        type: req.body.type,
        creator: req.userId 
    });
    category.save().then(() => {
        return User.findById(req.userId);
    }).then(user => {
        user.categories.push(category);
        return user.save();
    }).then(() => {
        res.status(201).json({
            message: 'success',
            category: category
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.updateCategory = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }
    const catId = req.params.catId;
    Category.findById(catId).then(category => {
        if (!category) {
            const error = new Error('Cound not find a category!');
                error.statusCode = 404;
                throw error;
        }
        if (category.creator.toString() !== req.userId.toString()) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        category.name = req.body.name;
        return category.save();
    }).then(result => {
        res.status(200).json({ message: 'Category updated', category: result });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.deleteCategory = (req, res, next) => {
    const catId = req.params.catId;
    Category.findById(catId).then(category => {
        if (!category) {
            const error = new Error('Cound not find a category!');
            error.statusCode = 404;
            throw error;
        }
        if (category.creator.toString() !== req.userId.toString()) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        return Category.findByIdAndRemove(catId);
    }).then(() => {
        return User.findById(req.userId);
    }).then(user => {
        user.categories.pull(catId);
        return user.save();
    }).then(() => {
        return Recipe.find({ $or: [{category: catId}, {country: catId}]});
    }).then(recipes => {
        recipes.map(rec => {
            if (rec.category.toString() === catId) {
                rec.category = null;
            } else {
                rec.country = null;
            }
            rec.save();
        });
    }).then(() => {
        res.status(200).json({ message: 'Category deleted', id: catId });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};