const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/log.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, getLogs);

module.exports = router;
