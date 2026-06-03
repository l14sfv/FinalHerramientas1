const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');

router.get('/', tutorController.getTutors);
router.get('/:id', tutorController.getTutorById);

module.exports = router;