const express = require('express');

const teacherController = require('../controllers/teacher');

const router = express.Router();

router.post('/add-teacher', teacherController.addTeacher);

module.exports = router;
