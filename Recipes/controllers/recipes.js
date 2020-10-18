const path = require('path');
const fs = require('fs');

const { validationResult } = require('express-validator/check');

const Recipe = require('../models/recipe');
const User = require('../models/user');

exports.getRecipes = (req, res, next) => {
    Recipe.find({creator: '5efdbbf774fc192c3402fc1e'}).then(recipes => {
        res.status(200).json({
            message: 'success',
            recipes: recipes
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getAuthRecipes = (req, res, next) => {
    let result;
    if (req.params.userId.toString() === '5efdbbf774fc192c3402fc1e') {
        result = Recipe.find();
    } else {
        result = Recipe.find({ $or: [{creator: req.params.userId}, {creator: '5efdbbf774fc192c3402fc1e'}]})
    } 
    result.then(recipes => {
        const newRecipes = recipes.map(rec => {
            return {...rec._doc, edit: rec.creator.toString() !== '5efdbbf774fc192c3402fc1e' ? true : false};
        })
        res.status(200).json({
            message: 'success',
            recipes: newRecipes
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.createRecipe = (req, res, next) =>  {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path.replace("\\" ,"/");
    const recipe = new Recipe({
        name: req.body.name,
        image: imageUrl,
        difficulty: req.body.difficulty,
        creator: req.userId,
        ingredients: JSON.parse(req.body.ingredients),
        steps: JSON.parse(req.body.steps)
    });
    if (req.body.category == 'null') {
        recipe.category = null;
    } else {
        recipe.category = req.body.category;
    }
    if (req.body.country == 'null') {
        recipe.country = null;
    } else {
        recipe.country = req.body.country;
    }
    recipe.save().then(() => {
        return User.findById(req.userId);
    }).then(user => {
        user.recipes.push(recipe);
        return user.save();
    }).then(() => {
        newRecipe = {...recipe._doc, edit: true};
        res.status(201).json({
            message: 'success',
            recipe: newRecipe
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.updateRecipe = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }
    let imageUrl;
    if (req.file) {
        imageUrl = req.file.path.replace("\\" ,"/");
    }
    const recipeId = req.params.recipeId;
    Recipe.findById(recipeId).then(recipe => {
        if (!recipe) {
            const error = new Error('Cound not find a recipe!');
            error.statusCode = 404;
            throw error;
        }
        if (recipe.creator.toString() !== req.userId.toString()) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        if (imageUrl) {
            if (imageUrl !== recipe.image) {
                clearImage(recipe.image);
            }
            recipe.image = imageUrl;
        }
        recipe.name = req.body.name;
        recipe.difficulty = req.body.difficulty;
        if (req.body.category == 'null') {
            recipe.category = null;
        } else {
            recipe.category = req.body.category;
        }
        if (req.body.country == 'null') {
            recipe.country = null;
        } else {
            recipe.country = req.body.country;
        }
        recipe.ingredients = JSON.parse(req.body.ingredients);
        recipe.steps = JSON.parse(req.body.steps);
        recipe.edit = true;
        return recipe.save();
    }).then(result => {
        res.status(200).json({ message: 'Recipe updated', recipe: result });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.deleteRecipe = (req, res, next) => {
    const recipeId = req.params.recipeId;
    Recipe.findById(recipeId).then(recipe => {
        if (!recipe) {
            const error = new Error('Cound not find a recipe!');
            error.statusCode = 404;
            throw error;
        }
        if (recipe.creator.toString() !== req.userId.toString()) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        clearImage(recipe.image);
        return Recipe.findByIdAndRemove(recipeId);
    }).then(() => {
        return User.findById(req.userId);
    }).then(user => {
        user.recipes.pull(recipeId);
        return user.save();
    }).then(() => {
        res.status(200).json({ message: 'Recipe deleted', id: recipeId });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};