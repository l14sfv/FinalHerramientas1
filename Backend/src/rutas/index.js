const express = require('express');
const router = express.Router();

const rutasAutenticacion = require('./autenticacion');
const rutasMaterias = require('./materias');
const rutasTutores = require('./tutores');
const rutasSesiones = require('./sesiones');
const salud = require('../controladores/salud');

router.get('/health', salud.estado);
router.use('/auth', rutasAutenticacion);
router.use('/subjects', rutasMaterias);
router.use('/tutors', rutasTutores);
router.use('/sessions', rutasSesiones);

module.exports = router;
