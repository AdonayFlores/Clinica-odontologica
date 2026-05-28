const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/stats.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, getStats);

module.exports = router;
