const path = require('path');
const fs = require('fs');

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
  const login =
    lastname.substring(0, 3) + '.' + firstname.substring(0, 3) + '.' + 't';
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
      res.status(201).json({ message: 'Teacher added', teacher: teacher });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateTeacher = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    throw error;
  }
  let imageUrl;
  if (req.file) {
    imageUrl = req.file.path.replace('\\', '/');
  }
  const id = req.params.id;
  Teacher.findById(id)
    .then((teacher) => {
      if (!teacher) {
        const error = new Error('Cound not find a teacher!');
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl) {
        if (imageUrl !== teacher.image) {
          clearImage(teacher.image);
        }
        teacher.image = imageUrl;
      }
      teacher.firstname = req.body.firstname;
      teacher.lastname = req.body.lastname;
      teacher.subject = req.body.subject;
      teacher.classroom = req.body.classroom;
      return teacher.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Teacher updated', teacher: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteTeacher = (req, res, next) => {
  const id = req.params.id;
  Teacher.findById(id)
    .then((teacher) => {
      if (!teacher) {
        const error = new Error('Cound not find a recipe!');
        error.statusCode = 404;
        throw error;
      }
      clearImage(teacher.image);
      return Teacher.findByIdAndRemove(id);
    })
    .then(() => {
      return User.findOne({ teacher: id });
    })
    .then((user) => {
      return User.findByIdAndRemove(user._id);
    })
    .then(() => {
      res.status(200).json({ message: 'Teacher deleted', id: id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
