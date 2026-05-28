const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paciente.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, ctrl.getAll);
router.get('/perfil/me', auth, ctrl.getMiPerfil);
router.get('/perfil/me/citas', auth, ctrl.getMisCitas);
router.get('/perfil/me/historial', auth, ctrl.getMiHistorial);
router.get('/perfil/me/recetas', auth, ctrl.getMisRecetas);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);
router.get('/:id/historial', auth, ctrl.getHistorial);
router.post('/:id/crear-acceso', auth, ctrl.crearAcceso);

module.exports = router;
