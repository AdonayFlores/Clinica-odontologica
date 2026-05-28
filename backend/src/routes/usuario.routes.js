const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usuario.controller');
const auth = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

// Cualquier usuario autenticado puede ver su propio perfil
router.get('/:id', auth, ctrl.getById);
router.patch('/:id/cambiar-password', auth, ctrl.changePassword);

// Solo admin puede listar, crear o editar usuarios
router.get('/', auth, requireRole('admin'), ctrl.getAll);
router.post('/', auth, requireRole('admin'), ctrl.create);
router.put('/:id', auth, requireRole('admin'), ctrl.update);

module.exports = router;
