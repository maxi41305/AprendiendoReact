'use strict'

var express = require('express');
var ClienteController = require('../controllers/cliente');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/articles'});

// Rutas de prueba
router.post('/datos-curso', ClienteController.datosCurso);
router.get('/test-de-controlador', ClienteController.test);

// Rutas útiles
router.post('/savecliente', ClienteController.save);
router.get('/clientes/:last?', ClienteController.getClientes);
router.get('/cliente/:id', ClienteController.getCliente);
router.put('/cliente/:id', ClienteController.update);
router.delete('/cliente/:id', ClienteController.delete);
router.post('/upload-image-cliente/:id?', md_upload, ClienteController.upload);
router.get('/get-image-cliente/:image', ClienteController.getImage);
router.get('/searchcliente/:search', ClienteController.search);

module.exports = router;