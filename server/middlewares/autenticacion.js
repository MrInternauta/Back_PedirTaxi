const jwt = require('jsonwebtoken')
const Usuario = require('../models/user');

//verificar token

let verificacion_token = (req, res, next) => {
    let token = req.get('token')

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }


        req.usuario = decoded.usuario
            //que siga con la ejecucion

        next()
    })



}



let verificaradmin = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.role === "ADMIN_ROLE") {
        next()

    } else {
        if (usuario._id === req.params.id) {
            next()
        } else {
            res.json({
                ok: false,
                err: {
                    message: 'El usuario no tiene derecho'
                }
            })
        }


    }


}

//verificar token por url img
let verificacion_token_img = (req, res, next) => {
    let token = req.query.token
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }


        req.usuario = decoded.usuario
            //que siga con la ejecucion

        next()
    })
}
module.exports = {
    verificacion_token,
    verificaradmin,
    verificacion_token_img
}