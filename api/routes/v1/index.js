const express = require('express');
const router = express.Router();

const audios = require('./audios/index');
const chunks = require('./chunks/index');
const samples = require('./samples/index');
const users = require('./users/index');

router.use('/chunks', chunks);
router.use('/audios', audios);
router.use('/samples', samples);
router.use('/users', users);

module.exports = router;
