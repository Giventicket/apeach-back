const express = require('express');
const router = express.Router();

const audios = require('./audios/index');
const chunks = require('./chunks/index');

router.use('/chunks', chunks);
router.use('/audios', audios);

module.exports = router;
