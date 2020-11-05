const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  house: {
    type: Schema.Types.ObjectId,
    ref: 'House'
  },
  year: {
    type: Number,
    required: true
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model('Student', studentSchema);
