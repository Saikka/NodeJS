const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  classroom: {
    type: String,
    required: true
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model('Teacher', teacherSchema);
