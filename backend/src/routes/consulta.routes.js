const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/consulta.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);

module.exports = router;
