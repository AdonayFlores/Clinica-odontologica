const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/receta.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, ctrl.getAll);
router.get('/paciente/:id_paciente', auth, ctrl.getByPaciente);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, ctrl.create);

module.exports = router;
