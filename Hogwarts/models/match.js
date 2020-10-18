const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
  team1: {
    house: {
      type: Schema.Types.ObjectId,
      ref: 'House'
    },
    score: {
      type: Number
    }
  },
  team2: {
    house: {
      type: Schema.Types.ObjectId,
      ref: 'House'
    },
    score: {
      type: Number
    }
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Match', matchSchema);
