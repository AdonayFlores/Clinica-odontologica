const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// POST /api/auth/register — público, solo crea pacientes
router.post('/register', authController.register);

// POST /api/auth/recuperar-password — público
router.post('/recuperar-password', authController.recuperarPassword);

// POST /api/auth/cambiar-password-temporal — público
router.post('/cambiar-password-temporal', authController.cambiarPasswordTemporal);

module.exports = router;
