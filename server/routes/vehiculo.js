const express = require('express')
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin

let app = express()
let Vehiculo = require('../models/vehiculo')

//...::: LISTAR VEHICULOS :::...
app.get('/vehiculo/listar', [verificar_token.verificacion_token, verificaradmin], (req, res) => {
    Vehiculo.find()
        .exec((err, vehiculo) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!vehiculo) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe vehiculo'
                    }
                })
            }

            Vehiculo.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    vehiculo,
                    cuantos: conteo
                })
            })

        })
})

//...::: CREAR VEHICULO :::...
app.post('/vehiculo/crear', [verificar_token.verificacion_token], (req, res) => {
    let body = req.body
    let vehiculo = new Vehiculo({
        marca: body.marca,
        modelo: body.modelo,
        placas: body.placas,
        descripcion: body.descripcion,
        user: body.usuario
    })

    vehiculo.save((err, vehiculodb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!vehiculodb) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            vehiculo: vehiculodb
        });

    })
})

//...::: LISTAR VEHICULO POR ID (VEHICULO) :::...
app.get('/vehiculo/mostrar/:id', [verificar_token.verificacion_token], (req, res) => {
    let id = req.params.id
    Vehiculo.findOne({ user: id }, ((err, productobd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productobd) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Vehiculo no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            vehiculo: productobd
        })
    }))

})

//...::: ACTUALIZAR VEHICULO POR ID (VEHICULO) :::...
app.put('/vehiculo/actualizar/:id', [verificar_token.verificacion_token], (req, res) => {
    let id = req.params.id
    let body = req.body
    let nuevo = {
        marca: body.marca,
        modelo: body.modelo,
        descripcion: body.descripcion,
    }
    Vehiculo.findOneAndUpdate({ user: id }, nuevo, {
        new: true,
        runValidators: true
    }, (err, vehiculodb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!vehiculodb) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            vehiculo: vehiculodb
        })
    })


})

//...::: ACTUALIZAR VEHICULO POR ID (VEHICULO) :::...
app.delete('/vehiculo/borrar/:id', [verificar_token.verificacion_token], (req, res) => {
    let id = req.params.id
    Vehiculo.findOneAndRemove({ user: id }, (err, vehiculodb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!vehiculodb) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "vehiculo no encontrado."
                }
            });
        }
        res.json({
            ok: true,
            vehiculo: vehiculodb
        })

    })


})



module.exports = app