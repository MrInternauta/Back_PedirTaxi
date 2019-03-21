const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/user');

const app = express();



app.post('/login', (req, res) => {
        let body = req.body;
        Usuario.findOne({ email: body.email }, (err, usuariodb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            if (!usuariodb) {
                return res.status(500).json({
                    ok: false,
                    message: 'Usuario o contraseña incorrectos'
                });
            }
            if (!bcrypt.compareSync(body.password, usuariodb.password)) {
                return res.status(500).json({
                    ok: false,
                    message: 'Usuario o contraseña incorrectos'
                });
            }
            let token = jwt.sign({
                    usuario: usuariodb,

                },
                process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                }
            )

            res.json({
                ok: true,
                usuario: usuariodb,
                token
            })


        })
    })
    //CONFIG GOOGLE
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}



app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                error: {
                    message: 'Error en verificar google',
                    e
                }
            });
        });


    Usuario.findOne({
        email: googleUser.email
    }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'Error en busqueda bd ',
                    err
                }
            });
        };

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });

            }

        } else {
            // Si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        error: {
                            message: 'Error en busqueda bd ',
                            err
                        }
                    });
                };

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });


            });

        }


    });


});


module.exports = app;