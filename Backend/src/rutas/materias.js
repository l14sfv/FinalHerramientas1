const express = require('express');
const router = express.Router();
const materias = require('../controladores/materias');
const autenticacion = require('../middleware/autenticacion');
const requerirRol = require('../middleware/roles');

router.get('/', materias.listar);
router.post('/', autenticacion, requerirRol('ADMIN', 'TUTOR'), materias.crear);

module.exports = router;
