const express = require('express')
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin

let app = express()
let Viaje = require('../models/viaje')
let Usuario = require('../models/user')
    //...::: LISTAR VIAJES :::...
app.get('/viajes/listar', verificar_token.verificacion_token, (req, res) => {
    Viaje.find()
        .exec((err, viajes) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!viajes) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe viaje'
                    }
                })
            }

            Viaje.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    viajes,
                    cuantos: conteo
                })
            })

        })

})

//...::: CREAR VIAJES :::...
app.post('/viajes/crear', [verificar_token.verificacion_token], (req, res) => {
    let body = req.body
    let viaje = new Viaje({
        pasajero: body.pasajero,
        conductor: body.conductor,
        fechainicio: body.fechainicio,
        ubicacion: {
            lat_o: body.lat_o,
            lng_o: body.lng_o,
            lat_d: body.lat_d,
            lng_d: body.lng_d,
        },
        ubicacionOrigenDestino: {
            lat_o: body.ubicacionOrigenDestino.lat_o,
            lng_o: body.ubicacionOrigenDestino.lng_o,
            lat_d: body.ubicacionOrigenDestino.lat_d,
            lng_d: body.ubicacionOrigenDestino.lng_d
        }
    })
    if (!viaje.conductor) {
        //Asignar conductor, viaje.conductor = 

    }

    viaje.save((err, viajedb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!viajedb) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Viaje no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            viaje: viajedb
        });

    })

})

//...::: MOSTRAR VIAJE :::...
app.get('/viajes/mostrar/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo
    let id = req.params.id
    if (tipo !== 'conductor' || tipo !== 'pasajero') {
        return res.status(500).json({
            ok: false,
            err: {
                message: "Tipo de busqueda no valida."
            }
        });
    }
    Viaje.findOne({
        tipo: id
    }, ((err, viajedb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!viajedb) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "No se encontro el viaje"
                }
            });
        }
        res.json({
            ok: true,
            viaje: viajedb
        })
    }))
})



//...::: ACTUALIZAR VIAJE :::...
app.put('/viajes/actualizar/:tipo/:id', [verificar_token.verificacion_token], (req, res) => {
    let tipo = req.params.tipo;
    if (tipo !== 'conductor' || tipo !== 'pasajero') {
        return res.status(500).json({
            ok: false,
            err: {
                message: "Tipo de busqueda no valida."
            }
        });
    }
    let viaje_id = req.params.id;
    let body = req.body;
    let nuevo = {
        conductor: body.conductor,
        estado: body.estado,
        ubicacion: {
            lat_o: body.lat_o,
            lng_o: body.lng_o,
            lat_d: body.lat_d,
            lng_d: body.lng_d
        },
        ubicacionOrigenDestino: {
            lat_o: body.ubicacionOrigenDestino.lat_o,
            lng_o: body.ubicacionOrigenDestino.lng_o,
            lat_d: body.ubicacionOrigenDestino.lat_d,
            lng_d: body.ubicacionOrigenDestino.lng_d
        }
    };
    //No permite que el conductor pueda manipular el origen/ destino
    if (tipo === 'conductor') {
        nuevo.ubicacionOrigenDestino = null;
    }
    //Verifica si estan terminado o cancelando el viaje
    if (nuevo.estado === 'cancelado' || nuevo.estado === 'terminado') {
        nuevo.fechafin = new Date();
    }
    //Verifica si el viaje requiere ser cambiado
    if (nuevo.estado !== 'terminado' && nuevo.estado === 'cambiar' && nuevo.estado !== "curso") {
        //Verifica si no existe cambio
        if (!nuevo.conductor) {
            //Asignar conductor, viaje.conductor = 


        }
        nuevo.estado = 'asignado'
            //Asignar precio viaje.precio = (Calcular precio)
    } else {
        return res.status(500).json({
            ok: false,
            err: {
                message: "Viaje no puede ser actualizado por que ya fue terminado o esta en curso."
            }
        });
    }


    Viaje.findOneAndUpdate({
        tipo: viaje_id
    }, nuevo, {
        new: true,
        runValidators: true
    }, (err, viajedb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!viajedb) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Viaje no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            viaje: viajedb
        })
    })
})



//...::: ELIMINAR VIAJE POR usuario :::...
app.delete('/viajes/borrar/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id
    if (tipo !== 'conductor' || tipo !== 'pasajero') {
        return res.status(500).json({
            ok: false,
            err: {
                message: "Tipo de busqueda no valida."
            }
        });
    }
    Viaje.findOneAndRemove({
        tipo: id
    }, (err, viajedb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!viajedb) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Viaje no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            viaje: viajedb
        })

    })


})


module.exports = app