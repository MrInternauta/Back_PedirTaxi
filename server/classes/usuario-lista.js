const Usuario = require("../models/user");
const _ = require("underscore");

let lista = [];

    // Agregar un usuario
     const agregar = (usuario) =>{

        lista.push(usuario);
        
        return usuario
    }

     const actualizarNombre = (id, nombre) =>{

        for (let usuario of lista) {

            if (usuario.id === id) {
                usuario.nombre = nombre;
                break;
            }

        }


        console.log('===== Actualizando usuario ====');
        console.log(lista);

    }

    // Obtener lista de usuarios
    const getLista = () =>{ return lista.filter(usuario => usuario.nombre !== 'sin-nombre') }

    // Obtener un usuario
    const getUsuario = (id) => {

        return lista.find(usuario => usuario.id === id);

    }
        const getUsuario_xnombre = (nombre) => {

            return lista.find(usuario => usuario.nombre === nombre);

        }

    // Obtener usuario en una sala en particular
    const getUsuariosEnSala = (sala) => {

        return lista.filter(usuario => usuario.sala === sala);

    }

    // Borrar Usuario
    const borrarUsuario = (id) => {

        const tempUsuario = getUsuario(id);

        lista = lista.filter(usuario => usuario.id !== id);

        return tempUsuario;

    }


module.exports = {
agregar,
actualizarNombre,
getLista,
getUsuario,
getUsuariosEnSala,
borrarUsuario,
    getUsuario_xnombre
}