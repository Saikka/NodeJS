const path = require('path');
const fs = require('fs');

const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');

const Student = require('../models/student');
const User = require('../models/user');

exports.getStudents = (req, res, next) => {
  Student.find()
    .then((students) => {
      res.status(200).json({
        message: 'success',
        students: students
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addStudent = (req, res, next) => {
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
    lastname.substring(0, 3) + '.' + firstname.substring(0, 3) + '.' + 's';
  const password = firstname.substring(0, 3) + lastname.substring(0, 3);
  const student = Student({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    house: req.body.house,
    year: req.body.year,
    image: imageUrl
  });
  student
    .save()
    .then((result) => {
      id = result._id;
      return bcrypt.hash(password, 12);
    })
    .then((hashed) => {
      const user = User({
        login: login,
        password: hashed,
        student: id,
        rights: {
          news: false,
          quidditch: false,
          teachers: false,
          students: false
        }
      });
      return user.save();
    })
    .then(() => {
      res.status(201).json({ message: 'Student added', student: student });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateStudent = (req, res, next) => {
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
  Student.findById(id)
    .then((student) => {
      if (!student) {
        const error = new Error('Cound not find a student!');
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl) {
        if (imageUrl !== student.image) {
          clearImage(student.image);
        }
        student.image = imageUrl;
      }
      student.firstname = req.body.firstname;
      student.lastname = req.body.lastname;
      student.house = req.body.house;
      student.year = req.body.year;
      return student.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Student updated', student: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteStudent = (req, res, next) => {
  const id = req.params.id;
  Student.findById(id)
    .then((student) => {
      if (!student) {
        const error = new Error('Cound not find a student!');
        error.statusCode = 404;
        throw error;
      }
      clearImage(student.image);
      return Student.findByIdAndRemove(id);
    })
    .then(() => {
      return User.findOne({ student: id });
    })
    .then((user) => {
      return User.findByIdAndRemove(user._id);
    })
    .then(() => {
      res.status(200).json({ message: 'Student deleted', id: id });
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
