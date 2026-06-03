const express = require('express');
const router = express.Router();
const tutores = require('../controladores/tutores');

router.get('/', tutores.listar);
router.get('/:id', tutores.obtenerPorId);

module.exports = router;
