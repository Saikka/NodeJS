const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  house: {
    type: Schema.Types.ObjectId,
    ref: 'House'
  },
  course: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Student', studentSchema);
