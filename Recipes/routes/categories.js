const express = require('express');

const { body } = require('express-validator/check');

const categoriesController = require('../controllers/categories');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/categories', categoriesController.getCategories);

router.get('/categories/:userId', categoriesController.getAuthCategories);

router.post('/category', isAuth,
    [
        body('name').trim().isLength({min: 3})
    ],
    categoriesController.createCategory
);

router.put('/category/:catId', isAuth,
    [
        body('name').trim().isLength({min: 3})
    ],
    categoriesController.updateCategory
);

router.delete('/category/:catId', isAuth, categoriesController.deleteCategory);

module.exports = router;