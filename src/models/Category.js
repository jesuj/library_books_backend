const {Schema, model} = require('mongoose');

const CategorySchema = new Schema({
    name: {
        type: String,
        required: [ true, 'El nombre es obligatorio']
    },
    description: {
        type: String,
    },
})

module.exports = model('Category', CategorySchema);