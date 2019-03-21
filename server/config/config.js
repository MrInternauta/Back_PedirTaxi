// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 5000;


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ============================
//  Vencimiento del token
// ============================
//segundo * mitutos * horas * dias
process.env.CADUCIDAD_TOKEN = '48h'

// ============================
//  SEED de autenticacion
// ============================
process.env.SEED = process.env.SEED || 'secret-token-DES'



// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/GeTaxi';
} else {
    urlDB = process.env.MONGOURL
}

process.env.URLDB = urlDB

// ============================
//  Google Client ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '559464125748-p2c3dc0et3bao67i8oso8nhiagjg22nk.apps.googleusercontent.com'