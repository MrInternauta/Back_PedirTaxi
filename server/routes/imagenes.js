const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin
const verificar_token_img = require('../middlewares/autenticacion').verificacion_token_img

app.get('/imagen/:tipo/:img', verificar_token_img, (req, res) => {
    let tipo = req.params.tipo
    let img = req.params.img
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noimagepath = path.resolve(__dirname, '../assets/no-image.jpg')
        res.sendFile(noimagepath)
    }

    //res.sendFile('./'+pathImg)

})
module.exports = app;