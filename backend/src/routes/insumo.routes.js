const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/insumo.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);
router.get('/:id/stock', auth, ctrl.getStock);
router.post('/:id/stock', auth, ctrl.addStock);

module.exports = router;
