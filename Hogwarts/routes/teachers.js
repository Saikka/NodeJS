const express = require('express');

const { body } = require('express-validator/check');

const teachersController = require('../controllers/teachers');

const router = express.Router();

router.get('/', teachersController.getTeachers);

router.post(
  '/add',
  [
    body('firstname').trim().isLength({ min: 3 }),
    body('lastname').trim().isLength({ min: 3 }),
    body('classroom').trim().isNumeric()
  ],
  teachersController.addTeacher
);

router.put(
  '/edit/:id',
  [
    body('firstname').trim().isLength({ min: 3 }),
    body('lastname').trim().isLength({ min: 3 }),
    body('classroom').trim().isNumeric()
  ],
  teachersController.updateTeacher
);

router.delete('/delete/:id', teachersController.deleteTeacher);

module.exports = router;
