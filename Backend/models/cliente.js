'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClienteSchema = Schema({
    nombre: String,
    apellido: String,
    date: { type: Date, default: Date.now },
    image: String
});

module.exports = mongoose.model('Cliente', ClienteSchema);
// articles --> guarda documentos de este tipo y con estructura dentro de la colección