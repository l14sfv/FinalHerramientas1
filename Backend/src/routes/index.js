const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const subjectRoutes = require('./subjectRoutes');
const tutorRoutes = require('./tutorRoutes');
const sessionRoutes = require('./sessionRoutes');

router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/tutors', tutorRoutes);
router.use('/sessions', sessionRoutes);

module.exports = router;