require('./config/config'); //Variables de entorno
const router = require("./routes/index"); //Rutas
const bodyParser = require("body-parser");  //Parsear body
const cors = require('cors'); //Cors
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const path = require('path');
const socket = require('./sockets/socket');


//permitir conexiones desde ...
app.use(cors({

        origin: '*'
    }))
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//configuracion de rutas
app.use(router);

//usar publica

app.use(express.static(path.resolve(__dirname, '../public')));
mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) {
        throw err;
    } else {
        console.log('Base de datos ONLINE');
    }



});


io.on("connection", cliente => {
  console.log("Usuario conectado ", cliente.id);
  socket.desconectar(cliente, io);
  socket.mensaje(cliente, io)
  socket.config_user(cliente,io)
  socket.lista_usuarios(cliente, io)
  socket.verificar_token(cliente, io);
  socket.getUsuario(cliente, io)
});

http.listen(process.env.PORT, () => {
    
    console.log('Escuchando puerto: ', process.env.PORT);
});

module.exports = {
    io
}