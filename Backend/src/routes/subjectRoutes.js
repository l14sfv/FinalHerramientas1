const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/role');

router.get('/', subjectController.getAllSubjects);

// Solo admin crea materias
router.post(
    '/',
    authMiddleware,
    requireRole('ADMIN'),
    subjectController.createSubject
);

module.exports = router;