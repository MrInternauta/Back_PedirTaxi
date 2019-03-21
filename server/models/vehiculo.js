const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');





let Schema = mongoose.Schema;


let vehiculoSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripcion es necesaria']
    },
    modelo: {
        type: String,
        required: [true, 'El modelo es necesario']
    },
    marca: {
        type: String,
        required: [true, 'La marca es necesaria']
    },
    placas: {
        type: String,
        unique: true,
        required: [true, 'La placa es necesaria']
    },
    img: {
        type: String,
        required: false
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

});




vehiculoSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});


module.exports = mongoose.model('Vehiculo', vehiculoSchema);