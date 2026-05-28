const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificacion.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, ctrl.getAll);
router.post('/', auth, ctrl.create);
router.patch('/:id/leer', auth, ctrl.markRead);
router.patch('/leer-todas', auth, ctrl.markAllRead);

module.exports = router;
