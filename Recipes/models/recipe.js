const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    difficulty: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ingredients: [{
        type: Object
    }],
    steps: [{
        type: Object
    }]
});

module.exports = mongoose.model('Recipe', recipeSchema);