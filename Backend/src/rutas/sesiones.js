const express = require('express');
const router = express.Router();
const sesiones = require('../controladores/sesiones');
const autenticacion = require('../middleware/autenticacion');

router.use(autenticacion);

router.post('/', sesiones.crear);
router.get('/mine', sesiones.misSesiones);
router.patch('/:id/status', sesiones.actualizarEstado);

module.exports = router;
