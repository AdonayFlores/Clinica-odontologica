const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/odontograma.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/:id_paciente', auth, ctrl.getByPaciente);
router.post('/:id_paciente', auth, ctrl.save);

module.exports = router;
