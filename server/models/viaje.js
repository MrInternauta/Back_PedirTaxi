const mongoose = require('mongoose');




let estadosValidos = {
    values: ['peticion', 'asignado', 'cambiar', 'cancelado', 'curso', 'terminado'],
    message: "{VALUE} don't is type valid."

}
let Schema = mongoose.Schema;


let viajesSchema = new Schema({
    conductor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    pasajero: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    fechainicio: {
        type: Date,
        default: Date.now,
        required: [true, 'La fecha de inicio es necesaria']
    },
    fechafin: {
        type: Date,
        //default: Date.now,
        required: [false, 'La fecha de fin es necesaria']
    },
    precio: {
        type: Number,
        required: [false, 'El precio es necesario']
    },
    estado: {
        type: String,
        default: 'peticion',
        enum: estadosValidos
    },
    ubicacionOrigenDestino: {
        lat_o: {
            type: Number,
            required: true
        },
        lng_o: {
            type: Number,
            required: true
        },
        lat_d: {
            type: Number,
            required: true
        },
        lng_d: {
            type: Number,
            required: true
        },
    },
    ubicacion: {
        lat_o: {
            type: Number,
            required: true
        },
        lng_o: {
            type: Number,
            required: true
        },
        lat_d: {
            type: Number,
            required: true
        },
        lng_d: {
            type: Number,
            required: true
        }
    }

});







module.exports = mongoose.model('Viaje', viajesSchema);