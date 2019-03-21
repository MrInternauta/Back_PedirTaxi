const express = require('express');
const app = express();


app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./vehiculo'));
app.use(require('./viaje'));
app.use(require("./mensaje"));
app.use(require('./upload'));
app.use(require('./imagenes'));


module.exports = app;