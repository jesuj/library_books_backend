const {Schema, model} = require('mongoose');

const BookSchema = new Schema({
    title: {
        type: String,
        required: [ true, 'El titulo es obligatorio']
    },
    score: {
        type: Number,
        default: 0,
        required: [ true, 'La calificacion es obligatorio']
    },
    file: {
        type: String,
        required: [ true, 'El link del pdf es obligatorio']
    },
    id_file: {
        type: String,
        default: '',
    },
    img: {
        type: String,
        required: [ true, 'El link del img es obligatorio']
    },
    id_img: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        required: [ true, 'El nombre es obligatorio']
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: "Category",
        default: [],
    }],
})

module.exports = model('Book', BookSchema);