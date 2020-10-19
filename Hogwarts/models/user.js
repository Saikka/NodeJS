const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  rights: {
    news: Boolean,
    quidditch: Boolean,
    teachers: Boolean,
    students: Boolean
  }
});

module.exports = mongoose.model('User', userSchema);
