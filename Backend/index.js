'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ventasmaxi', { useNewUrlParser: true })
        .then(() => {
            console.log('Conexión a la base de datos correctamente M.T!!!');

          //Crear servidor y ponerme a escuchar peticiones HTTP
          app.listen(port, () => {
                console.log('Servidor corriendo en http://localhost:'+port);
            });

        });