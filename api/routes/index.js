const express = require('express');
const router = express.Router();

const v1 = require('./v1/index')
const audios = require('./audios/index')
const chunks = require('./chunks/index');

router.use('/v1', v1);
router.use('/audios', audios);
router.use('/chunks', chunks);

module.exports = router;