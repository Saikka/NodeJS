const express = require('express');

const { body } = require('express-validator/check');

const studentsController = require('../controllers/students');

const router = express.Router();

router.get('/', studentsController.getStudents);

router.post(
  '/add',
  [
    body('firstname').trim().isLength({ min: 3 }),
    body('lastname').trim().isLength({ min: 3 }),
    body('year').trim().isNumeric()
  ],
  studentsController.addStudent
);

router.put(
  '/edit/:id',
  [
    body('firstname').trim().isLength({ min: 3 }),
    body('lastname').trim().isLength({ min: 3 }),
    body('year').trim().isNumeric()
  ],
  studentsController.updateStudent
);

router.delete('/delete/:id', studentsController.deleteStudent);

module.exports = router;
