const express = require('express');
const router = express.Router();
const materias = require('../controladores/materias');
const verificarToken = require('../middleware/autenticacion');
const requerirRol = require('../middleware/roles');

router.get('/', materias.listar);
router.get('/:id', materias.obtenerPorId);
router.get('/:id/tutores', materias.obtenerTutores);

router.post('/', verificarToken, requerirRol('ADMIN', 'TUTOR'), materias.crear);
router.put('/:id', verificarToken, requerirRol('ADMIN', 'TUTOR'), materias.actualizar);
router.delete('/:id', verificarToken, requerirRol('ADMIN'), materias.eliminar);

module.exports = router;
