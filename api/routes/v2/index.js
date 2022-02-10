const express = require('express');
const router = express.Router();

const chunks = require('./chunks/index');
const users = require('./users/index');
const auth = require('./auth/index');
const ai = require('./ai/index');
const models = require('./models/index');

router.use('/chunks', chunks);
router.use('/users', users);
router.use('/auth', auth);
router.use('/ai', ai);
router.use('/models', models);

module.exports = router;
