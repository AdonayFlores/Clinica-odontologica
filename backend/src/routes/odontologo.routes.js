const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/odontologo.controller');
const auth = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

// Ver odontólogos: todos los roles pueden verlos (para asignar/solicitar citas)
router.get('/', auth, requireRole('admin', 'asistente', 'dentista', 'paciente'), ctrl.getAll);
router.get('/:id', auth, requireRole('admin', 'asistente', 'dentista', 'paciente'), ctrl.getById);

// Crear, editar y eliminar: solo admin
router.post('/', auth, requireRole('admin'), ctrl.create);
router.put('/:id', auth, requireRole('admin'), ctrl.update);
router.delete('/:id', auth, requireRole('admin'), ctrl.remove);

module.exports = router;
