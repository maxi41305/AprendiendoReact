'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Cliente = require('../models/cliente');

var controller = {

    datosCurso: (req, res) => {
        var hola = req.body.hola;
    
        return res.status(200).send({
            curso: 'Master en Frameworks JS',
            autor: 'Maxii Torales :D',
            url: 'maxiitorales.com',
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de clientes'
        });
    },

    save: (req, res) => {
        // Recoger parametros por post
        var params = req.body;

        // Validar datos (validator)
        try{
            var validate_nombre = !validator.isEmpty(params.nombre);
            var validate_apellido = !validator.isEmpty(params.apellido);

        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if(validate_nombre && validate_apellido){
            
            //Crear el objeto a guardar
            var cliente = new Cliente();

            // Asignar valores
            cliente.nombre = params.nombre;
            cliente.apellido = params.apellido;

            if(params.image){
                cliente.image = params.image;
            }else{
                cliente.image = null;
            }
           
            // Guardar el articulo
            cliente.save((err, clienteStored) => {

                if(err || !clienteStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El cliente no se ha guardado !!!'
                    });
                }

                // Devolver una respuesta 
                return res.status(200).send({
                    status: 'success',
                    cliente: clienteStored
                });

            });

        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos !!!'
            });
        }
       
    },

    getClientes: (req, res) => {

        var query = Cliente.find({});

        var last = req.params.last;
        if(last || last != undefined){
            query.limit(5);
        }

        // Find
        query.sort('-_id').exec((err, clientes) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los clientes !!!'
                });
            }

            if(!clientes){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay clientes para mostrar !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                clientes
            });

        });
    },

    getCliente: (req, res) => {

        // Recoger el id de la url
        var clienteId = req.params.id;
        // Comprobar que existe
        if(!clienteId || clienteId == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el cliente !!!'
            });
        }

        // Buscar el articulo
        Cliente.findById(clienteId, (err, cliente) => {
            
            if(err || !cliente){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el cliente !!!'
                });
            }

            // Devolverlo en json
            return res.status(200).send({
                status: 'success',
                cliente
            });

        });
    },

    update: (req, res) => {
        // Recoger el id del articulo por la url
        var clienteId = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar datos
        try{
            var validate_nombre = !validator.isEmpty(params.nombre);
            var validate_apellido = !validator.isEmpty(params.apellido);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            }); 
        }

        if(validate_nombre && validate_apellido){
             // Find and update
             Cliente.findOneAndUpdate({_id: clienteId}, params, {new:true}, (err, clienteUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar !!!'
                    });
                }

                if(!clienteUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el cliente !!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    cliente: clienteUpdated
                });
             });
        }else{
             // Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta !!!'
            });
        }
       
    },

    delete: (req, res) => {
        // Recoger el id de la url
        var clienteId = req.params.id;

        // Find and delete
        Cliente.findOneAndDelete({_id: clienteId}, (err, clienteRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar !!!'
                });
            }

            if(!clienteRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el cliente, posiblemente no exista !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                cliente: clienteRemoved
            });

        }); 
    },

    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/article.js (hecho)

        // Recoger el fichero de la petición
        var file_name = 'Imagen no subida...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        
                // Conseguir nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        // var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];
        
        console.log(file_path);
     
        // Comprobar la extension, solo imagenes, si es valida borrar el fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            
            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida !!!'
                });
            });
        
        }else{
             // Si todo es valido, sacando id de la url
             var clienteId = req.params.id;

             if(clienteId){
                // Buscar el cliente, asignarle el nombre de la imagen y actualizarlo
                Cliente.findOneAndUpdate({_id: clienteId}, {image: file_name}, {new:true}, (err, clienteUpdated) => {

                    if(err || !clienteUpdated){
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen de cliente !!!'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        cliente: clienteUpdated
                    });
                });
             }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
             }
            
        }   
    }, // end upload file

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe !!!'
                });
            }
        });
    },

    search: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or
        Cliente.find({ "$or": [
            { "nombre": { "$regex": searchString, "$options": "i"}},
            { "apellido": { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, clientes) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición !!!'
                });
            }
            
            if(!clientes || clientes.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busqueda !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                clientes
            });

        });
    }

};  // end controller

module.exports = controller;