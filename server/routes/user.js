const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');
let Vehiculo = require('../models/vehiculo')

const Usuario = require('../models/user');
const UsuarioUbicacion = require('../models/user_ubication');
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin
const app = express();
// ------------------ USUARIO ------------------------
//...::: OBTENER USUARIOS PAGINADOS DEL 1 AL 5 :::...
app.get('/usuario/listar', [verificar_token.verificacion_token, verificaradmin], function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find()
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
        });
});

//...::: OBTENER USUARIO POR ID :::...
app.get('/usuario/mostar/:id', [verificar_token.verificacion_token, verificaradmin], (req, res) => {
    let id = req.params.id
    Usuario.findById(id, ((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    }))
})

//...::: CREAR USUARIO :::...
app.post('/usuario/crear', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        name: body.nombre,
        lastname: body.apellido,
        type: body.type,
        email: body.email,
        phone: body.telefono,
        password: bcrypt.hashSync(body.password, 10),
        // role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

//...::: CAMBIAR USUARIO POR ID (del usuario):::...
app.put('/usuario/actualizar/:id', [verificar_token.verificacion_token], function(req, res) {
    let id = req.params.id;
    let body = req.body
    let actual = {
        name: body.nombre,
        lastname: body.apellido,
        phone: body.telefono,
        status: body.estado,
    }
    Usuario.findByIdAndUpdate(id, actual, {
        new: true,
        runValidators: true
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});

// ------------ UBICACION ---------------

//...::: OBTENER USUARIOSUBICACION PAGINADOS DEL 1 AL 5 :::...
app.get('/usuario/ubicacion/listar', [verificar_token.verificacion_token, verificaradmin], function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    UsuarioUbicacion.find()
        .skip(desde)
        .limit(limite)
        .populate('user')
        //.populate('estado', 'usuario')
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            UsuarioUbicacion.count({
                estado: true
            }, (err, conteo) => {
                res.json({
                    ok: true,
                    ubicacion: usuarios,
                    cuantos: conteo
                });
            });
        });
});


//...::: CREAR UBICACION DEL USUARIO POR ID (del usuario):::...
app.post('/usuario/ubicacion/crear/:id', [verificar_token.verificacion_token, verificaradmin], function(req, res) {
    let id = req.params.id;
    let body = req.body;
    let ubicacion = new UsuarioUbicacion({
        lat: body.lat,
        lng: body.lng,
        user: id
    });
    ubicacion.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

//...::: CAMBIAR UBICACION DEL USUARIO POR ID (del usuario):::...
app.put('/usuario/ubicacion/actualizar/:id', [verificar_token.verificacion_token, verificaradmin], function(req, res) {
    let id = req.params.id;
    let body = req.body;
    UsuarioUbicacion.findOneAndUpdate({
        user: id
    }, {
        lat: body.lat,
        lng: body.lng,
    }, {
        new: true,
        runValidators: true
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            ubicacion: usuarioDB
        });
    })
});

//...::: BORRAR  USUARIO POR ID (del usuario):::...
app.delete('/usuario/borrar/:id', [verificar_token.verificacion_token, verificaradmin], function(req, res) {
    let id = req.params.id;

    Usuario.findByIdAndRemove(
        id, (err, usuarioBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                });
            }


            UsuarioUbicacion.findOneAndRemove({
                user: id
            }, (err2, ubicacionB) => {
                if (err2) {
                    return res.status(400).json({
                        ok: false,
                        err: err2
                    });
                }

                if (!ubicacionB) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Usuario-Ubicacion no encontrado'
                        }
                    });
                }
                if (usuarioBorrado.type == "conductor") {
                    Vehiculo.findOneAndRemove({
                        user: id
                    }, (err3, vehiculoB) => {
                        if (err3) {
                            return res.status(400).json({
                                ok: false,
                                err: err3
                            });
                        }
                        if (!vehiculoB) {
                            return res.status(400).json({
                                ok: false,
                                err: {
                                    message: 'Vehiculo no encontrado'
                                }
                            });
                        }
                        return res.json({
                            ok: true,
                            usuario: usuarioBorrado,
                            ubicacion: ubicacionB,
                            vehiculo: vehiculoB
                        })

                    })
                }

                res.json({
                    ok: true,
                    usuario: usuarioBorrado,
                    ubicacion: ubicacionB,
                });



            })
        });
});




module.exports = app;