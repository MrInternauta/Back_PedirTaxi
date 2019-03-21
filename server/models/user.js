const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: "{VALUE} don't is type valid."
};
let estadosValidos = {
    values: ['ocupado', 'libre', 'viaje', 'peticion'],
    message: "{VALUE} don't is type valid."

}
let typeValidos = {
    values: ['pasajero', 'conductor'],
    message: "{VALUE} don't is type valid."

}


let Schema = mongoose.Schema;


let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is NECESARIO']
    },
    lastname: {
        type: String,
        required: [true, 'The lastname is NECESARIO']
    },
    phone: {
        type: Number,
        required: [true, 'The phone is NECESARIO']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The email is NECESARIO']
    },
    password: {
        type: String,
        required: [true, 'The password is NECESARIO']
    },
    status: {
        type: String,
        enum: estadosValidos,
        default: 'ocupado'
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    type: {
        type: String,
        default: 'pasajero',
        enum: typeValidos,
    },
    img: {
        type: String,
        required: false
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },

});

userSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


userSchema.plugin(uniqueValidator, { message: '{PATH} should be unique.' });

module.exports = mongoose.model('User', userSchema);