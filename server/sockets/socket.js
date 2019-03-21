const usuarios_conectados = require("../classes/usuario-lista");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/user");
const Mensaje = require('../models/mensaje');

//  const conectar_cliente = (cliente, io) => {
//     usuarios_conectados.agregar({
//       id: cliente.id,
//       nombre: "sin-nombre",
//       sala: "sin-sala"
//     });

// }
//Maneja cuando un usuario se desconecta
const desconectar = (cliente, io) => {
    //cuando un usuario se desconecta
    cliente.on('disconnect', () => {
        //imprime 
        usuarios_conectados.borrarUsuario(cliente.id);
        io.emit("usuarios-activos", usuarios_conectados.getLista());

    })
}


//escuchar mensajes
const mensaje = (cliente, io) => {

    //cuando el cliente emmite el evento mensaje
    cliente.on('mensaje', (payload) => {
        //imprime el mensaje

        console.log('Mensaje recibido: ', payload);
        if (payload.para && payload.para !== cliente.id) {
            const de = usuarios_conectados.getUsuario_xnombre(payload.de);
            const para = usuarios_conectados.getUsuario_xnombre(payload.para);
            if (de && para) {
                Usuario.find({ $or: [{ _id: payload.de }, { _id: payload.para }] }, (err, usuariodb) => {
                    if (usuariodb) {
                        const mensaje = new Mensaje({
                            cuerpo: payload.cuerpo,
                            de: payload.de,
                            para: payload.para,
                            fecha: payload.fecha
                        });
                        mensaje.save((err, mensaje) => {
                            if (err) {
                                console.log("Err", err);
                            }
                            if (mensaje) {
                                payload.de = usuariodb[0]._doc;
                                payload.para = usuariodb[1]._doc;

                                // console.log("ENVIADO DE", payload.de._id);
                                // console.log("ENVIADO PARA", payload.para._id);
                                io.in(de.id).emit('mensaje-privado', payload);
                                io.in(para.id).emit("mensaje-privado", payload);


                                // Usuario.findById(payload.para, (err, usuariodb2) => {
                                //     if (usuariodb2) {
                                //         payload.de = usuariodb._doc;
                                //         payload.para = usuariodb2._doc;
                                //         console.log("ENVIADO DE", payload.de._id);
                                //         console.log("ENVIADO PARA", payload.para._id);
                                //         io.in(de.id).emit('mensaje-privado', payload);
                                //         io.in(para.id).emit("mensaje-privado", payload);
                                //     }
                                // })

                            }
                        });
                    }
                })


            }

        } else {
            Usuario.findById(payload.de, (err, usuariodb) => {
                if (usuariodb) {
                    const mensaje = new Mensaje({
                        cuerpo: payload.cuerpo,
                        de: payload.de,
                        fecha: payload.fecha
                    });
                    payload.de = usuariodb._doc;
                    mensaje.save((err, mensaje) => {
                        if (err) {
                            console.log("Err", err);
                        }
                        if (mensaje) {
                            io.emit("mensaje-nuevo", payload);
                        }

                    });
                }
            });


        }
    })
}


const config_user = (cliente, io) => {
    cliente.on("configurar-usuario", (payload, callback) => {
        const usuario = usuarios_conectados.getUsuario_xnombre(payload.nombre);
        if (!usuario) {
            Usuario.findById(payload.nombre, (err, usersb) => {
                if (err) {}
                if (usersb) {
                    usuarios_conectados.agregar({
                        id: cliente.id,
                        nombre: payload.nombre,
                        sala: "sin-sala",
                        usuario: usersb._doc
                    });
                    io.emit("usuarios-activos", usuarios_conectados.getLista());

                    callback({
                        ok: true,
                        mensaje: "Cliente " + payload.nombre + " configurado"
                    })
                }

            })
        }



    });

}

const verificar_token = (cliente, io) => {
    cliente.on('verificar-token', (payload, callback) => {
        jwt.verify(payload, process.env.SEED, (err, decoded) => {
            if (err) {
                callback({ ok: false });
            } else {
                callback({ ok: true });

            }
        });
    })
};
const getUsuario = (cliente, io) => {
    cliente.on('usuario-profile', (payload) => {
        let id = payload
        Usuario.findById(id, ((err, usuarioDB) => {
            if (err) {
                io.to(cliente.id).emit('usuario-profile', false);
            }
            if (!usuarioDB) {
                io.to(cliente.id).emit("usuario-profile", false);
            }
            if (usuarioDB) {
                io.to(cliente.id).emit("usuario-profile", usuarioDB);
            }

        }))

    })
};

const lista_usuarios = (cliente, io) => {
    cliente.on("obtener-usuarios", () => {
        io.to(cliente.id).emit("usuarios-activos", usuarios_conectados.getLista());
    });
};

module.exports = {
    desconectar,
    mensaje,
    config_user,
    lista_usuarios,
    verificar_token,
    getUsuario,
};