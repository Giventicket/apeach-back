const express = require('express');
const router = express.Router();

const audios = require('./audios/index');
const chunks = require('./chunks/index');
const users = require('./users/index');
const auth = require('./auth/index');
const ai = require('./ai/index');

router.use('/chunks', chunks);
router.use('/audios', audios);
router.use('/users', users);
router.use('/auth', auth);
router.use('/ai', ai);

module.exports = router;
