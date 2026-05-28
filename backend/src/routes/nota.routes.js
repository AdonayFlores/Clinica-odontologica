const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/nota.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/paciente/:id_paciente', auth, ctrl.getByPaciente);
router.post('/', auth, ctrl.create);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
