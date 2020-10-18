const express = require('express');
const { body } = require('express-validator/check');

const recipesController = require('../controllers/recipes');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/recipes', recipesController.getRecipes);

router.get('/recipes/:userId', recipesController.getAuthRecipes);

router.post('/recipe', isAuth, 
    [
          body('name').trim().isLength({min: 3})
    ],
    recipesController.createRecipe
);

router.put('/recipe/:recipeId', isAuth,    
    [
        body('name').trim().isLength({min: 3})
    ], 
    recipesController.updateRecipe
);

router.delete('/recipe/:recipeId', isAuth, recipesController.deleteRecipe);

module.exports = router;