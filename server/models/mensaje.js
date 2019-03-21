const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');





let Schema = mongoose.Schema;


let mensajesSchema = new Schema({
    cuerpo: {
        type: String,
        required: [true, "La descripcion es necesaria"]
    },
    img: {
        type: String,
        required: false
    },

    de: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    para: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    fecha: {
        type: Date,
        required: true,
    }

});




mensajesSchema.plugin(uniqueValidator, {
    message: "{PATH} debe de ser único"
});


module.exports = mongoose.model("Mensaje", mensajesSchema);