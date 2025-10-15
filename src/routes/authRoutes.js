// /src/routes/authRoutes.js

const express = require('express');
const { registerUser, authUser } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', authUser);

module.exports = router;
