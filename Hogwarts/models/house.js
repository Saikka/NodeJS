const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const houseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  head: {
    type: String,
    required: true
  },
  ghost: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model('House', houseSchema);
