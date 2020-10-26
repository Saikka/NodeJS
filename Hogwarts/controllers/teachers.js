const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');

const Teacher = require('../models/teacher');
const User = require('../models/user');

exports.getTeachers = (req, res, next) => {
  Teacher.find()
    .then((teachers) => {
      res.status(200).json({
        message: 'success',
        teachers: teachers
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addTeacher = (req, res, next) => {
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
  let id;
  const imageUrl = req.file.path.replace('\\', '/');
  const firstname = req.body.firstname.toLowerCase();
  const lastname = req.body.lastname.toLowerCase();
  const login = lastname + '.' + 't';
  const password = firstname.substring(0, 3) + lastname.substring(0, 3);
  const teacher = Teacher({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    subject: req.body.subject,
    classroom: req.body.classroom,
    image: imageUrl
  });
  teacher
    .save()
    .then((result) => {
      id = result._id;
      return bcrypt.hash(password, 12);
    })
    .then((hashed) => {
      const user = User({
        login: login,
        password: hashed,
        teacher: id,
        rights: {
          news: true,
          quidditch: true,
          teachers: false,
          students: false
        }
      });
      return user.save();
    })
    .then(() => {
      res.status(201).json({ message: 'Teacher added' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
