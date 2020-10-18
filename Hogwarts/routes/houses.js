const express = require('express');

const housesController = require('../controllers/houses');

const router = express.Router();

router.get('/names', housesController.getHousesNames);

module.exports = router;
