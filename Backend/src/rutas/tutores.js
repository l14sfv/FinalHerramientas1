const express = require('express');
const router = express.Router();
const tutores = require('../controladores/tutores');
const verificarToken = require('../middleware/autenticacion');
const requerirRol = require('../middleware/roles');

router.get('/', tutores.listar);
router.get('/:id', tutores.obtenerPorId);
router.post('/:id/subjects', verificarToken, requerirRol('ADMIN', 'TUTOR'), tutores.asignarMateria);
router.delete('/:id/subjects/:subjectId', verificarToken, requerirRol('ADMIN', 'TUTOR'), tutores.removerMateria);

module.exports = router;
