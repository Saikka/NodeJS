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
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    recipes: [{
        type: Schema.Types.ObjectId,
        ref: 'Recipe'
    }]
});

module.exports = mongoose.model('User', userSchema);