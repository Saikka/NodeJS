const express = require('express');

const { body } = require('express-validator/check');

const teachersController = require('../controllers/teachers');

const router = express.Router();

router.get('/', teachersController.getTeachers);

router.post(
  '/add-teacher',
  [
    body('firstname').trim().isLength({ min: 3 }),
    body('lastname').trim().isLength({ min: 3 }),
    body('classroom').trim().isNumeric()
  ],
  teachersController.addTeacher
);

module.exports = router;
