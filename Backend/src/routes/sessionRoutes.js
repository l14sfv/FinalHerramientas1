const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', sessionController.createSession);
router.get('/mine', sessionController.getMySessions);
router.patch('/:id/status', sessionController.updateSessionStatus);

module.exports = router;